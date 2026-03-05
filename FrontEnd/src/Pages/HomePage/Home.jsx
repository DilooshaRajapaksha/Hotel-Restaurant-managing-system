import React from 'react';
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Pictures/SignInLogo.png';
import SlideImage1 from '../../assets/Pictures/SlideImage1.png';
import SlideImage2 from '../../assets/Pictures/Slideimage2.png';
import SlideImage3 from '../../assets/Pictures/SlideImage3.png';
import SlideImage4 from '../../assets/Pictures/SlideImage4.png';
import SlideImage5 from '../../assets/Pictures/SlideImage5.png';

const slideImage = [
    SlideImage1,
    SlideImage2,
    SlideImage3,
    SlideImage4,
    SlideImage5
]

const Home = () => {
    console.log('Home component loaded');
    console.log('Slide images:', slideImage);

    return(
        <div className = "home-page">
            <div className = "navbar">
                <div className = "logo">
                    <img src={Logo} alt="Hotel Logo" />
                </div>
                <div className = "nav-menu">
                    <Link to="/" className="nav-link active">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/menu" className="nav-link">Menu</Link>
                    <Link to="/rooms" className="nav-link">Rooms</Link>
                    <Link to="/reservation" className="nav-link">Reservation</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/signin" className="nav-link signin">Sign In</Link>
                </div>
            </div>
            
            <div className = "slider-container">
                {slideImage.length > 0 ? (
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
                        {slideImage.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={image} alt={`Slide ${index + 1}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className = "slide">
                        <p>No images available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home