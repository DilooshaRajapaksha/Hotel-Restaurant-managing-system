import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/NavBar/NavBar';
import { AuthContext } from '../../Context/AuthContext';
import api from '../../utils/axiosInstance';
import './Profile.css';

const BOOKING_STATUS_META = {
  PENDING:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7' },
  CONFIRMED: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe' },
  CHECKED_IN:{ label: 'Checked In',color: '#065f46', bg: '#d1fae5' },
  CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
  COMPLETED: { label: 'Completed', color: '#374151', bg: '#f3f4f6' },
};

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
  const [previewPic, setPreviewPic]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage]         = useState('');

  /* ── Bookings state ───────────────────────────────────────────────────── */
  const [bookings, setBookings]             = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showAllBookings, setShowAllBookings] = useState(false);

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
      fetchBookings();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get('/api/customer/bookings/my');
      setBookings(res.data || []);
    } catch {
      // silently ignore — not a critical failure
    } finally {
      setBookingsLoading(false);
    }
  };

  /* ── Navigation helpers ───────────────────────────────────────────────── */
  const goToMyOrders      = () => navigate('/my-orders');
  const goToCurrentOrders = () => navigate('/my-orders?tab=current');
  const goToPrevOrders    = () => navigate('/my-orders?tab=previous');
  const goToOrderTracking = () => navigate('/order-tracking');

  /* ── Form handlers ────────────────────────────────────────────────────── */
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
    setMessage('');
    const trimmed = formData.name.trim();
    const parts   = trimmed.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || '';
    const lastName  = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    let updatedPicture = user.userImage || user.picture || '';
    if (selectedFile && previewPic) updatedPicture = previewPic;

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
        userImage: updatedPicture && !String(updatedPicture).includes('via.placeholder.com')
          ? updatedPicture : null,
      });

      const data = profileRes.data;
      if (data.token) {
        if (user.role?.toUpperCase() === 'ADMIN') {
          localStorage.setItem('adminToken', data.token);
        } else {
          localStorage.setItem('customerToken', data.token);
        }
      }
      const u   = data.user;
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
        ...prev, currentPassword: '', newPassword: '', confirmPassword: '',
      }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data;
      setMessage(typeof msg === 'string' ? msg : 'Could not update profile.');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  /* ── Booking helpers ──────────────────────────────────────────────────── */
  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const handleCancelBooking = async (bookingId, e) => {
    e.stopPropagation();
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/api/customer/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch {
      alert('Could not cancel booking. Please try again.');
    }
  };

  const displayedBookings = showAllBookings ? bookings : bookings.slice(0, 4);

  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-layout">

        {/* ── Profile card ──────────────────────────────────────────────── */}
        <div className="profile-content">
          <h1 className="profile-title">My Profile</h1>

          <div className="profile-avatar">
            <img
              src={previewPic || 'https://via.placeholder.com/140'}
              alt="Profile"
              className="avatar-img"
            />
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
                type="password" name="currentPassword" value={formData.currentPassword}
                onChange={handleInputChange} placeholder="Required only to change password"
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
              <button onClick={handleSave}   className="save-btn">Save Changes</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>

          {message && (
            <p className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>

        {/* ── My Orders card ────────────────────────────────────────────── */}
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
              <p>Active &amp; Preparing orders</p>
              <button className="order-btn primary">Track Live</button>
            </div>

            <div className="order-card" onClick={goToPrevOrders}>
              <div className="order-icon">✅</div>
              <h3>Previous Orders</h3>
              <p>Completed &amp; Cancelled</p>
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

        {/* ── My Bookings card ──────────────────────────────────────────── */}
        <div className="bookings-section">
          <h2 className="section-title">My Bookings</h2>
          <p className="section-subtitle">Your room reservations at Golden Stars Hotel</p>

          {bookingsLoading ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#6b5c45', fontSize: 14 }}>
              Loading bookings…
            </div>
          ) : bookings.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛎️</div>
              <p style={{ color: '#6b5c45', fontSize: 15, marginBottom: 18 }}>
                You have no room bookings yet.
              </p>
              <button
                onClick={() => navigate('/rooms')}
                className="order-btn primary"
                style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <>
              <div className="bookings-grid">
                {displayedBookings.map((b) => {
                  const meta = BOOKING_STATUS_META[b.bookingStatus] || { label: b.bookingStatus, color: '#374151', bg: '#f3f4f6' };
                  const nights = b.checkInDate && b.checkOutDate
                    ? Math.max(1, Math.round((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000))
                    : '—';
                  return (
                    <div key={b.bookingId} className="booking-card" onClick={() => navigate('/rooms')}>
                      <div className="booking-icon">🏨</div>

                      {/* Status badge */}
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
                        color: meta.color, background: meta.bg, marginBottom: 2,
                      }}>
                        {meta.label}
                      </span>

                      <h3>Room #{b.roomId}</h3>

                      <p>
                        {fmtDate(b.checkInDate)} → {fmtDate(b.checkOutDate)}
                        {typeof nights === 'number' && (
                          <span style={{ display: 'block', fontWeight: 700, color: '#1f1a14' }}>
                            {nights} night{nights !== 1 ? 's' : ''}
                          </span>
                        )}
                      </p>

                      {b.numberOfGuest && (
                        <p style={{ color: '#6b5c45' }}>👤 {b.numberOfGuest} guest{b.numberOfGuest > 1 ? 's' : ''}</p>
                      )}

                      {b.totalPrice && (
                        <p style={{ fontWeight: 800, color: '#b8972e', fontSize: '0.95rem', marginTop: 2 }}>
                          LKR {parseFloat(b.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      )}

                      {/* Cancel button — only for pending/confirmed */}
                      {(b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED') && (
                        <button
                          className="booking-btn"
                          style={{ marginTop: 8, borderColor: '#fca5a5', color: '#b91c1c' }}
                          onClick={(e) => handleCancelBooking(b.bookingId, e)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show more / less toggle */}
              {bookings.length > 4 && (
                <div style={{ textAlign: 'center', marginTop: 18 }}>
                  <button
                    className="order-btn"
                    onClick={() => setShowAllBookings((v) => !v)}
                    style={{ padding: '0.65rem 2rem' }}
                  >
                    {showAllBookings ? 'Show Less' : `Show All ${bookings.length} Bookings`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
