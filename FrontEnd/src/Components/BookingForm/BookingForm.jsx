import React, { useState, useMemo } from 'react';
import api from '../../utils/axiosInstance';
import './BookingForm.css';

const BookingForm = ({ room, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuest: 1,
    specialRequest: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const today = new Date().toISOString().split('T')[0];

  /* ── Derived: number of nights + total price ── */
  const { nights, total } = useMemo(() => {
    if (!formData.checkInDate || !formData.checkOutDate) return { nights: 0, total: 0 };
    const diff = (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / 86400000;
    const n = diff > 0 ? diff : 0;
    return { nights: n, total: n * (room?.roomPrice || room?.price || 0) };
  }, [formData.checkInDate, formData.checkOutDate, room]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) {
      setMessage('Check-out must be after check-in.');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/customer/bookings', {
        roomId: room.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuest: parseInt(formData.numberOfGuest),
        specialRequest: formData.specialRequest || ''
      });

      setMessage('Your reservation is confirmed! We look forward to welcoming you.');
      setMessageType('success');
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      const msg = err.response?.data?.message ||
        (err.response?.status === 403
          ? 'Please log in first to make a booking.'
          : 'Booking failed. Please try again.');
      setMessage(msg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const pricePerNight = room?.roomPrice || room?.price || 0;

  return (
    <form className="bf-form" onSubmit={handleSubmit} noValidate>

      {/* ── Date row ── */}
      <div className="bf-date-row">
        <div className="bf-field">
          <label className="bf-label" htmlFor="checkInDate">
            <span className="bf-label-icon">✈</span> Check-in
          </label>
          <div className="bf-input-wrap">
            <input
              id="checkInDate"
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              min={today}
              required
              className="bf-input"
            />
          </div>
        </div>

        <div className="bf-date-divider" aria-hidden="true">
          <div className="bf-date-divider-line" />
          <span className="bf-date-divider-icon">→</span>
          <div className="bf-date-divider-line" />
        </div>

        <div className="bf-field">
          <label className="bf-label" htmlFor="checkOutDate">
            <span className="bf-label-icon">🏠</span> Check-out
          </label>
          <div className="bf-input-wrap">
            <input
              id="checkOutDate"
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              min={formData.checkInDate || today}
              required
              className="bf-input"
            />
          </div>
        </div>
      </div>

      {/* ── Guests ── */}
      <div className="bf-field">
        <label className="bf-label" htmlFor="numberOfGuest">
          <span className="bf-label-icon">👥</span> Guests
        </label>
        <div className="bf-stepper">
          <button
            type="button"
            className="bf-stepper-btn"
            onClick={() => setFormData(f => ({ ...f, numberOfGuest: Math.max(1, f.numberOfGuest - 1) }))}
            aria-label="Decrease guests"
          >−</button>
          <span className="bf-stepper-val">{formData.numberOfGuest}</span>
          <button
            type="button"
            className="bf-stepper-btn"
            onClick={() => setFormData(f => ({
              ...f,
              numberOfGuest: Math.min(room?.roomType?.capacity || room?.capacity || 10, f.numberOfGuest + 1)
            }))}
            aria-label="Increase guests"
          >+</button>
          <span className="bf-stepper-hint">
            max {room?.roomType?.capacity || room?.capacity || 10} guests
          </span>
        </div>
      </div>

      {/* ── Special request ── */}
      <div className="bf-field">
        <label className="bf-label" htmlFor="specialRequest">
          <span className="bf-label-icon">✦</span> Special Request
          <span className="bf-optional">optional</span>
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          value={formData.specialRequest}
          onChange={handleChange}
          className="bf-textarea"
          placeholder="Early check-in, extra pillows, anniversary setup…"
          rows={3}
        />
      </div>

      {/* ── Price summary ── */}
      {nights > 0 && (
        <div className="bf-summary">
          <div className="bf-summary-row">
            <span>Rs. {pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
          <div className="bf-summary-divider" />
          <div className="bf-summary-total">
            <span>Total</span>
            <span className="bf-summary-total-val">Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button type="submit" className="bf-submit-btn" disabled={loading}>
        {loading
          ? <><span className="bf-spinner" />Processing…</>
          : 'Confirm Reservation →'}
      </button>

      <p className="bf-policy">Free cancellation within 24 hours of booking</p>

      {/* ── Feedback message ── */}
      {message && (
        <div className={`bf-message bf-message--${messageType}`}>
          <span className="bf-message-icon">
            {messageType === 'success' ? '✓' : '!'}
          </span>
          {message}
        </div>
      )}

    </form>
  );
};

export default BookingForm;