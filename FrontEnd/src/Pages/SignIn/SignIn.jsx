import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import Logo from '../../assets/Pictures/SignInLogo.png';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In →', { email, password });

  axios.post('http://localhost:8080/api/auth/login', { email, password })
    .then(response => {
      console.log('Sign In successful:', response.data);
      alert('Login successful!');
      window.location.href = '/';
    })
    .catch(error => {
      console.error('Login failed:', error);
      if (error.response) {
        const msg = error.response.data || 'Wrong Email or Password';
        alert(msg);
      } else {
        alert('Server error or network issue');
      }
    });
};

  return (
    <div className="signinPage">
      <div className="top-right-link">
        <a href="/signup" 
          className="signup-btn">
          Sign up
        </a>
      </div>

      <div className="form-container">
        <div className="logo-section">
          <img 
            src={Logo} 
            alt="Hotel Logo" 
            className="logo" />
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="signup-redirect">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;