import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/Pictures/SignInLogo.png';
import '../NavBar/NavBar.css';
import { AuthContext } from '../../context/AuthContext';
import ProfileDrawer from '../ProfileDrawer/ProfileDrawer';

const Navbar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Golden Stars Hotel" />
          </Link>
        </div>

        <div className="nav-menu">
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>Rooms</Link>
            <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
            <Link to="/reservation" className={`nav-link ${location.pathname === '/reservation' ? 'active' : ''}`}>Reservation</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </div>

          <div className="profile-section">
            {user ? (
              <button 
                className="profile-link-btn"
                onClick={() => setIsProfileOpen(true)}
              >
                <img
                  src={user.userImage || user.picture || 'https://via.placeholder.com/45'}
                  alt="Profile"
                  className="profile-pic"
                  key={user.email || 'profile-avatar'}
                />
              </button>
            ) : (
              <Link to="/signin" className={`nav-link ${location.pathname === '/signin' ? 'active' : ''}`}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default Navbar;