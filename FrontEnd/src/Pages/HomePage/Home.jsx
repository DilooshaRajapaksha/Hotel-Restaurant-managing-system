import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/NavBar/NavBar';
import SlideImage1 from '../../assets/Pictures/SlideImage1.jpg';
import SlideImage2 from '../../assets/Pictures/Slideimage2.jpg';
import SlideImage3 from '../../assets/Pictures/SlideImage3.jpg';
import SlideImage4 from '../../assets/Pictures/SlideImage4.jpg';
import SlideImage5 from '../../assets/Pictures/SlideImage5.jpg';
import LocationImage from '../../assets/Pictures/LocationImage.jpg';
import './Home.css';

const slideImages = [
  SlideImage1,
  SlideImage2,
  SlideImage3,
  SlideImage4,
  SlideImage5
];

const Home = () => {
    const navigate = useNavigate();
  
    return (
    <div className="home-page">
      <Navbar />

      <div className="slider-container">
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
                <button className="hero-cta-btn book-now"onClick={() => navigate('/rooms')}>Book Now</button>
                <button className="hero-cta-btn order-now"onClick={() => navigate('/menu')}>Order Now</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="welcome-section">
        <div className="welcome-content">
          <p className="welcome-subtitle">Book today for a comfortable and enjoyable stay!</p>
          <h1 className="welcome-title">WELCOME TO GOLDEN STARS DAMBULLA</h1>
          
          <p className="welcome-description">
            Golden Stars Hotel Dambulla, located just 20 km from Sigiriya Rock and 23 km from Pidurangala Rock, 
            offers comfortable accommodations with a serene garden, free Wi-Fi, and complimentary parking. 
            Ideally situated near Dambulla's key attractions, including the Cave Temple and Rangiri Stadium, 
            the hotel provides well-equipped rooms, some with garden views. Guests can enjoy an Asian breakfast 
            and explore nearby historical sites like Ibbankatuwa Tombs and Kaludiya Pokuna. The hotel also offers 
            room service and a 24-hour front desk, with Sigiriya Airport just 17 km away.
          </p>
        </div>
      </div>

        {/* Gold Divider Line */}
        <div className="gold-line"></div>
      

<div className="location-section">
        <div className="location-content">
          
          {/* LEFT SIDE - Text */}
          <div className="location-text">
            <h2 className="location-title">OUR LOCATION</h2>
            
            <p className="location-description">
              Located in the heart of Sri Lanka's cultural triangle, our hotel in Dambulla 
              offers a serene escape amidst lush greenery and ancient heritage. Just minutes 
              from the iconic Dambulla Cave Temple, our hotel provides easy access to historic 
              sites, wildlife sanctuaries, and vibrant local markets. Ideal for both relaxation 
              and exploration, our hotel is the perfect base for discovering the rich history 
              and natural beauty of Dambulla.
            </p>

            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Dambulla,+Sri+Lanka" 
              target="_blank" 
              rel="noopener noreferrer"
              className="directions-btn"
            >
              <span className="directions-icon">◆</span>
              Directions →
            </a>
          </div>

          {/* RIGHT SIDE - Real Google Map */}
      <div className="location-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.523!2d80.6495!3d7.872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca5676c86bbdd%3A0x7cf2560faeb3ac49!2sGolden%20Stars%20Hotel%20Dambulla!5e0!3m2!1sen!2slk!4v1710000000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Golden Stars Hotel Dambulla"
        ></iframe>
      </div>

        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Golden Stars Dambulla</h3>
            <p>Luxury and comfort in the heart of Sri Lanka.</p>
          </div>
          <div className="footer-middle">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Rooms</li>
              <li>Menu</li>
              <li>Reservation</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-right">
            <h4>Follow Us</h4>
            <p>Facebook | Instagram | YouTube</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Golden Stars Hotel Dambulla • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;