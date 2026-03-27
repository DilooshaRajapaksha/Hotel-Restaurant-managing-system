import React, { useState } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialReq, setSpecialReq] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

    const payload = {
      roomId: room.id,
      checkInDate: dateRange[0].startDate.toISOString().split('T')[0],
      checkOutDate: dateRange[0].endDate.toISOString().split('T')[0],
      numberOfGuest: guests,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      email,
      phoneNumber: phone,
      specialRequest: specialReq,
      totalPrice,
    };

    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Booking failed');
      }

      setSuccess(true);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <label>Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[...Array(room?.capacity || 4)].map((_, i) => (
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
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Special Requests (optional)</label>
        <textarea
          value={specialReq}
          onChange={(e) => setSpecialReq(e.target.value)}
          rows={3}
        />
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && (
        <div className="success-msg">
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