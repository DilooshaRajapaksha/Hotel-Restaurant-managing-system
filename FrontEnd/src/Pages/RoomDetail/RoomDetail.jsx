import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../../Components/ImageGallery/ImageGallery';
import PanoramaViewer from '../../Components/PanoramaViewer';
import BookingForm from '../../Components/BookingForm/BookingForm';
import './RoomDetail.css';

const BASE_URL = "http://localhost:8081";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [showPanorama, setShowPanorama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No room ID provided");
      setLoading(false);
      return;
    }

    const loadRoom = async () => {
      try {
        const roomRes = await fetch(`${BASE_URL}/api/public/rooms/${id}`);
        if (!roomRes.ok) throw new Error(`Room not found (Status: ${roomRes.status})`);
        const roomData = await roomRes.json();
        setRoom(roomData);

        const imgRes = await fetch(`${BASE_URL}/api/public/rooms/${id}/images`);
        const imgData = await imgRes.json();

        const processed = imgData.map(img => ({
          url: img.rimageUrl.startsWith("http") ? img.rimageUrl : `${BASE_URL}${img.rimageUrl}`,
          is360: !!img.is360,
          isMain: !!img.isMain
        }));

        setRoomImages(processed);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [id]);

  const handleBookNow = () => {
    window.open("https://www.booking.com", "_blank");
  };

  const handleBookingSuccess = () => {
    setTimeout(() => {
      navigate('/rooms');
    }, 2000);
  };

const sampleHotspots = [
  {
    pitch: -12,
    yaw: 45,
    type: "info",
    text: "🛏 King Bed - Premium Comfort"
  },
  {
    pitch: 8,
    yaw: -80,
    type: "info",
    text: "🚿 Luxury Bathroom"
  },
  {
    pitch: -5,
    yaw: 120,
    type: "info",
    text: "🌅 Balcony View"
  },
  {
    pitch: 15,
    yaw: -30,
    type: "info",
    text: "📺 Smart TV"
  },
  {
    pitch: -20,
    yaw: -140,
    type: "info",
    text: "🍷 Mini Bar"
  }
];

  if (loading) return <div className="room-detail-container"><p>Loading room...</p></div>;

  if (error || !room) {
    return (
      <div className="room-detail-container">
        <p style={{ color: 'red' }}>Error: {error || "Room not found"}</p>
        <button onClick={() => navigate('/rooms')}>Back to Rooms</button>
      </div>
    );
  }

  return (
    <div className="room-detail-container">

      <button className="back-btn" onClick={() => navigate('/rooms')}>
        ← Back to Rooms
      </button>

      <div className="room-detail">

        {/* LEFT SIDE - Gallery + Booking Form */}
        <div className="left-section">
          <div className="room-images">
            <ImageGallery 
              images={roomImages} 
              roomName={room.roomName || room.name} 
              onPanoramaClick={(url) => setShowPanorama(url)}
            />
          </div>

          <div className="booking-section">
            <h2>Book Directly with GoldenStars</h2>
            <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
          </div>
        </div>

        {/* RIGHT SIDE - Details */}
        <div className="right-section">

          <h1 className="room-title">{room.roomName || room.name}</h1>

          <p className="description">{room.description}</p>

          <div className="details-section">
            <h3>Room Details</h3>
            <ul>
              <li><strong>Capacity:</strong> {room.roomType?.capacity || room.capacity || 2} guests</li>
              <li><strong>Price:</strong> Rs. {(room.roomPrice || room.price || 0).toLocaleString()} / night</li>
              <li><strong>Status:</strong> {room.roomStatus || room.status}</li>
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

      {/* 360° Panorama Modal */}
      {showPanorama && (
        <PanoramaViewer
          imageUrl={showPanorama}
          hotspots={sampleHotspots}
          onClose={() => setShowPanorama(null)}
        />
      )}

    </div>
  );
};

export default RoomDetail;