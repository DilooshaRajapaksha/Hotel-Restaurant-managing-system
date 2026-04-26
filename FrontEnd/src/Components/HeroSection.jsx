import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroImg from "../assets/istockphoto-1560615831-612x612.jpg";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatImage {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(201,168,76,0.0); }
          50% { box-shadow: 0 0 28px rgba(201,168,76,0.20); }
          100% { box-shadow: 0 0 0 rgba(201,168,76,0.0); }
        }

        .hero-wrap {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(201,168,76,0.18), transparent 28%),
            radial-gradient(circle at bottom left, rgba(217,184,95,0.18), transparent 24%),
            linear-gradient(180deg, #fffaf0 0%, #f8edd1 55%, #fff7e7 100%);
          border-bottom: 1px solid #eadfcb;
          font-family: "DM Sans", sans-serif;
        }

        .hero-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
          opacity: 0.5;
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 88px 24px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 34px;
          align-items: center;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.68);
          border: 1px solid rgba(201,168,76,0.28);
          color: #a0781d;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 18px;
          backdrop-filter: blur(8px);
        }

        .hero-badge-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8cb76, #b8922f);
          animation: pulseGlow 2.8s infinite ease-in-out;
        }

        .hero-title {
          font-family: "Playfair Display", serif;
          font-size: 64px;
          line-height: 1.03;
          color: #1f1a14;
          margin: 0 0 18px;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(255,255,255,0.55);
        }

        .hero-title span {
          background: linear-gradient(135deg, #8b6914, #d9b85f, #8b6914);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text {
          font-size: 18px;
          line-height: 1.9;
          color: #5e5548;
          max-width: 610px;
          margin-bottom: 28px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-btn {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          padding: 14px 22px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
        }

        .hero-btn-primary {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          box-shadow: 0 14px 28px rgba(185,146,47,0.28);
        }

        .hero-btn-primary::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
          transform: translateX(-120%);
        }

        .hero-btn-primary:hover::after {
          animation: shimmer 0.9s ease;
        }

        .hero-btn-secondary {
          border: 1.5px solid rgba(201,168,76,0.45);
          color: #2f261d;
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(8px);
        }

        .hero-btn-secondary:hover {
          box-shadow: 0 10px 22px rgba(185,146,47,0.12);
          border-color: #c9a84c;
        }

        .hero-stats {
          display: flex;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .hero-stat {
          min-width: 120px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(201,168,76,0.18);
          backdrop-filter: blur(8px);
          box-shadow: 0 12px 24px rgba(83, 62, 12, 0.06);
        }

        .hero-stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #a0781d;
          margin-bottom: 4px;
        }

        .hero-stat-label {
          font-size: 12px;
          color: #756b5d;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .hero-image-wrap {
          position: relative;
          animation: floatImage 5s ease-in-out infinite;
        }

        .hero-image-glow {
          position: absolute;
          inset: auto auto 18px 18px;
          width: 92%;
          height: 92%;
          border-radius: 32px;
          background: radial-gradient(circle, rgba(201,168,76,0.22), transparent 65%);
          filter: blur(22px);
          z-index: 0;
        }

        .hero-image-frame {
          position: relative;
          border-radius: 32px;
          padding: 10px;
          background: linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,247,231,0.5));
          border: 1px solid rgba(201,168,76,0.22);
          box-shadow:
            0 22px 60px rgba(83, 62, 12, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.7);
          z-index: 1;
        }

        .hero-image {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
          border-radius: 24px;
          transition: transform 0.45s ease;
        }

        .hero-image-frame:hover .hero-image {
          transform: scale(1.035);
        }

        .hero-card {
          position: absolute;
          z-index: 2;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(201,168,76,0.22);
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 40px rgba(83, 62, 12, 0.12);
          border-radius: 18px;
          padding: 14px 16px;
        }

        .hero-card-top {
          top: 22px;
          left: -22px;
        }

        .hero-card-bottom {
          bottom: 26px;
          right: -18px;
        }

        .hero-card-title {
          font-size: 12px;
          color: #8b7d68;
          font-weight: 700;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .hero-card-value {
          font-size: 20px;
          font-weight: 800;
          color: #1f1a14;
        }

        .hero-card-sub {
          font-size: 13px;
          color: #a0781d;
          font-weight: 700;
          margin-top: 4px;
        }

        .anim-left {
          opacity: 0;
          animation: fadeLeft 0.9s ease forwards;
        }

        .anim-right {
          opacity: 0;
          animation: fadeRight 1s ease forwards;
        }

        .anim-up {
          opacity: 0;
          animation: fadeUp 0.9s ease forwards;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.55s; }
        .delay-5 { animation-delay: 0.7s; }

        @media (max-width: 980px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 64px 20px;
          }

          .hero-title {
            font-size: 46px;
          }

          .hero-image {
            height: 420px;
          }

          .hero-card-top,
          .hero-card-bottom {
            position: static;
            margin-top: 14px;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 38px;
          }

          .hero-text {
            font-size: 16px;
          }

          .hero-image {
            height: 320px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-btn {
            width: 100%;
          }
        }
      `}</style>

      <section className="hero-wrap">
        <div className="hero-inner">
          <div>
            {/* <div className={`hero-badge ${loaded ? "anim-up delay-1" : ""}`}>
              <span className="hero-badge-dot" />
              GOLDEN STARS HOTEL & RESTAURANT
            </div> */}

            <h1 className={`hero-title ${loaded ? "anim-left delay-2" : ""}`}>
              Taste <span>luxury</span> in every bite.
            </h1>

            <p className={`hero-text ${loaded ? "anim-left delay-3" : ""}`}>
              Discover a refined dining experience with elegant presentation,
              rich flavors, and the warm hospitality of Golden Stars. From
              signature dishes to unforgettable evenings, every moment is
              crafted with care.
            </p>

            <div className={`hero-actions ${loaded ? "anim-up delay-4" : ""}`}>
              <Link to="/menu/list">
                <button className="hero-btn hero-btn-primary">Explore Menu</button>
              </Link>

              <Link to="/contact">
                <button className="hero-btn hero-btn-secondary">Contact US</button>
              </Link>
            </div>

            <div className={`hero-stats ${loaded ? "anim-up delay-5" : ""}`}>
              <div className="hero-stat">
                <div className="hero-stat-value">50+</div>
                <div className="hero-stat-label">Signature Dishes</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4.9</div>
                <div className="hero-stat-label">Guest Rating</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">24/7</div>
                <div className="hero-stat-label">Hospitality</div>
              </div>
            </div>
          </div>

          <div className={loaded ? "anim-right delay-3" : ""}>
            <div className="hero-image-wrap">
              <div className="hero-image-glow" />

              <div className="hero-image-frame">
                <img
                  src={heroImg}
                  alt="Golden Stars Restaurant dining"
                  className="hero-image"
                />
              </div>

              <div className="hero-card hero-card-top">
                <div className="hero-card-title">Chef’s Choice</div>
                <div className="hero-card-value">Premium Dining</div>
                <div className="hero-card-sub">Light gold signature style</div>
              </div>

              <div className="hero-card hero-card-bottom">
                <div className="hero-card-title">Golden Experience</div>
                <div className="hero-card-value">Elegant • Warm • Memorable</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}