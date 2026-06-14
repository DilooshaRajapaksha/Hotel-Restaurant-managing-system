import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';

const Carousel = ({ images = [], autoPlayInterval = 4000 }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setCurrent((index + images.length) % images.length);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const handlePrev = () => { goTo(current - 1); resetTimer(); };
  const handleNext = () => { goTo(current + 1); resetTimer(); };

  if (!images.length) return null;

  return (
    <div className="carousel">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className="carousel-image"
          style={{ opacity: i === current ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button className="carousel-btn prev" onClick={handlePrev} aria-label="Previous">
            &#8249;
          </button>
          <button className="carousel-btn next" onClick={handleNext} aria-label="Next">
            &#8250;
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => { goTo(i); resetTimer(); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;