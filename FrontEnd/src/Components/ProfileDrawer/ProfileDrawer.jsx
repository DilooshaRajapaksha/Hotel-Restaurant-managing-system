import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './ProfileDrawer.css';

const ProfileDrawer = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [previewPic, setPreviewPic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPreviewPic(user.picture || '');
    }
  }, [user]);

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

  const handleSave = async () => {
    let updatedPicture = user.picture;
    if (selectedFile && previewPic) {
      updatedPicture = previewPic;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      picture: updatedPicture
    };

    if (formData.newPassword && formData.confirmPassword) {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    if (!formData.currentPassword) {
      setMessage('Please enter your current password.');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('http://localhost:8080/api/auth/update-password', {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessage('Profile and password updated successfully!');
      } catch (err) {
        const errorMsg = err.response?.data || 'Error updating password on server';
        setMessage(errorMsg);
        return;
      }
    } else {
      setMessage('You must be logged in to change password.');
      return;
    }
  } else {
        setMessage('Profile updated successfully!');
  }

    updateUser(updatedUser);
    setSelectedFile(null);
    setFormData({ ...formData,
      currentPassword: '', 
      newPassword: '', 
      confirmPassword: '' });
    setMessage('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!user || !isOpen) return null;

  return (
    <div className={`profile-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`profile-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>My Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="drawer-content">
          <div className="profile-avatar">
            <img src={previewPic || 'https://via.placeholder.com/140'} alt="Profile" className="avatar-img" />
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
                placeholder="••••••••" 
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

            <div className="drawer-buttons">
              <button onClick={handleSave} className="save-btn">Save Changes</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            {message && (
              <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;