import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailList from './EmailList';
import EmailView from './EmailView';
import ComposeEmail from './ComposeEmail';
import './Dashboard.css';

function Dashboard({ userEmail, onLogout }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('INBOX');

  useEffect(() => {
    fetchEmails();
    fetchFolders();
  }, [currentFolder]);

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/email/fetch?folder=${currentFolder}&limit=50`, {
        withCredentials: true
      });
      setEmails(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await axios.get('/api/email/folders', {
        withCredentials: true
      });
      setFolders(response.data);
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    }
  };

  const handleEmailClick = async (email) => {
    try {
      const response = await axios.get(`/api/email/message/${email.uid}?folder=${currentFolder}`, {
        withCredentials: true
      });
      setSelectedEmail(response.data);
    } catch (err) {
      setError('Failed to load email content');
    }
  };

  const handleDeleteEmail = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this email?')) {
      return;
    }

    try {
      await axios.delete(`/api/email/message/${uid}?folder=${currentFolder}`, {
        withCredentials: true
      });
      setEmails(emails.filter(e => e.uid !== uid));
      setSelectedEmail(null);
    } catch (err) {
      setError('Failed to delete email');
    }
  };

  const handleSendEmail = async () => {
    setShowCompose(false);
    // Optionally refresh emails
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📧 Gmail Client</h1>
        <div className="header-actions">
          <span className="user-email">{userEmail}</span>
          <button onClick={() => fetchEmails()} className="refresh-button" disabled={loading}>
            🔄 Refresh
          </button>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <button 
            className="compose-button"
            onClick={() => setShowCompose(true)}
          >
            ✏️ Compose
          </button>

          <nav className="folder-list">
            <h3>Folders</h3>
            <button 
              className={`folder-item ${currentFolder === 'INBOX' ? 'active' : ''}`}
              onClick={() => setCurrentFolder('INBOX')}
            >
              📥 Inbox
            </button>
            <button 
              className={`folder-item ${currentFolder === '[Gmail]/Sent Mail' ? 'active' : ''}`}
              onClick={() => setCurrentFolder('[Gmail]/Sent Mail')}
            >
              📤 Sent
            </button>
            <button 
              className={`folder-item ${currentFolder === '[Gmail]/Drafts' ? 'active' : ''}`}
              onClick={() => setCurrentFolder('[Gmail]/Drafts')}
            >
              📝 Drafts
            </button>
            <button 
              className={`folder-item ${currentFolder === '[Gmail]/Trash' ? 'active' : ''}`}
              onClick={() => setCurrentFolder('[Gmail]/Trash')}
            >
              🗑️ Trash
            </button>
            
            {folders.length > 0 && (
              <details className="more-folders">
                <summary>More Folders</summary>
                {folders.map(folder => (
                  <button
                    key={folder.name}
                    className={`folder-item sub-folder ${currentFolder === folder.name ? 'active' : ''}`}
                    onClick={() => setCurrentFolder(folder.name)}
                  >
                    📁 {folder.displayName}
                  </button>
                ))}
              </details>
            )}
          </nav>
        </aside>

        <main className="main-content">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError('')}>✕</button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading emails...</p>
            </div>
          ) : (
            <div className="email-container">
              <EmailList 
                emails={emails} 
                onEmailClick={handleEmailClick}
                selectedEmail={selectedEmail}
              />
              <EmailView 
                email={selectedEmail}
                onDelete={handleDeleteEmail}
                onClose={() => setSelectedEmail(null)}
              />
            </div>
          )}
        </main>
      </div>

      {showCompose && (
        <ComposeEmail 
          onClose={() => setShowCompose(false)}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
}

export default Dashboard;
