import React, { useState, useEffect } from "react";
import "./Contact.css";
import Footer from "../../Components/Footer";
import Navbar from '../../Components/NavBar/NavBar';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:goldenstarshotel@gmail.com?subject=Contact from ${formData.name}&body=${formData.message} (${formData.email})`;
  };

  const whatsappNumber = "94707000767";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="contact-container">
    <Navbar />
      {/* ── Hero Header ── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className={loaded ? "anim-up d1" : ""}>
            <div className="contact-kicker">
              <span className="contact-kicker-dot" />
              GOLDEN STARS · GET IN TOUCH
            </div>
          </div>
          <div className={loaded ? "anim-up d2" : ""}>
            <h1 className="contact-hero-title">Contact Us</h1>
          </div>
          <div className={loaded ? "anim-up d3" : ""}>
            <p className="contact-hero-desc">
              We'd love to hear from you. Reach out for reservations, inquiries,
              or simply to say hello — we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* ── Body: Form + Info ── */}
      <div className="contact-body">

        {/* LEFT — Form */}
        <div className={loaded ? "anim-up d2" : ""}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send Us a Message</h2>
            <p className="form-subtitle">Fill in the form below and we'll get back to you shortly.</p>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              onChange={handleChange}
            />
            <button type="submit" className="contact-submit-btn">
              Send Email ✉
            </button>
          </form>
        </div>

        {/* RIGHT — Info */}
        <div className={loaded ? "anim-up d3" : ""}>
          <div className="contact-info">
            <div>
              <h2>Reach Us</h2>
              <p className="info-subtitle">Multiple ways to connect with Golden Stars Hotel.</p>
            </div>

            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <div className="info-label">Address</div>
                <div className="info-value">Dambulla, Central Province, Sri Lanka</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <div className="info-label">Phone</div>
                <div className="info-value">+94 707 000 767</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📧</span>
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">goldenstarshotel@gmail.com</div>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div>
                <div className="info-label">Front Desk</div>
                <div className="info-value">Open 24 hours · 7 days a week</div>
              </div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href={whatsappLink}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
      >
        💬
      </a>
      <Footer />
    </div>
  );
};

export default Contact;
