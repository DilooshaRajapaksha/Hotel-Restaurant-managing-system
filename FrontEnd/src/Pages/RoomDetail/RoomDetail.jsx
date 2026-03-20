import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetail.css';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then(response => response.json())
      .then(data => {
        setRoom(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching room details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="room-detail-container"><p>Loading...</p></div>;
  }

  if (!room) {
    return <div className="room-detail-container"><p>Room not found</p></div>;
  }

  return (
    <div className="room-detail-container">
      <button className="back-btn" onClick={() => navigate('/rooms')}>← Back to Rooms</button>
      
      <div className="room-detail">
        <div className="room-images">
          <img src={room.imageUrl} alt={room.name} className="main-image" />
        </div>

        <div className="room-info">
          <h1 className="room-title">{room.name}</h1>
          
          <div className="room-details">
            <p className="description">{room.description}</p>
            
            <div className="details-section">
              <h3>Room Details</h3>
              <ul>
                <li><strong>Capacity:</strong> {room.capacity} guests</li>
                <li><strong>Price:</strong> Rs.{room.price} per night</li>
              </ul>
            </div>

            <button className="book-btn">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;