import React, { useEffect, useState } from 'react';
import './RoomsPage.css';
import logo from '../../Assets/Pics/Logo.jpg';
import RoomCard from '../../Components/RoomCard/RoomCard';
import Carousel from '../../Components/Carousel/Carousel';
import Room1 from '../../Assets/Pics/Room1.jpg';
import Room2 from '../../Assets/Pics/Room2.jpg';
import Room3 from '../../Assets/Pics/Room3.jpg';
import Room4 from '../../Assets/Pics/Room4.jpg';


const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselImages = [Room1, Room2, Room3 , Room4];

useEffect(() => {
    fetch('/api/rooms')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Backend error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Rooms loaded from backend:', data); // ← debug
        setRooms(data || []);
        setError(null);
      })
      .catch(err => {
        console.error('Fetch rooms failed:', err);
        setError(err.message);
        setRooms([]); // clear on error
      });
  }, []);

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortOption === 'price') {
      return Number(a?.price || 0) - Number(b?.price || 0);
    } else if (sortOption === 'capacity') {
      return Number(a?.capacity || 0) - Number(b?.capacity || 0);
    } else if (sortOption === 'az') {
      return (a?.name || '').localeCompare(b?.name || '');
    }
    return 0;
  });

  return (
    <div className="rooms-page">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Hotel Logo" />
        </div>
      </header>

      <main>
        <Carousel images={carouselImages} />

        <section className="rooms-section">
          <div className="sort-by">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price">Price (Low to High)</option>
              <option value="capacity">Capacity (Low to High)</option>
              <option value="az">A-Z</option>
            </select>
          </div>

          {error && (
            <p style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
              Error loading rooms: {error} (check if backend is running at /api/rooms)
            </p>
          )}

          {rooms.length === 0 && !error ? (
            <p style={{ textAlign: 'center', color: '#666', margin: '40px 0' }}>
              No rooms available yet...
            </p>
          ) : (
            <div className="rooms-grid">
              {sortedRooms.map((room, index) => (
                <RoomCard
                  key={room.id || `room-${index}`}
                  room={room}
                  roomNumber={index + 1}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RoomsPage;