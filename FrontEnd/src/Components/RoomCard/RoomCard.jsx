import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/id/1015/600/400");

  useEffect(() => {
    if (!room || !room.roomId) return;
    fetch(`http://localhost:8081/api/public/rooms/${room.roomId}/images`)
      .then(res => res.json())
      .then(images => {
        if (images && images.length > 0) {
          const main = images.find(img => img.isMain) || images[0];
          const url = main.rimageUrl?.startsWith("http") 
            ? main.rimageUrl 
            : `http://localhost:8081${main.rimageUrl}`;
          setImageUrl(url);
        }
      })
      .catch(() => {});
  }, [room]);

  if (!room) return null;

  const price = room.roomPrice || 0;
  const name = room.roomName || "Room";
  const capacity = room.roomType?.capacity || 0;
  const typeName = room.roomType?.roomTypeName || "Standard Room";

  return (
    <div className="room-card" onClick={() => navigate(`/rooms/${room.roomId}`)}>
      <div className="room-image-wrapper">
        <img 
          src={imageUrl} 
          alt={name}
          onError={(e) => { e.target.src = 'https://picsum.photos/id/1015/600/400'; }}
        />
        <div className="overlay"></div>
        <div className="price-badge">
          Rs. {Number(price).toLocaleString()}
        </div>
      </div>
      <div className="room-content">
        <h3>{name}</h3>
        <div>{typeName}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>👥 {capacity} Guests</div>
          <button className="view-more-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;