import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../SignIn/SignIn.css';
import axios from 'axios';
import Logo from '../../assets/Pictures/SignInLogo.png';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setMessage('Invalid reset link');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword });
      setMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setMessage(err.response?.data || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {message && <p style={{ color: message.includes('success') ? '#16a34a' : '#dc2626', textAlign: 'center' }}>{message}</p>}
          <button type="submit" className="login-btn" disabled={loading || !token}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;