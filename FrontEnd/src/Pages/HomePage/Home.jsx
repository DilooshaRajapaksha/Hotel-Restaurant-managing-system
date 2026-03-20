import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Navbar from '../../Components/NavBar/NavBar';
import SlideImage1 from '../../assets/Pictures/SlideImage1.jpg';
import SlideImage2 from '../../assets/Pictures/Slideimage2.jpg';
import SlideImage3 from '../../assets/Pictures/SlideImage3.jpg';
import SlideImage4 from '../../assets/Pictures/SlideImage4.jpg';
import SlideImage5 from '../../assets/Pictures/SlideImage5.jpg';
import './Home.css';

const slideImages = [
  SlideImage1,
  SlideImage2,
  SlideImage3,
  SlideImage4,
  SlideImage5
];

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <div className="slider-container">
        {slideImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            className="mySwiper"
          >
            {slideImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
                <div className="hero-cta-container">
                  <button className="hero-cta-btn book-now">Book Now</button>
                  <button className="hero-cta-btn order-now">Order Now</button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="no-slides">
            <p>No images available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;