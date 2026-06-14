import React, { useState, useEffect } from 'react';
import './SignIn.css';
import axios from 'axios';
import Logo from '../../assets/Pictures/SignInLogo.png';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useContext(AuthContext);
  const navigate              = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({ appId: 'YOUR_REAL_FACEBOOK_APP_ID', cookie: true, xfbml: true, version: 'v20.0' });
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const getDashboardPath = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return '/admin';
      case 'CUSTOMER': return '/';
      case 'DELIVERY_STAFF': return '/delivery';
      default: return '/';
    }
  };

  const mapUserFromAuth = (data) => {
    const u = data.user;
    const img = u.userImage || u.picture || '';
    return { name: `${u.firstName||''} ${u.lastName||''}`.trim()||u.email, email:u.email, firstName:u.firstName, lastName:u.lastName, phoneNumber:u.phoneNumber, picture:img, userImage:img, role:u.role };
  };

  const storeTokenByRole = (role, token) => {
    localStorage.removeItem('adminToken'); localStorage.removeItem('customerToken'); localStorage.removeItem('deliveryToken');
    const r = role?.toUpperCase();
    if (r==='ADMIN') localStorage.setItem('adminToken', token);
    else if (r==='DELIVERY_STAFF') localStorage.setItem('deliveryToken', token);
    else localStorage.setItem('customerToken', token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', { email: form.email, password: form.password });
      const user = mapUserFromAuth(res.data);
      login(user); storeTokenByRole(user.role, res.data.token); navigate(getDashboardPath(user.role));
    } catch (err) { setError(err.response?.data || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8081/api/auth/google-login', { idToken: credentialResponse.credential });
      const user = mapUserFromAuth(res.data);
      login(user); storeTokenByRole(user.role, res.data.token); navigate(getDashboardPath(user.role));
    } catch { setError('Google sign-in failed. Please try again.'); }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) { setError('Facebook not ready — please wait a moment.'); return; }
    window.FB.login((response) => {
      if (response.authResponse) {
        axios.post('http://localhost:8081/api/auth/facebook-login', { accessToken: response.authResponse.accessToken })
          .then(res => { const user = mapUserFromAuth(res.data); login(user); storeTokenByRole(user.role, res.data.token); navigate(getDashboardPath(user.role)); })
          .catch(() => setError('Facebook sign-in failed.'));
      } else { setError('Facebook sign-in was cancelled.'); }
    }, { scope: 'public_profile,email' });
  };

  return (
    <div className="signin-page">
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
        <a href="/signup" className="signup-btn">Create account</a>
      </div>

      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>

        {/* Gold ornament divider */}
        <div className="logo-divider">
          <div className="logo-divider-line" />
          <div className="logo-divider-diamond" />
          <div className="logo-divider-line" />
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" required autoFocus />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="forgot-link">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        <div className="social-login">
          <div className="social-btn-google">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in failed.')} useOneTap text="signin_with" shape="pill" />
          </div>
          <button className="social-btn-facebook" onClick={handleFacebookLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <p className="signup-redirect">
          New here? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;