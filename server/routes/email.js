const express = require('express');
const router = express.Router();
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Helper function to create IMAP connection
const createImapConnection = (email, password) => {
  return new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });
};

// Fetch emails
router.get('/fetch', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.session.user;
    const { folder = 'INBOX', limit = 20 } = req.query;

    const imap = createImapConnection(email, password);
    const emails = [];

    imap.once('ready', () => {
      imap.openBox(folder, true, (err, box) => {
        if (err) {
          console.error('Error opening box:', err);
          return res.status(500).json({ error: 'Failed to open mailbox' });
        }

        const totalMessages = box.messages.total;
        if (totalMessages === 0) {
          imap.end();
          return res.json([]);
        }

        const fetchLimit = Math.min(parseInt(limit), totalMessages);
        const start = Math.max(1, totalMessages - fetchLimit + 1);
        
        const fetch = imap.seq.fetch(`${start}:${totalMessages}`, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          let emailData = { seqno };

          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });

            stream.once('end', () => {
              if (info.which === 'TEXT') {
                emailData.body = buffer;
              } else {
                const parsed = Imap.parseHeader(buffer);
                emailData.from = parsed.from ? parsed.from[0] : '';
                emailData.to = parsed.to ? parsed.to[0] : '';
                emailData.subject = parsed.subject ? parsed.subject[0] : '';
                emailData.date = parsed.date ? parsed.date[0] : '';
              }
            });
          });

          msg.once('attributes', (attrs) => {
            emailData.uid = attrs.uid;
            emailData.flags = attrs.flags;
          });

          msg.once('end', () => {
            emails.push(emailData);
          });
        });

        fetch.once('error', (err) => {
          console.error('Fetch error:', err);
          imap.end();
          res.status(500).json({ error: 'Failed to fetch emails' });
        });

        fetch.once('end', () => {
          imap.end();
          // Sort by seqno descending (newest first)
          emails.sort((a, b) => b.seqno - a.seqno);
          res.json(emails);
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      res.status(500).json({ error: 'Failed to connect to Gmail IMAP server. Please check your credentials and ensure IMAP is enabled.' });
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  } catch (error) {
    console.error('Email fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get email by ID
router.get('/message/:uid', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.session.user;
    const { uid } = req.params;
    const { folder = 'INBOX' } = req.query;

    const imap = createImapConnection(email, password);

    imap.once('ready', () => {
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          console.error('Error opening box:', err);
          return res.status(500).json({ error: 'Failed to open mailbox' });
        }

        const fetch = imap.fetch(uid, { bodies: '' });

        fetch.on('message', (msg, seqno) => {
          msg.on('body', async (stream, info) => {
            try {
              const parsed = await simpleParser(stream);
              
              imap.end();
              res.json({
                uid,
                from: parsed.from?.text || '',
                to: parsed.to?.text || '',
                subject: parsed.subject || '',
                date: parsed.date || '',
                text: parsed.text || '',
                html: parsed.html || '',
                attachments: parsed.attachments?.map(att => ({
                  filename: att.filename,
                  contentType: att.contentType,
                  size: att.size
                })) || []
              });
            } catch (parseError) {
              console.error('Parse error:', parseError);
              imap.end();
              res.status(500).json({ error: 'Failed to parse email' });
            }
          });
        });

        fetch.once('error', (err) => {
          console.error('Fetch error:', err);
          imap.end();
          res.status(500).json({ error: 'Failed to fetch email' });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      res.status(500).json({ error: 'Failed to connect to IMAP server' });
    });

    imap.connect();
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Send email
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.session.user;
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });

    const mailOptions = {
      from: email,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get folders
router.get('/folders', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.session.user;
    const imap = createImapConnection(email, password);

    imap.once('ready', () => {
      imap.getBoxes((err, boxes) => {
        imap.end();
        
        if (err) {
          console.error('Error getting boxes:', err);
          return res.status(500).json({ error: 'Failed to get folders' });
        }

        const folderList = [];
        const parseBoxes = (boxes, prefix = '') => {
          for (const [name, box] of Object.entries(boxes)) {
            const fullPath = prefix ? `${prefix}${box.delimiter}${name}` : name;
            folderList.push({
              name: fullPath,
              displayName: name,
              attributes: box.attribs
            });
            if (box.children) {
              parseBoxes(box.children, fullPath);
            }
          }
        };

        parseBoxes(boxes);
        res.json(folderList);
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      res.status(500).json({ error: 'Failed to connect to IMAP server' });
    });

    imap.connect();
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Delete email
router.delete('/message/:uid', requireAuth, async (req, res) => {
  try {
    const { email, password } = req.session.user;
    const { uid } = req.params;
    const { folder = 'INBOX' } = req.query;

    const imap = createImapConnection(email, password);

    imap.once('ready', () => {
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          console.error('Error opening box:', err);
          return res.status(500).json({ error: 'Failed to open mailbox' });
        }

        imap.addFlags(uid, ['\\Deleted'], (err) => {
          if (err) {
            console.error('Error marking for deletion:', err);
            imap.end();
            return res.status(500).json({ error: 'Failed to delete email' });
          }

          imap.expunge((err) => {
            imap.end();
            if (err) {
              console.error('Error expunging:', err);
              return res.status(500).json({ error: 'Failed to delete email' });
            }
            res.json({ success: true, message: 'Email deleted successfully' });
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      res.status(500).json({ error: 'Failed to connect to IMAP server' });
    });

    imap.connect();
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

module.exports = router;
