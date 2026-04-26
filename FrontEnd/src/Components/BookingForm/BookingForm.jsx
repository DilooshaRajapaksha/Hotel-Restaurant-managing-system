import React, { useState } from 'react';
import api from '../../utils/axiosInstance';   

const BookingForm = ({ room, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuest: 1,
    specialRequest: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/api/customer/bookings', {
        roomId: room.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuest: parseInt(formData.numberOfGuest),
        specialRequest: formData.specialRequest || ''
      });

      setMessage('Booking created successfully!');
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      (err.response?.status === 403 ? 'Please log in first to make a booking' : 
                      'Booking failed. Please try again.');
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Check-in</label>
          <input 
            type="date" 
            name="checkInDate" 
            value={formData.checkInDate} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Check-out</label>
          <input 
            type="date" 
            name="checkOutDate" 
            value={formData.checkOutDate} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Guests</label>
        <input 
          type="number" 
          name="numberOfGuest" 
          value={formData.numberOfGuest} 
          onChange={handleChange} 
          min="1" 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Special Request (optional)</label>
        <textarea 
          name="specialRequest" 
          value={formData.specialRequest} 
          onChange={handleChange}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{
          background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
          color: '#fff',
          padding: '16px',
          width: '100%',
          fontSize: '1.1rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>

      {message && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: '500', color: message.includes('success') ? '#2e7d32' : '#d32f2f' }}>{message}</p>}
    </form>
  );
};

export default BookingForm;