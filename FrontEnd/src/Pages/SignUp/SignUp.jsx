import React, { useState } from 'react';
import '../SignIn/SignIn.css';
import api from '../../utils/axiosInstance';
import Logo from '../../assets/Pictures/SignInLogo.png';

const SignUp = () => {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phoneNumber:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError("Passwords don't match."); return; }
    const dataToSend = { firstName:form.firstName.trim(), lastName:form.lastName.trim(), email:form.email.trim().toLowerCase(), phoneNumber:form.phoneNumber.trim(), password:form.password };
    if (Object.values(dataToSend).some(v => !v)) { setError('All fields are required.'); return; }
    setLoading(true);
    try {
      await api.post('/api/auth/register', dataToSend);
      alert('Account created! Please sign in.');
      window.location.href = '/signin';
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message;
      setError(msg || 'Could not create account. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="signup-page">
      {/* Corner ornaments */}
      <div className="auth-corner auth-corner--tl">
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="258" height="258" stroke="#d4af37" strokeWidth="1"/>
          <rect x="30" y="30" width="200" height="200" stroke="#d4af37" strokeWidth="1"/>
          <line x1="0" y1="130" x2="260" y2="130" stroke="#d4af37" strokeWidth="0.5"/>
          <line x1="130" y1="0" x2="130" y2="260" stroke="#d4af37" strokeWidth="0.5"/>
          <circle cx="130" cy="130" r="40" stroke="#d4af37" strokeWidth="1"/>
        </svg>
      </div>
      <div className="auth-corner auth-corner--br">
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="258" height="258" stroke="#d4af37" strokeWidth="1"/>
          <rect x="30" y="30" width="200" height="200" stroke="#d4af37" strokeWidth="1"/>
          <line x1="0" y1="130" x2="260" y2="130" stroke="#d4af37" strokeWidth="0.5"/>
          <line x1="130" y1="0" x2="130" y2="260" stroke="#d4af37" strokeWidth="0.5"/>
          <circle cx="130" cy="130" r="40" stroke="#d4af37" strokeWidth="1"/>
        </svg>
      </div>

      <div className="top-right-link">
        <a href="/signin" className="signin-btn">Sign In</a>
      </div>

      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>

        <div className="logo-divider">
          <div className="logo-divider-line" />
          <div className="logo-divider-diamond" />
          <div className="logo-divider-line" />
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {/* Name row — both columns stay inside card */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="Namal" required autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Bandara" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <input id="phoneNumber" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="+94 77 123 4567" required />
          </div>

          {/* Password row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="signup-redirect">
          Already a member? <a href="/signin">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;