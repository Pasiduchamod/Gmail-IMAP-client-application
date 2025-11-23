import React from 'react';
import './EmailList.css';

function EmailList({ emails, onEmailClick, selectedEmail }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const emailDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (emailDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (emailDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else if (emailDate.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const extractEmail = (emailString) => {
    const match = emailString.match(/<(.+?)>/);
    return match ? match[1] : emailString;
  };

  const extractName = (emailString) => {
    const match = emailString.match(/^"?([^"<]+)"?\s*</);
    if (match) {
      return match[1].trim();
    }
    return extractEmail(emailString);
  };

  return (
    <div className="email-list">
      <div className="email-list-header">
        <h2>Emails ({emails.length})</h2>
      </div>
      
      <div className="email-list-content">
        {emails.length === 0 ? (
          <div className="empty-state">
            <p>📭 No emails found</p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.uid}
              className={`email-item ${selectedEmail?.uid === email.uid ? 'selected' : ''}`}
              onClick={() => onEmailClick(email)}
            >
              <div className="email-item-header">
                <span className="email-from">{extractName(email.from)}</span>
                <span className="email-date">{formatDate(email.date)}</span>
              </div>
              <div className="email-subject">
                {email.subject || '(No subject)'}
              </div>
              <div className="email-preview">
                {email.body ? email.body.substring(0, 100).replace(/\s+/g, ' ').trim() : ''}...
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmailList;
