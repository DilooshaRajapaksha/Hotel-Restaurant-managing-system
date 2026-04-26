import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/NavBar/NavBar';
import Footer from "../../Components/Footer";
import api from '../../utils/axiosInstance';

const Experiences = () => {
  const navigate = useNavigate();
  const [loaded,          setLoaded]          = useState(false);
  const [experiencesData, setExperiencesData] = useState([]);
  const [selected,        setSelected]        = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/api/experiences')
      .then(res => {
        setExperiencesData(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to load experiences:", err.message, err.response?.status);
        setExperiencesData([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="experiences-page">
      <Navbar />
      <div className="experiences-hero">
        <div className={`hero-content ${loaded ? 'anim-up' : ''}`}>
          <h1 className="experiences-title">EXPERIENCES</h1>
          <p className="experiences-subtitle">
            When visiting Sigiriya, the list of things to do is vast, and your stay can be made even
            more exciting by exploring the activities available at the hotel. Whether you're looking
            to unwind or embark on an adventure, there's something for everyone to enjoy.
          </p>
          <button className="view-more-btn" onClick={() => navigate('/experiences/all')}>
            View More Experiences
          </button>
        </div>
      </div>

      <div className="experiences-grid-container">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: 15 }}>
            Loading experiences...
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626', fontSize: 14 }}>
            ⚠ Could not load experiences. Please check your connection and try refreshing.
          </div>
        )}

        {!loading && !error && experiencesData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: 14 }}>
            No experiences available at the moment.
          </div>
        )}

        <div className="experiences-grid">
          {experiencesData.map((exp, index) => (
            <div
              key={exp.experienceId}
              className={`experience-card ${loaded ? `anim-up d${index + 1}` : ''}`}
            >
              <div className="card-image-wrapper">
                <img src={exp.imageUrl} alt={exp.title} />
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <div className="card-location">{exp.location}</div>
                <h3 className="card-title">{exp.title}</h3>
                <button onClick={() => setSelected(exp)} className="view-more-link">
                  view more --
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {selected && (
        <>
          <style>{`
            .experience-modal {
              position: fixed; top: 0; left: 0;
              width: 100%; height: 100vh;
              background: rgba(15,25,35,0.85);
              display: flex; align-items: center; justify-content: center;
              z-index: 2000;
            }
            .modal-content {
              background: #fff; max-width: 920px; width: 92%;
              border-radius: 24px; overflow: hidden; display: flex;
              box-shadow: 0 30px 70px rgba(212,175,55,0.25);
            }
            .modal-image { flex: 1; min-width: 45%; }
            .modal-image img { width: 100%; height: 100%; object-fit: cover; }
            .modal-body {
              flex: 1; padding: 48px 42px;
              display: flex; flex-direction: column;
            }
            .modal-location {
              font-size: 13px; font-weight: 700;
              letter-spacing: 1.8px; color: #c9a84c;
              text-transform: uppercase; margin-bottom: 8px;
            }
            .modal-title {
              font-family: 'Playfair Display', serif;
              font-size: 34px; font-weight: 700;
              color: #1f1a14; line-height: 1.1; margin-bottom: 12px;
            }
            .modal-price {
              font-size: 24px; font-weight: 700;
              color: #c9a84c; margin-bottom: 28px;
            }
            .modal-description {
              flex: 1; font-size: 1.08rem;
              line-height: 1.75; color: #5e5548;
            }
            .close-btn {
              margin-top: 32px; padding: 16px 40px;
              background: transparent; border: 2px solid #d4af37;
              color: #1f1a14; border-radius: 9999px;
              font-weight: 700; font-size: 1.05rem;
              cursor: pointer; align-self: flex-start; transition: all 0.3s;
            }
            .close-btn:hover { background: #d4af37; color: #fff; }
          `}</style>
          <div className="experience-modal" onClick={() => setSelected(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-image">
                <img src={selected.imageUrl} alt={selected.title} />
              </div>
              <div className="modal-body">
                <div className="modal-location">{selected.location}</div>
                <h2 className="modal-title">{selected.title}</h2>
                <div className="modal-price">LKR {Number(selected.price).toLocaleString()}</div>
                <p className="modal-description">{selected.description}</p>
                <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Experiences;
