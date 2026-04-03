import React, { useState, useEffect } from 'react';
import './Carousel.css'; 

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <button className="carousel-btn prev" onClick={prevSlide}>&lt;</button>
      <img src={images[currentIndex]} alt="Hotel Slide" className="carousel-image" />
      <button className="carousel-btn next" onClick={nextSlide}>&gt;</button>
    </div>
  );
};

export default Carousel;