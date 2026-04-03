import React, { useState } from 'react';
import '../SignIn/SignIn.css';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Pictures/SignInLogo.png';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('http://localhost:8081/api/auth/forgot-password', { email });
      setMessage('Reset link sent to your email. Check your inbox.');
    } catch (err) {
      setMessage(err.response?.data || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="top-right-link">
        <a href="/signin" className="signin-btn">Sign In</a>
      </div>
      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required />
          </div>
          {message && <p style={{ color: message.includes('sent') ? '#16a34a' : '#dc2626', textAlign: 'center' }}>{message}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;