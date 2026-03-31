import React, { useState, useEffect } from 'react';
import './SignIn.css';
import axios from 'axios';
import Logo from '../../assets/Pictures/SignInLogo.png';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'YOUR_REAL_FACEBOOK_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const getDashboardPath = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return '/admin';
      case 'CUSTOMER':
        return '/';
      case 'DELIVERY':
      case 'DELIVERY_STAFF':
        return '/delivery';
      default:
        return '/';
    }
  };

  const mapUserFromAuth = (data) => {
    const u = data.user;
    const img = u.userImage || u.picture || '';
    return {
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNumber: u.phoneNumber,
      picture: img,
      userImage: img,
      role: u.role,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      const data = response.data;
      const user = mapUserFromAuth(data);
      login(user);

      if (user.role?.toUpperCase() === 'ADMIN') {
        localStorage.setItem('adminToken', data.token);
      } else {
        localStorage.setItem('customerToken', data.token);
      }

      navigate(getDashboardPath(user.role));
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/google-login', {
        idToken: credentialResponse.credential
      });
      const data = response.data;
      const user = mapUserFromAuth(data);
      login(user);

      if (user.role?.toUpperCase() === 'ADMIN') {
        localStorage.setItem('adminToken', data.token);
      } else {
        localStorage.setItem('customerToken', data.token);
      }

      navigate(getDashboardPath(user.role));
    } catch (err) {
      setError('Google login failed');
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setError('Facebook not ready yet – wait a few seconds and try again');
      return;
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        axios.post('http://localhost:8080/api/auth/facebook-login', {
          accessToken: response.authResponse.accessToken
        })
        .then(res => {
          const data = res.data;
          const user = mapUserFromAuth(data);
          login(user);

          if (user.role?.toUpperCase() === 'ADMIN') {
            localStorage.setItem('adminToken', data.token);
          } else {
            localStorage.setItem('customerToken', data.token);
          }

          navigate(getDashboardPath(user.role));
        })
        .catch(() => setError('Facebook login failed'));
      } else {
        setError('Facebook login cancelled');
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <div className="signin-page">
      <div className="top-right-link">
        <a href="/signup" className="signup-btn">Sign Up</a>
      </div>

      <div className="form-wrapper">
        <div className="logo-section">
          <img src={Logo} alt="Hotel Logo" className="logo" />
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
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
              autoFocus
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

          <div className="forgot-link">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '0.95rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="social-login">
          <h3>Or continue with</h3>

          <div style={{ margin: '1.2rem 0' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              useOneTap
              text="signin_with"
              shape="pill"
            />
          </div>

          <button
            onClick={handleFacebookLogin}
            style={{
              background: '#1877f2',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              marginTop: '0.8rem'
            }}
          >
            Continue with Facebook
          </button>
        </div>

        <p className="signup-redirect">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;