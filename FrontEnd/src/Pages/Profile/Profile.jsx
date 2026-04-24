import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/NavBar/NavBar';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axiosInstance';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [previewPic, setPreviewPic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPreviewPic(user.userImage || user.picture || '');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const goToMyOrders = () => navigate('/my-orders');
  const goToCurrentOrders = () => navigate('/my-orders?tab=current');
  const goToPreviousOrders = () => navigate('/my-orders?tab=previous');
  const goToOrderTracking = () => navigate('/order-tracking');

  const handleSave = async () => {
    setMessage('');
    const trimmed = formData.name.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    let updatedPicture = user.userImage || user.picture || '';
    if (selectedFile && previewPic) {
      updatedPicture = previewPic;
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage('Passwords do not match. Profile not updated.');
        return;
      }
      if (!formData.currentPassword) {
        setMessage('Enter your current password to set a new one.');
        return;
      }
    }

    try {
      const profileRes = await api.post('/api/auth/update-profile', {
        firstName,
        lastName,
        email: formData.email.trim(),
        phoneNumber: user.phoneNumber || '',
        userImage: updatedPicture && !String(updatedPicture).includes('via.placeholder.com') ? updatedPicture : null,
      });

      const data = profileRes.data;
      if (data.token) {
        if (user.role?.toUpperCase() === 'ADMIN') {
          localStorage.setItem('adminToken', data.token);
        } else {
          localStorage.setItem('customerToken', data.token);
        }
      }
      const u = data.user;
      const img = u.userImage || '';
      updateUser({
        ...user,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || formData.name,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        picture: img,
        userImage: img,
      });
      setPreviewPic(img || '');
      setSelectedFile(null);

      if (formData.newPassword && formData.confirmPassword) {
        await api.post('/api/auth/update-password', {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data;
      setMessage(typeof msg === 'string' ? msg : 'Could not update profile.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">
        <div className="profile-sidebar-left"></div>
        <div className="profile-sidebar-right">
          <div className="profile-content">
            <h1 className="profile-title">My Profile</h1>
            
            <div className="profile-avatar">
              <img src={previewPic || 'https://via.placeholder.com/160'} alt="Profile Picture" className="avatar-img" />
              <label className="upload-btn">
                Change Picture
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Required only to change password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
              </div>
              <div className="profile-buttons">
                <button onClick={handleSave} className="save-btn">Save Changes</button>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </div>

            {message && <p className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}

            <div className="orders-section">
              <h2 className="section-title">My Orders</h2>
              <p className="section-subtitle">View and track your restaurant orders</p>

              <div className="orders-grid">
                <div className="order-card" onClick={goToMyOrders}>
                  <div className="order-icon">📋</div>
                  <h3>All Orders</h3>
                  <p>View complete order history</p>
                  <button className="order-btn">View All</button>
                </div>

                <div className="order-card" onClick={goToCurrentOrders}>
                  <div className="order-icon">🔄</div>
                  <h3>Current Orders</h3>
                  <p>Active & Preparing orders</p>
                  <button className="order-btn primary">Track Live</button>
                </div>

                <div className="order-card" onClick={goToPreviousOrders}>
                  <div className="order-icon">✅</div>
                  <h3>Previous Orders</h3>
                  <p>Completed & Cancelled</p>
                  <button className="order-btn">View History</button>
                </div>

                <div className="order-card" onClick={goToOrderTracking}>
                  <div className="order-icon">🚚</div>
                  <h3>Order Tracking</h3>
                  <p>Track delivery in real-time</p>
                  <button className="order-btn primary">Track Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;