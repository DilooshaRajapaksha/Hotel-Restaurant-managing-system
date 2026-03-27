import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, roomName }) => {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return <div className="no-images">Photos have not been added yet</div>;
  }

  return (
    <div className="gallery-container">
      <div className="main-view">
        <img 
          src={images[selected]} 
          alt={`${roomName || 'Room'} - view ${selected + 1}`} 
          className="main-image"
        />
      </div>

      {images.length > 1 && (
        <div className="thumbnails-row">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${selected === index ? 'active' : ''}`}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;