import { useEffect, useRef, useState } from 'react';

const PanoramaViewer = ({ imageUrl, hotspots, onClose }) => {
  const viewerRef = useRef(null);
  const pannellumRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  let audio = useRef(null);

  // 🎧 Ambient Sound Setup
  const toggleSound = () => {
    if (!audio.current) {
      audio.current = new Audio('/sounds/room.mp3');
      audio.current.loop = true;
      audio.current.volume = 0.3;
    }

    if (soundOn) {
      audio.current.pause();
    } else {
      audio.current.play();
    }

    setSoundOn(!soundOn);
  };

  // 🎬 Guided Tour
  const startTour = () => {
    if (!pannellumRef.current) return;

    pannellumRef.current.startAutoRotate(-2);

    setTimeout(() => {
      pannellumRef.current.lookAt(-12, 45, 70);
    }, 3000);

    setTimeout(() => {
      pannellumRef.current.lookAt(8, -80, 70);
    }, 6000);

    setTimeout(() => {
      pannellumRef.current.lookAt(-5, 120, 70);
    }, 9000);
  };

  // 🔄 Reset View
  const resetView = () => {
    pannellumRef.current.lookAt(0, 0, 100);
  };

  useEffect(() => {
    let loaded = false;

    const initViewer = () => {
      if (!window.pannellum) return;

      try {
        pannellumRef.current = window.pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          compass: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          mouseZoom: true,
          hfov: 100,
          hotSpots: hotspots || [],
          deviceOrientation: true, // 📱 mobile gyroscope
        });

        pannellumRef.current.on('load', () => {
          if (!loaded) {
            loaded = true;
            setLoading(false);
          }
        });

        pannellumRef.current.on('error', () => setError(true));
      } catch {
        setError(true);
      }
    };

    if (window.pannellum) {
      initViewer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.pannellum.org/2.5/pannellum.js';
      script.onload = initViewer;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.pannellum.org/2.5/pannellum.css';
      document.head.appendChild(link);
    }

    return () => {
      if (pannellumRef.current) {
        pannellumRef.current.destroy();
        pannellumRef.current = null;
      }
    };
  }, [imageUrl, hotspots]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.96)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1280px',
        height: '100vh'
      }}>

        <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />

        {/* 🌀 Header */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
          padding: '10px 24px',
          borderRadius: 50,
          fontWeight: 700,
          color: '#111',
          boxShadow: '0 8px 25px rgba(201,168,76,0.6)'
        }}>
          🌀 GoldenStars 360° Tour
        </div>

        {/* ❌ Close */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: 'none',
          background: '#fff',
          fontSize: 24,
          cursor: 'pointer'
        }}>
          ✕
        </button>

        {/* 🎛 Controls */}
        <div style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12
        }}>

          <button onClick={startTour} className="lux-btn">✨ Tour</button>
          <button onClick={resetView} className="lux-btn">🔄 Reset</button>
          <button onClick={toggleSound} className="lux-btn">
            {soundOn ? '🔊 Sound Off' : '🔊 Sound On'}
          </button>

        </div>

        {/* ⏳ Loading */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff'
          }}>
            <div className="lux-loader"></div>
            <p>Entering Luxury Experience...</p>
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            Failed to load 360° view
          </div>
        )}

      </div>
    </div>
  );
};

export default PanoramaViewer;