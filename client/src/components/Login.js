import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        onLogin(email);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Gmail IMAP Client</h1>
          <p>Sign in with your Gmail account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password or App Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="info-text">
            ⚠️ <strong>Important:</strong> You need to enable IMAP in your Gmail settings and use an App Password if you have 2-factor authentication enabled.
          </p>
          <a 
            href="https://support.google.com/mail/answer/7126229" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            How to enable IMAP?
          </a>
          <a 
            href="https://support.google.com/accounts/answer/185833" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            How to create App Password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
