import React from 'react';
import './EmailView.css';

function EmailView({ email, onDelete, onClose }) {
  if (!email) {
    return (
      <div className="email-view empty">
        <div className="empty-view">
          <p>📧 Select an email to read</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="email-view">
      <div className="email-view-header">
        <div className="email-actions">
          <button onClick={onClose} className="action-button" title="Close">
            ✕
          </button>
          <button 
            onClick={() => onDelete(email.uid)} 
            className="action-button delete"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="email-view-content">
        <div className="email-header-info">
          <h2 className="email-title">{email.subject || '(No subject)'}</h2>
          
          <div className="email-meta">
            <div className="email-participants">
              <div className="participant">
                <span className="label">From:</span>
                <span className="value">{email.from}</span>
              </div>
              <div className="participant">
                <span className="label">To:</span>
                <span className="value">{email.to}</span>
              </div>
            </div>
            <div className="email-timestamp">
              {formatDate(email.date)}
            </div>
          </div>
        </div>

        <div className="email-body">
          {email.html ? (
            <iframe
              srcDoc={email.html}
              title="Email content"
              className="email-html-frame"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="email-text">
              {email.text || 'No content'}
            </div>
          )}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="email-attachments">
            <h3>Attachments ({email.attachments.length})</h3>
            <div className="attachment-list">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span className="attachment-icon">📎</span>
                  <div className="attachment-info">
                    <div className="attachment-name">{attachment.filename}</div>
                    <div className="attachment-size">
                      {(attachment.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailView;
