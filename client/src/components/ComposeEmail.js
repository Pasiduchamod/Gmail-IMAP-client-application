import React, { useState } from 'react';
import axios from 'axios';
import './ComposeEmail.css';

function ComposeEmail({ onClose, onSend }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      await axios.post('/api/email/send', {
        to,
        subject,
        text: body
      }, { withCredentials: true });

      onSend();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="compose-overlay">
      <div className="compose-modal">
        <div className="compose-header">
          <h2>New Message</h2>
          <button onClick={onClose} className="close-button" disabled={sending}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="compose-form">
          <div className="compose-field">
            <label>To:</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              disabled={sending}
            />
          </div>

          <div className="compose-field">
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
              disabled={sending}
            />
          </div>

          <div className="compose-field body-field">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your message..."
              required
              disabled={sending}
            />
          </div>

          {error && <div className="compose-error">{error}</div>}

          <div className="compose-actions">
            <button type="submit" className="send-button" disabled={sending}>
              {sending ? 'Sending...' : '📤 Send'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-button"
              disabled={sending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComposeEmail;
