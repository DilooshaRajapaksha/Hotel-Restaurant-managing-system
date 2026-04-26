import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Pictures/SignInLogo.png";
import "../NavBar/NavBar.css";
import { AuthContext } from "../../Context/AuthContext";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import { useCart } from "../../Context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { items } = useCart();

  const count = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const isMenuActive =
    location.pathname === "/menu" ||
    location.pathname === "/menu/list" ||
    location.pathname.startsWith("/menu/");

  const isActive = (path) => location.pathname === path;

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
            <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
              Home
            </Link>

            <Link to="/rooms" className={`nav-link ${isActive("/rooms") ? "active" : ""}`}>
              Rooms
            </Link>

            <Link to="/menu" className={`nav-link ${isMenuActive ? "active" : ""}`}>
              Menu
            </Link>

            <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
              Contact
            </Link>

            <Link to="/cart" className="cart-btn">
             <span className="cart-text">Cart</span>
              <span className="cart-badge">{count}</span>
            </Link>
            </div>

          <div className="profile-section">
            {user ? (
              <button
                className="profile-link-btn"
                onClick={() => setIsProfileOpen(true)}
              >
                <img
                  src={user.userImage || user.picture || "https://via.placeholder.com/45"}
                  alt="Profile"
                  className="profile-pic"
                />
              </button>
            ) : (
              <Link to="/signin" className={`nav-link ${isActive("/signin") ? "active" : ""}`}>
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