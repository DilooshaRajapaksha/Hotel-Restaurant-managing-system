import React, { useEffect, useState } from 'react';
import './RoomsPage.css';
import RoomCard from '../../Components/RoomCard/RoomCard';
import Carousel from '../../Components/Carousel/Carousel';
import Navbar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer';
import Room1 from '../../Assets/Pics/Room1.jpg';
import Room2 from '../../Assets/Pics/Room2.jpg';
import Room3 from '../../Assets/Pics/Room3.jpg';
import Room4 from '../../Assets/Pics/Room4.jpg';

const AMENITIES = [
  { icon: '✦', label: 'Free Wi-Fi' },
  { icon: '✦', label: 'Fine Dining' },
  { icon: '✦', label: '24 / 7' },
  { icon: '✦', label: 'Valet Parking' },
  { icon: '✦', label: 'Room Service' },
];

const RoomsPage = () => {
  const [rooms, setRooms]           = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading]       = useState(true);

  const carouselImages = [Room1, Room2, Room3, Room4];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8081/api/public/rooms');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRooms(data || []);
      } catch (err) {
        console.error('Error fetching rooms:', err);
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
      if (sortOption === 'price')
        return (a.roomPrice || a.price || 0) - (b.roomPrice || b.price || 0);
      if (sortOption === 'capacity')
        return (a.roomType?.capacity || a.capacity || 0)
             - (b.roomType?.capacity || b.capacity || 0);
      if (sortOption === 'az')
        return (a.roomName || a.name || '').localeCompare(b.roomName || b.name || '');
      return 0;
    });
  };

  const sortedRooms = getSortedRooms();
  const tickerItems = [...AMENITIES, ...AMENITIES];

  return (
    <div className="rooms-page">
      <Navbar />

      <main>
        <div className="rooms-hero-wrap">
          <Carousel images={carouselImages} />

          <div className="rooms-hero-overlay">
            <div className="rooms-hero-kicker anim-up d1">
              <span className="rooms-hero-kicker-dot" />
              Exclusive Collection
            </div>

            <h1 className="rooms-hero-title anim-up d2">
              To Make <em>Unforgettable memory</em>
            </h1>

            <p className="rooms-hero-desc anim-up d3">
              Curated rooms that blend timeless elegance with every modern comfort.
            </p>

            <div className="rooms-hero-stats anim-up d4">
              <div className="rooms-stat">
                <div className="rooms-stat-num">
                  {loading ? '—' : rooms.length}<span>+</span>
                </div>
                <div className="rooms-stat-label">Room Types</div>
              </div>
              <div className="rooms-stat">
                <div className="rooms-stat-num">5<span>★</span></div>
                <div className="rooms-stat-label">Guest Rating</div>
              </div>
              <div className="rooms-stat">
                <div className="rooms-stat-num">24<span>/7</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="amenity-strip" aria-hidden="true">
          <div className="amenity-track">
            {tickerItems.map((item, i) => (
              <span key={i} className="amenity-item">
                <span className="amenity-icon">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <section className="rooms-section">
          <div className="rooms-section-header">
            <div className="rooms-section-left">
              {!loading && (
                <p className="rooms-count">
                  Showing <strong>{sortedRooms.length}</strong>{' '}
                  {sortedRooms.length === 1 ? 'room' : 'rooms'}
                </p>
              )}
            </div>

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
                <option value="az">Name (A–Z)</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              {[1, 2, 3].map((n) => <div key={n} className="skeleton-card" />)}
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="rooms-grid">
              <p className="no-rooms">No rooms available at the moment.</p>
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div className="rooms-grid">
              {sortedRooms.map((room) => (
                <RoomCard key={room.roomId || room.id} room={room} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoomsPage;