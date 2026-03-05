import React, { useState } from 'react';
import './SignUp.css';
import Logo from '../../assets/Pictures/SignInLogo.png';  
import axios from 'axios';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const dataToSend = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      password: form.password
    };

    axios.post('http://localhost:8080/api/auth/register', dataToSend)
      .then(response => {
        console.log('Sign Up successful:', response.data);
        alert('Account created successfully! Please sign in.');
        window.location.href = '/signin';
      })
      .catch(error => {
        console.error('Sign Up error:', error);
        alert('Error creating account. Please try again.');
      }); 
  };

  return (
    <div className="signup-page">
      <div className="top-right-link">
        <a href="/signin" className="signin-btn">Sign in</a>
      </div>

      <div className="form-container">
        <div className="logo-section">
        <img 
            src={Logo} 
            alt="Hotel Logo" 
            className="logo" />
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="create-btn">
            Create Account
          </button>
        </form>

        <p className="signin-redirect">
          Already have an account? <a href="/signin">Sign in here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;