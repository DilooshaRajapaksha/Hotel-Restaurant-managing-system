import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple mailto (works without backend)
    window.location.href = `mailto:goldenstarshotel@gmail.com?subject=Contact from ${formData.name}&body=${formData.message} (${formData.email})`;
  };

 
  const whatsappNumber = "94707000767"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="contact-container">

      <h1 className="contact-title">Contact GoldenStars Hotel</h1>

      <div className="contact-content">

        {/* LEFT - FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>

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
          ></textarea>

          <button type="submit">Send Email</button>
        </form>

        {/* RIGHT - INFO + WHATSAPP */}
        <div className="contact-info">
          <h2>Reach Us</h2>

          <p><strong>📍 Address:</strong> Dambulla, Sri Lanka</p>
          <p><strong>📞 Phone:</strong> +94 707 000 767</p>
          <p><strong>📧 Email:</strong> info@goldenstarsdambulla@gmail.com</p>

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

      {/* Floating WhatsApp Icon */}
      <a
        href={whatsappLink}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        💬
      </a>

    </div>
  );
};

export default Contact;