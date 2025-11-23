# Quick Start Guide

## What You Need to Do Next

### 1. Install Dependencies (5 minutes)

Open PowerShell in the project folder and run:

```powershell
# Navigate to your project
cd "d:\Projects\Axle-Solutions\Gmail"

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Set Up Gmail (10 minutes)

#### Enable IMAP in Gmail:
1. Go to https://mail.google.com/mail/u/0/#settings/fwdandpop
2. Click "Forwarding and POP/IMAP" tab
3. Select "Enable IMAP"
4. Click "Save Changes"

#### Create App Password (if you have 2FA):
1. Go to https://myaccount.google.com/security
2. Click "App Passwords" under "Signing in to Google"
3. Select "Mail" and "Other (Custom name)"
4. Enter "Gmail Client" as name
5. Click "Generate"
6. **Copy the 16-character password** - you'll use this to login

### 3. Configure Environment (1 minute)

```powershell
# Create .env file
copy .env.example .env
```

Edit `.env` file and change the SESSION_SECRET to any random string:
```
SESSION_SECRET=my-secret-key-12345
```

### 4. Start the Application (1 minute)

```powershell
# Run both server and client
npm run dev
```

Wait for the browser to open automatically at http://localhost:3000

### 5. Login and Use

1. Enter your Gmail address
2. Enter your App Password (or regular password if no 2FA)
3. Start using your Gmail client!

## Common Issues

**"Failed to connect to IMAP server"**
→ Make sure IMAP is enabled in Gmail settings

**"Login failed"**
→ If you have 2FA, you MUST use App Password, not your regular password

**Port already in use**
→ Close any other applications using port 5000 or 3000

---

That's it! Your Gmail IMAP client should now be running. 🎉
