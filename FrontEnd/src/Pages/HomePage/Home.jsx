import React, { useEffect, useState } from 'react';
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
import './Home.css';
import Footer from "../../Components/Footer";
import api from '../../utils/axiosInstance';

const slideImages = [SlideImage1, SlideImage2, SlideImage3, SlideImage4, SlideImage5];

const features = [
  { icon: '🌿', name: 'Serene Garden',   desc: 'Lush tropical gardens to relax and unwind in natural beauty.' },
  { icon: '📶', name: 'Free Wi-Fi',      desc: 'High-speed internet throughout the entire property.' },
  { icon: '🍽️', name: 'Asian Breakfast', desc: 'Start your day with an authentic Sri Lankan morning feast.' },
  { icon: '🚗', name: 'Free Parking',    desc: 'Complimentary secure parking for all guests.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

useEffect(() => {
  api.get('/api/experiences')
    .then(res => setExperiences(res.data))
    .catch(err => {
      console.error("Failed to load experiences:", err.message);
      setExperiences([]);
    });
}, []);

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
                <button className="hero-cta-btn book-now" onClick={() => navigate('/rooms')}>Book Now</button>
                <button className="hero-cta-btn order-now" onClick={() => navigate('/menu')}>Order Now</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <section className="welcome-section">
        <div className="welcome-content">
          <div className={loaded ? 'anim-up d1' : ''}>
            <div className="welcome-kicker">
              <span className="welcome-kicker-dot" />
              GOLDEN STARS SIGNATURE EXPERIENCE
            </div>
          </div>
          <div className={loaded ? 'anim-up d2' : ''}>
            <p className="welcome-subtitle">Book today for a comfortable and enjoyable stay!</p>
            <h1 className="welcome-title">Welcome to<br />Golden Stars Dambulla</h1>
          </div>
          <div className={loaded ? 'anim-up d3' : ''}>
            <p className="welcome-description">
              Golden Stars Hotel Dambulla, located just 20 km from Sigiriya Rock and 23 km from
              Pidurangala Rock, offers comfortable accommodations with a serene garden, free Wi-Fi,
              and complimentary parking. Ideally situated near Dambulla's key attractions — including
              the Cave Temple and Rangiri Stadium — the hotel provides well-equipped rooms, some with
              garden views. Guests can enjoy an Asian breakfast and explore nearby historical sites.
            </p>
          </div>
          <div className="gold-line" />
        </div>
      </section>

      <section className="features-strip">
        <div className="features-strip-inner">
          <span className={`features-strip-kicker ${loaded ? 'anim-up d1' : ''}`}>WHY CHOOSE US</span>
          <h2 className={`features-strip-title ${loaded ? 'anim-up d2' : ''}`}>A Stay Like No Other</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={f.name} className={`feature-card ${loaded ? `anim-up d${i + 3}` : ''}`}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="experiences-section">
        <div className="experiences-grid-container">
          <div className="experiences-header">
            <span className="experiences-kicker">SIGNATURE EXPERIENCES</span>
            <h2 className="experiences-title-small">Things to Do Around Golden Stars</h2>
          </div>
          <div className="experiences-grid">
            {experiences.slice(0, 4).map((exp, index) => (
              <div key={exp.experienceId} className={`experience-card ${loaded ? `anim-up d${index + 1}` : ''}`}>
                <div className="card-image-wrapper">
                  <img src={exp.imageUrl} alt={exp.title} />
                  <div className="card-overlay"></div>
                </div>
                <div className="card-content">
                  <div className="card-location">{exp.location}</div>
                  <h3 className="card-title">{exp.title}</h3>
                  <a href="/experiences" className="view-more-link">view more —</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="location-section">
        <div className="location-content">
          <div className={`location-text ${loaded ? 'anim-r d2' : ''}`}>
            <div className="location-kicker">
              <span className="location-kicker-dot" />
              OUR LOCATION
            </div>
            <h2 className="location-title">Find Us in the Heart of Sri Lanka</h2>
            <p className="location-description">
              Located in the heart of Sri Lanka's cultural triangle, our hotel in Dambulla
              offers a serene escape amidst lush greenery and ancient heritage. Just minutes
              from the iconic Dambulla Cave Temple, our hotel provides easy access to historic
              sites, wildlife sanctuaries, and vibrant local markets.
            </p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Dambulla,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="directions-btn">
              <span className="directions-icon">◆</span>
              Get Directions →
            </a>
          </div>
          <div className={`location-map ${loaded ? 'anim-l d3' : ''}`}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.523!2d80.6495!3d7.872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca5676c86bbdd%3A0x7cf2560faeb3ac49!2sGolden%20Stars%20Hotel%20Dambulla!5e0!3m2!1sen!2slk!4v1710000000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Golden Stars Hotel Dambulla"></iframe>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;