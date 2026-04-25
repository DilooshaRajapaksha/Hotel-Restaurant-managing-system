import React, { useState } from 'react';

const ImageGallery = ({ images, roomName, onPanoramaClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImage = images[currentIndex] || { url: 'https://picsum.photos/id/1015/600/400', is360: false };

  const panoramaImage = images.find(img => img.is360);

  return (
    <div style={{ position: 'relative', height: '100%', borderRadius: '18px', overflow: 'hidden' }}>
      <img 
        src={mainImage.url} 
        alt={roomName} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {panoramaImage && (
        <button 
          onClick={() => onPanoramaClick(panoramaImage.url)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '50px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(201,168,76,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          🌀 360° Tour
        </button>
      )}

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginTop: '15px', 
        flexWrap: 'wrap',
        padding: '0 10px'
      }}>
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img.url} 
            alt=""
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '80px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '8px',
              cursor: 'pointer',
              border: idx === currentIndex ? '3px solid #C9A84C' : '2px solid #ddd'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;