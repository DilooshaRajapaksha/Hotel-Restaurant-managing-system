import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../../Components/ImageGallery/ImageGallery';
import PanoramaViewer from '../../Components/PanoramaViewer';
import BookingForm from '../../Components/BookingForm/BookingForm';
import './RoomDetail.css';
import NavBar from '../../Components/NavBar/NavBar';

const BASE_URL = "http://localhost:8081";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [panoramaImages, setPanoramaImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showPanorama, setShowPanorama] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) { setError("No room ID provided"); setLoading(false); return; }

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
        setPanoramaImages(processed.filter(img => img.is360));
        setGalleryImages(processed.filter(img => !img.is360));
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

  const handleBookNow = () => window.open("https://www.booking.com", "_blank");
  const handleBookingSuccess = () => setTimeout(() => navigate('/rooms'), 2000);

  const sampleHotspots = [
    { pitch: -12, yaw: 45,   type: "info", text: "🛏 King Bed — Premium Comfort" },
    { pitch:   8, yaw: -80,  type: "info", text: "🚿 Luxury Bathroom" },
    { pitch:  -5, yaw: 120,  type: "info", text: "🌅 Balcony View" },
    { pitch:  15, yaw: -30,  type: "info", text: "📺 Smart TV" },
    { pitch: -20, yaw: -140, type: "info", text: "🍷 Mini Bar" },
  ];

  const statusLabel = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'available') return { cls: 'status-available', label: 'Available' };
    return { cls: 'status-unavailable', label: status || 'Unavailable' };
  };

  if (loading) {
    return (
      <div className="room-state-wrapper">
        <NavBar />
        <div className="room-state-card">
          <div className="loading-orb">
            <div className="loading-ring" />
            <div className="loading-ring loading-ring--2" />
          </div>
          <p>Preparing your room experience…</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="room-state-wrapper">
        <NavBar />
        <div className="room-state-card">
          <p className="error-text">Error: {error || "Room not found"}</p>
          <button className="back-btn-inline" onClick={() => navigate('/rooms')}>
            ← Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const { cls: statusCls, label: statusText } = statusLabel(room.roomStatus || room.status);
  const allPanoramas = panoramaImages.length > 0
    ? panoramaImages
    : roomImages.filter(i => i.is360);

  return (
    <div className="room-detail-container">
      <NavBar />

      {/* Floating back button — appears over the page, not in a bar */}
      <button className="floating-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <span className="floating-back-arrow">←</span>
        <span className="floating-back-label">Back</span>
      </button>

      <div className="room-detail-body">

        {/* ══ SECTION 1: Title + Quick Info ══ */}
        <div className="section-title-row anim-up d1">
          <div className="title-left">
            <h1 className="room-title">{room.roomName || room.name}</h1>
            <div className="room-title-line" />
            <p className="description">{room.description}</p>
          </div>
          <div className="quick-stats">
            <div className="stat-chip">
              <span className="stat-icon">👥</span>
              <span className="stat-label">Capacity</span>
              <span className="stat-value">{room.roomType?.capacity || room.capacity || 2} guests</span>
            </div>
            <div className="stat-chip stat-chip--gold">
              <span className="stat-icon">✦</span>
              <span className="stat-label">Per Night</span>
              <span className="stat-value">Rs. {(room.roomPrice || room.price || 0).toLocaleString()}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-icon">◉</span>
              <span className="stat-label">Status</span>
              <span className={`status-badge ${statusCls}`}>{statusText}</span>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Photo Gallery ══ */}
        <section className="media-section anim-up d2">
          <div className="section-eyebrow-row">
            <span className="section-eyebrow">🖼 Room Gallery</span>
            <span className="section-eyebrow-sub">Browse every corner of your stay</span>
          </div>

          <div className="photo-gallery-layout">
            <div className="photo-main">
              {galleryImages.length > 0 ? (
                <>
                  <img
                    key={activeGalleryIdx}
                    src={galleryImages[activeGalleryIdx]?.url}
                    alt={`${room.roomName} view ${activeGalleryIdx + 1}`}
                    className="photo-main-img"
                  />
                  <div className="photo-main-counter">
                    {activeGalleryIdx + 1} / {galleryImages.length}
                  </div>
                  <div className="photo-main-nav">
                    <button
                      className="photo-nav-btn"
                      onClick={() => setActiveGalleryIdx(i => (i - 1 + galleryImages.length) % galleryImages.length)}
                      aria-label="Previous photo"
                    >‹</button>
                    <button
                      className="photo-nav-btn"
                      onClick={() => setActiveGalleryIdx(i => (i + 1) % galleryImages.length)}
                      aria-label="Next photo"
                    >›</button>
                  </div>
                </>
              ) : (
                <ImageGallery
                  images={roomImages}
                  roomName={room.roomName || room.name}
                  onPanoramaClick={(url) => setShowPanorama(url)}
                />
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="photo-thumbs">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    className={`photo-thumb ${i === activeGalleryIdx ? 'photo-thumb--active' : ''}`}
                    onClick={() => setActiveGalleryIdx(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══ SECTION 3: 360° Virtual Tour ══ */}
        {allPanoramas.length > 0 && (
          <section className="media-section media-section--dark anim-up d3">
            <div className="section-eyebrow-row section-eyebrow-row--dark">
              <span className="section-eyebrow section-eyebrow--dark">🔮 360° Virtual Tour</span>
              <span className="section-eyebrow-sub section-eyebrow-sub--dark">
                Step inside before you arrive — click any card to launch the full panorama
              </span>
            </div>

            <div className="pano-cards">
              {allPanoramas.map((img, i) => (
                <button
                  key={i}
                  className="pano-card"
                  onClick={() => setShowPanorama(img.url)}
                  aria-label={`Open 360° view ${i + 1}`}
                >
                  <img src={img.url} alt={`360° panorama ${i + 1}`} className="pano-card-img" />
                  <div className="pano-card-gradient" />
                  <div className="pano-card-overlay">
                    <div className="pano-card-badge">
                      <span className="pano-badge-dot" />
                      360°
                    </div>
                    <span className="pano-card-cta">Launch Tour →</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="pano-hint">✦ Use mouse or touch to explore. Hotspots reveal key features.</p>
          </section>
        )}

        {/* ══ SECTION 4: Booking ══ */}
        <section className="booking-grid anim-up d4">
          <div className="booking-section">
            <span className="booking-section-label">Direct Booking</span>
            <h2>Reserve with GoldenStars</h2>
            <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
          </div>

          <div className="right-section">
            <div className="details-section">
              <h3>Room Details</h3>
              <ul>
                <li><strong>Capacity:</strong>{room.roomType?.capacity || room.capacity || 2} guests</li>
                <li><strong>Price:</strong>Rs. {(room.roomPrice || room.price || 0).toLocaleString()} / night</li>
                <li>
                  <strong>Status:</strong>
                  <span className={`status-badge ${statusCls}`}>{statusText}</span>
                </li>
              </ul>
            </div>

            <div className="booking-alt-divider"><span>or book through</span></div>

            <button className="book-btn" onClick={handleBookNow}>
              Book on Booking.com ↗
            </button>
            <p className="note">You'll be redirected to Booking.com to complete your reservation.</p>
          </div>
        </section>

      </div>

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