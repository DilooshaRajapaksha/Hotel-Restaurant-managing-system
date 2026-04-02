import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

const BASE_URL = "http://localhost:8080";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const roomId = room.id;
  const roomName = room.name || `Room ${roomId}`;
  const imageUrlRaw = room.imageUrl || '/images/no-image.jpg';
  const imageUrl =
    typeof imageUrlRaw === "string" && !imageUrlRaw.startsWith("http")
      ? `${BASE_URL}${imageUrlRaw}`
      : imageUrlRaw;
  const price = room.price || 0;

  const handleViewMore = () => {
    if (roomId) {
      navigate(`/rooms/${roomId}`);
    }
  };

  return (
    <div className="room-card">
      
      {/* Image Section */}
      <div className="room-image-wrapper">
        <img
          src={imageUrl}
          alt={roomName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/no-image.jpg';
          }}
        />

        {/* Gold overlay effect */}
        <div className="overlay"></div>

        {/* Price badge */}
        <div className="price-badge">
          Rs. {Number(price).toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="room-content">
        <h3>{roomName}</h3>

        <button 
          className="view-more-btn"
          onClick={handleViewMore}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;