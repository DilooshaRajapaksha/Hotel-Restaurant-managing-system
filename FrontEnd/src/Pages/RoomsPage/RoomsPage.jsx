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
  const [loading, setLoading] = useState(true);

  const carouselImages = [Room1, Room2, Room3, Room4];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8081/api/public/rooms');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setRooms(data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getSortedRooms = () => {
    if (!sortOption) return rooms;

    return [...rooms].sort((a, b) => {
      if (sortOption === 'price') return a.price - b.price;
      if (sortOption === 'capacity') return a.capacity - b.capacity;
      if (sortOption === 'az') return a.name.localeCompare(b.name);
      return 0;
    });
  };

  const sortedRooms = getSortedRooms();

  return (
    <div className="rooms-page">

      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="GoldenStars Hotel" />
          <h1>GoldenStars Hotel</h1>
        </div>
      </header>

      <main>

        {/* Carousel */}
        <section className="hero-carousel">
          <Carousel images={carouselImages} />
        </section>

        {/* Rooms */}
        <section className="rooms-section">

          <div className="rooms-top-bar">
            <h2>Our Luxury Rooms</h2>

            <div className="sort-by">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Default</option>
                <option value="price">Price (Low to High)</option>
                <option value="capacity">Capacity</option>
                <option value="az">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {loading && <p className="loading">Loading rooms...</p>}

          {!loading && rooms.length === 0 && (
            <p className="no-rooms">No rooms available at the moment.</p>
          )}

          <div className="rooms-grid">
            {sortedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default RoomsPage;