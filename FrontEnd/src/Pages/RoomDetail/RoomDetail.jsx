import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../../Components/ImageGallery/ImageGallery';
import BookingForm from '../../Components/BookingForm/BookingForm';
import './RoomDetail.css';

const BASE_URL = "http://localhost:8081";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No room ID provided");
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/public/rooms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Room not found (Status: ${res.status})`);
        return res.json();
      })
      .then((data) => {
        setRoom(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookNow = () => {
    window.open("https://www.booking.com", "_blank");
  };

  const handleBookingSuccess = () => {
    setTimeout(() => {
      navigate('/rooms');
    }, 2000);
  };

  if (loading) return <div className="room-detail-container"><p>Loading room...</p></div>;

  if (error || !room) {
    return (
      <div className="room-detail-container">
        <p style={{ color: 'red' }}>Error: {error || "Room not found"}</p>
        <button onClick={() => navigate('/rooms')}>Back to Rooms</button>
      </div>
    );
  }

  const images = [
    room.imageUrl?.startsWith("http") ? room.imageUrl : `${BASE_URL}${room.imageUrl || ""}`,
    "https://images.unsplash.com/photo-1611892440504-42a79208a498",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  ].filter(Boolean);

  return (
    <div className="room-detail-container">

      <button className="back-btn" onClick={() => navigate('/rooms')}>
        ← Back to Rooms
      </button>

      <div className="room-detail">

        {/* LEFT SIDE */}
        <div className="left-section">
          <div className="room-images">
            <ImageGallery images={images} roomName={room.name} />
          </div>

          {/* Booking form under image */}
          <div className="booking-section">
            <h2>Book Directly with GoldenStars</h2>
            <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">

          <h1 className="room-title">{room.name}</h1>

          <p className="description">{room.description}</p>

          <div className="details-section">
            <h3>Room Details</h3>
            <ul>
              <li><strong>Capacity:</strong> {room.capacity} guests</li>
              <li><strong>Price:</strong> Rs. {room.price?.toLocaleString()} / night</li>
              <li><strong>Status:</strong> {room.status}</li>
            </ul>
          </div>

          <button className="book-btn" onClick={handleBookNow}>
            Book on Booking.com
          </button>

          <p className="note">
            You will be redirected to Booking.com to complete your reservation.
          </p>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;