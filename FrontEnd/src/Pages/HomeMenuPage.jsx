// import Navbar from "../../Components/Customer/Navbar";
// import HeroSection from "../../Components/Customer/HeroSection";
// import FeaturedSection from "../../Components/Customer/FeaturedSection";
// import Footer from "../../Components/Customer/Footer";

// export default function HomePage() {
//   return (
//     <div style={{ background: "#fffdf8" }}>
//       <Navbar />
//       <HeroSection />
//       <FeaturedSection />
//       <Footer />
//     </div>
//   );
// }


import Navbar from "../../Components/Customer/Navbar";
import HeroSection from "../../Components/Customer/HeroSection";
import FeaturedSection from "../../Components/Customer/FeaturedSection";
import Footer from "../../Components/Customer/Footer";
import { Link } from "react-router-dom";

function ExperienceSection() {
  return (
    <>
      <style>{`
        @keyframes fadeUpSoft {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gs-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 76px 24px;
          font-family: "DM Sans", sans-serif;
        }

        .gs-section-header {
          text-align: center;
          margin-bottom: 34px;
          animation: fadeUpSoft 0.8s ease;
        }

        .gs-section-kicker {
          color: #b8922f;
          font-weight: 800;
          letter-spacing: 1.4px;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .gs-section-title {
          font-family: "Playfair Display", serif;
          font-size: 44px;
          color: #1f1a14;
          margin: 0 0 12px;
        }

        .gs-section-text {
          color: #5e5548;
          font-size: 17px;
          line-height: 1.9;
          max-width: 760px;
          margin: 0 auto;
        }

        .gs-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          margin-top: 30px;
        }

        .gs-lux-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,249,235,0.92));
          border: 1px solid rgba(234,223,203,0.9);
          border-radius: 24px;
          padding: 26px;
          box-shadow: 0 16px 34px rgba(83,62,12,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeUpSoft 0.9s ease;
        }

        .gs-lux-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 40px rgba(83,62,12,0.12);
        }

        .gs-lux-card::before {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(201,168,76,0.16), transparent 68%);
          pointer-events: none;
        }

        .gs-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8edd1, #fff);
          color: #a0781d;
          font-size: 24px;
          margin-bottom: 16px;
          box-shadow: inset 0 0 0 1px rgba(201,168,76,0.18);
        }

        .gs-card-title {
          font-size: 22px;
          font-weight: 800;
          color: #1f1a14;
          margin-bottom: 10px;
        }

        .gs-card-text {
          color: #5e5548;
          line-height: 1.8;
          font-size: 15px;
        }

        .gs-banner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 24px;
        }

        .gs-banner-inner {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 40px 36px;
          background:
            linear-gradient(135deg, rgba(47,38,29,0.96), rgba(96,74,31,0.92)),
            linear-gradient(135deg, #2f261d, #7f5d1f);
          color: #fff7e1;
          box-shadow: 0 24px 54px rgba(47,38,29,0.2);
        }

        .gs-banner-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(217,184,95,0.28), transparent 26%),
            radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 24%);
          pointer-events: none;
        }

        .gs-banner-content {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .gs-banner-title {
          font-family: "Playfair Display", serif;
          font-size: 38px;
          margin: 0 0 8px;
        }

        .gs-banner-text {
          max-width: 660px;
          color: #f4e7c8;
          line-height: 1.8;
          margin: 0;
        }

        .gs-banner-btn {
          border: none;
          border-radius: 14px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #d9b85f, #b8922f);
          color: white;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(185,146,47,0.24);
          transition: transform 0.25s ease;
        }

        .gs-banner-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 980px) {
          .gs-grid-3 {
            grid-template-columns: 1fr;
          }

          .gs-section-title {
            font-size: 36px;
          }

          .gs-banner-title {
            font-size: 30px;
          }
        }
      `}</style>

      <section className="gs-section">
        <div className="gs-section-header">
          <div className="gs-section-kicker">WHY CHOOSE US</div>
          <h2 className="gs-section-title">A refined dining experience</h2>
          <p className="gs-section-text">
            Golden Stars brings together premium flavors, elegant ambiance, and
            heartfelt hospitality to create a restaurant experience that feels
            both luxurious and welcoming.
          </p>
        </div>

        <div className="gs-grid-3">
          <div className="gs-lux-card">
            <div className="gs-icon">✦</div>
            <div className="gs-card-title">Signature Dishes</div>
            <div className="gs-card-text">
              Carefully prepared meals with rich presentation, balanced flavors,
              and a premium Golden Stars touch in every serving.
            </div>
          </div>

          <div className="gs-lux-card">
            <div className="gs-icon">♛</div>
            <div className="gs-card-title">Elegant Ambience</div>
            <div className="gs-card-text">
              Warm light-gold interiors, refined styling, and a calm atmosphere
              ideal for family dining, celebrations, and quiet evenings.
            </div>
          </div>

          <div className="gs-lux-card">
            <div className="gs-icon">❖</div>
            <div className="gs-card-title">Warm Hospitality</div>
            <div className="gs-card-text">
              From the first welcome to the final course, we focus on attentive
              service and a memorable guest experience.
            </div>
          </div>
        </div>
      </section>

      {/* <div className="gs-banner">
        <div className="gs-banner-inner">
          <div className="gs-banner-content">
            <div>
              <h3 className="gs-banner-title">Reserve your Golden evening</h3>
              <p className="gs-banner-text">
                Whether it is a family dinner, special event, or relaxed dining
                experience, Golden Stars is ready to host your memorable
                moments.
              </p>
            </div>

            <Link to="/contact">
              <button className="gs-banner-btn">Book / Contact Now</button>
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "#fffdf8" }}>
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <FeaturedSection />
      <Footer />
    </div>
  );
}