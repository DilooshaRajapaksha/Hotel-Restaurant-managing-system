import React from 'react';
import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room, roomNumber }) => {
  return (
    <div className="room-card">
      <img
        src={room.imageUrl} 
        alt={room.name || `Room ${roomNumber}`}
      />
      <Link to={`/rooms/${room.id}`}>
        <button className="view-more-btn">view more..</button>
      </Link>
    </div>
  );
};

export default RoomCard;