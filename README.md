# Gmail IMAP Client

A full-featured Gmail client built with React and Node.js that uses IMAP protocol to access Gmail accounts.

## Features

- 🔐 **Secure Authentication** - Login with Gmail credentials
- 📧 **Read Emails** - View emails from Inbox and other folders
- ✉️ **Send Emails** - Compose and send new emails
- 🗂️ **Folder Management** - Access all Gmail folders (Inbox, Sent, Drafts, Trash, etc.)
- 🗑️ **Delete Emails** - Remove unwanted emails
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Real-time Updates** - Refresh to get latest emails

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Gmail Account** with IMAP enabled

## Gmail Setup

### Step 1: Enable IMAP in Gmail

1. Go to [Gmail Settings](https://mail.google.com/mail/u/0/#settings/fwdandpop)
2. Click on **"Forwarding and POP/IMAP"** tab
3. In the **"IMAP access"** section, select **"Enable IMAP"**
4. Click **"Save Changes"**

### Step 2: Create App Password (Required for 2FA)

If you have 2-factor authentication enabled (recommended), you need to create an App Password:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left menu
3. Under **"Signing in to Google"**, select **"App Passwords"**
4. You may need to sign in again
5. At the bottom, select **"Mail"** and **"Other (Custom name)"**
6. Enter "Gmail IMAP Client" as the name
7. Click **"Generate"**
8. Copy the 16-character password (you'll use this instead of your regular password)

**Note:** If you don't have 2FA enabled, you can use your regular Gmail password, but it's recommended to enable 2FA and use App Passwords for better security.

## Installation

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd "d:\Projects\Axle-Solutions\Gmail"
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install client dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
copy .env.example .env
```

Edit the `.env` file and update:
```
PORT=5000
SESSION_SECRET=your-random-secret-key-here
```

**Important:** Change `SESSION_SECRET` to a random string for security.

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - React Client:**
```bash
npm run client
```

The application will open automatically at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Usage Guide

### 1. Login

1. Open http://localhost:3000 in your browser
2. Enter your Gmail address
3. Enter your password or App Password (if using 2FA)
4. Click **"Sign In"**

### 2. Reading Emails

- Emails are displayed in the left panel
- Click on any email to read its full content
- Use the folder navigation on the sidebar to switch between folders

### 3. Sending Emails

1. Click the **"✏️ Compose"** button in the sidebar
2. Fill in:
   - **To:** Recipient's email address
   - **Subject:** Email subject
   - **Body:** Your message
3. Click **"📤 Send"**

### 4. Managing Emails

- **Delete:** Open an email and click the 🗑️ delete button
- **Refresh:** Click the 🔄 Refresh button to get new emails
- **Switch Folders:** Click on different folders in the sidebar

### 5. Logout

Click the **"Logout"** button in the top-right corner

## Troubleshooting

### "Failed to connect to Gmail IMAP server"

**Solutions:**
1. Ensure IMAP is enabled in Gmail settings
2. If using 2FA, make sure you're using an App Password
3. Check your internet connection
4. Verify your Gmail credentials are correct

### "Login failed"

**Solutions:**
1. Double-check your email and password
2. If you have 2FA, use App Password instead of regular password
3. Try disabling browser extensions that might interfere
4. Clear browser cache and cookies

### Server won't start

**Solutions:**
1. Make sure port 5000 is not in use by another application
2. Check if all dependencies are installed: `npm install`
3. Verify Node.js version: `node --version` (should be v14+)

### React app won't start

**Solutions:**
1. Make sure port 3000 is available
2. Install client dependencies: `cd client && npm install`
3. Clear npm cache: `npm cache clean --force`

## Security Considerations

### Important Security Notes:

1. **Never commit `.env` file** - It contains sensitive configuration
2. **Use App Passwords** - More secure than regular passwords
3. **HTTPS in Production** - Always use HTTPS for production deployments
4. **Session Security** - Change SESSION_SECRET to a strong random value
5. **Keep Dependencies Updated** - Regularly update packages for security patches

### Production Deployment:

For production, you should:
1. Use HTTPS/SSL certificates
2. Encrypt stored credentials
3. Implement rate limiting
4. Add CSRF protection
5. Use environment variables for all sensitive data
6. Enable secure cookies (set `secure: true` in session config)

## Project Structure

```
Gmail/
├── server/                 # Backend server
│   ├── index.js           # Server entry point
│   └── routes/            # API routes
│       ├── auth.js        # Authentication routes
│       └── email.js       # Email operations routes
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmailList.js
│   │   │   ├── EmailView.js
│   │   │   └── ComposeEmail.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   └── package.json       # Client dependencies
├── .env                   # Environment variables (create this)
├── .env.example           # Example environment file
├── package.json           # Root dependencies
└── README.md              # This file
```

## Technologies Used

### Backend:
- **Express.js** - Web framework
- **node-imap** - IMAP client for reading emails
- **nodemailer** - SMTP client for sending emails
- **mailparser** - Parse email content
- **express-session** - Session management

### Frontend:
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check authentication status

### Email Operations
- `GET /api/email/fetch` - Fetch emails from folder
- `GET /api/email/message/:uid` - Get specific email
- `POST /api/email/send` - Send new email
- `DELETE /api/email/message/:uid` - Delete email
- `GET /api/email/folders` - Get all folders

## Known Limitations

1. **Attachments:** Currently only displays attachment info, download feature to be added
2. **Search:** Email search functionality not yet implemented
3. **Labels:** Gmail labels management not yet implemented
4. **Draft Saving:** Cannot save drafts yet
5. **Reply/Forward:** Reply and forward features to be added

## Future Enhancements

- [ ] Download email attachments
- [ ] Reply and forward emails
- [ ] Search emails
- [ ] Manage Gmail labels
- [ ] Save drafts
- [ ] Rich text editor for composing
- [ ] Email pagination
- [ ] Mark as read/unread
- [ ] Star emails
- [ ] Bulk operations

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are met
3. Verify Gmail IMAP is enabled
4. Check that all dependencies are installed

## License

ISC

---

**Created with ❤️ using React and Node.js**
#   G m a i l - I M A P - c l i e n t - a p p l i c a t i o n  
 