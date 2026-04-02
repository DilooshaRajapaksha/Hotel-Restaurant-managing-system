import React, { useState, useEffect } from 'react';
import DateRangePickerWrapper from '../DateRangePickerWrapper/DateRangePickerWrapper';
import './BookingForm.css';

const BookingForm = ({ room, onBookingSuccess }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      key: 'selection',
    },
  ]);

  const [guests, setGuests] = useState(1);
  const [specialReq, setSpecialReq] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const customerToken = localStorage.getItem('customerToken');
    setIsLoggedIn(!!customerToken);
  }, []);

  const nights = Math.max(
    1,
    Math.ceil(
      (dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = Number(room?.price || 0) * nights;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!room?.id) {
      setError("Room information is missing.");
      setLoading(false);
      return;
    }

    if (dateRange[0].endDate <= dateRange[0].startDate) {
      setError("Check-out date must be after check-in date.");
      setLoading(false);
      return;
    }

    const payload = {
      roomId: room.id,
      checkInDate: dateRange[0].startDate.toISOString().split('T')[0],
      checkOutDate: dateRange[0].endDate.toISOString().split('T')[0],
      numberOfGuest: guests,
      specialRequest: specialReq.trim(),
    };

    console.log("Sending booking payload:", payload);

    try {
      const res = await fetch('http://localhost:8081/api/customer/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('customerToken') || ''}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = `Booking failed (${res.status})`;

        try {
          const errData = await res.json();
          console.error("Server error response:", errData);
          errorMsg = errData.message || errData.error || JSON.stringify(errData);
        } catch (e) {
          try {
            const text = await res.text();
            console.error("Raw server response text:", text);
            errorMsg = text || errorMsg;
          } catch (_) {}
        }

        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("Booking successful:", data);

      setSuccess(true);
      setError(null);
      if (onBookingSuccess) onBookingSuccess(data);

    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="booking-form" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2>Book This Room</h2>
        <p style={{ color: '#d32f2f', fontSize: '1.1rem', margin: '20px 0' }}>
          You must be logged in to book a room.
        </p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            background: '#d4af37',
            color: 'white',
            border: 'none',
            padding: '14px 32px',
            fontSize: '1.1rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Book This Room</h2>

      <div className="form-group date-group">
        <label>Dates</label>
        <DateRangePickerWrapper
          ranges={dateRange}
          onChange={(ranges) => setDateRange([ranges.selection])}
        />
      </div>

      <div className="form-group">
        <label>Number of Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[...Array(Math.max(1, room?.capacity || 4))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Guest{i > 0 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="price-summary">
        <div>
          Rs. {Number(room?.price || 0).toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
        </div>
        <div className="total">
          Total: <strong>Rs. {totalPrice.toLocaleString()}</strong>
        </div>
      </div>

      <div className="form-group">
        <label>Special Requests (optional)</label>
        <textarea
          value={specialReq}
          onChange={(e) => setSpecialReq(e.target.value)}
          rows={3}
          placeholder="Any special requests or notes..."
        />
      </div>

      {error && <div className="error-msg" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      {success && (
        <div className="success-msg" style={{ color: 'green', margin: '10px 0' }}>
          Booking successful! Check your email for confirmation.
        </div>
      )}

      <button
        type="submit"
        className="book-now-btn"
        disabled={loading || success}
      >
        {loading ? 'Processing...' : success ? 'Booked!' : 'Confirm Booking'}
      </button>

      <p className="policy-note">
        By booking you agree to our cancellation policy & terms.
      </p>
    </form>
  );
};

export default BookingForm;