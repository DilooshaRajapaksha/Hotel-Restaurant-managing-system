import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/NavBar/NavBar';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', newPassword: '', confirmPassword: '' });
  const [previewPic, setPreviewPic] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    } else {
      setFormData({ name: user.name || '', email: user.email || '', newPassword: '', confirmPassword: '' });
      setPreviewPic(user.picture || '');
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
      if (formData.newPassword === formData.confirmPassword) {
        updatedUser.password = formData.newPassword;
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await axios.put('http://localhost:8080/api/auth/update-password', { newPassword: formData.newPassword }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            setMessage('Error updating password on server');
            return;
          }
        }
      } else {
        setMessage('Passwords do not match. Profile not updated.');
        return;
      }
    }

    updateUser(updatedUser);
    setSelectedFile(null);
    setFormData({ ...formData, newPassword: '', confirmPassword: '' });
    setMessage('Profile updated successfully!');
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;