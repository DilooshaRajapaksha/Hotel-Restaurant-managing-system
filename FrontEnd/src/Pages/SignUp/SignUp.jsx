import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import Logo from '../../assets/Pictures/SignInLogo.png';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const dataToSend = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', dataToSend);
      console.log('Signup success:', response.data);
      alert('Account created! Please sign in.');
      window.location.href = '/signin';
    } catch (err) {
      console.error('Signup failed:', err);
      setError(
        err.response?.data?.message ||
        'Could not create account. Email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page"> 
      <div className="top-right-link">
        <a href="/signin" className="signin-btn">
          Sign In
        </a>
      </div>

      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Namal"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Bandara"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+94 77 123 4567"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '0.95rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="signup-redirect">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;