export default function Footer() {
  return (
    <>
      <style>{`
        .gs-footer {
          margin-top: 60px;
          background:
            linear-gradient(135deg, rgba(31,26,20,0.98), rgba(74,57,29,0.96));
          color: #fff7e1;
          font-family: "DM Sans", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .gs-footer::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(217,184,95,0.18), transparent 22%),
            radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 22%);
          pointer-events: none;
        }

        .gs-footer-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 46px 24px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr;
          gap: 28px;
        }

        .gs-footer-brand {
          font-family: "Playfair Display", serif;
          font-size: 30px;
          margin: 0 0 10px;
          background: linear-gradient(135deg, #f8edd1, #d9b85f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gs-footer-text {
          color: #eadfcb;
          line-height: 1.9;
          max-width: 520px;
        }

        .gs-footer-head {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #d9b85f;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .gs-footer-link,
        .gs-footer-item {
          color: #f4e7c8;
          margin-bottom: 10px;
          display: block;
          text-decoration: none;
        }

        .gs-footer-link:hover {
          color: #fff;
        }

        .gs-footer-bottom {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 24px;
          color: #cdbd95;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .gs-footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer className="gs-footer">
        <div className="gs-footer-inner">
          <div>
            <h3 className="gs-footer-brand">Golden Stars</h3>
            <p className="gs-footer-text">
              Premium dining, warm hospitality, and elegant moments crafted for
              hotel guests, families, and unforgettable evenings.
            </p>
          </div>

          <div>
            <div className="gs-footer-head">Quick Links</div>
            <a href="/" className="gs-footer-link">Home</a>
            <a href="/menu" className="gs-footer-link">Menu</a>
            <a href="/contact" className="gs-footer-link">Contact</a>
            <a href="/cart" className="gs-footer-link">Cart</a>
          </div>

          <div>
            <div className="gs-footer-head">Contact</div>
            <div className="gs-footer-item">No 90/A Kandalama Road, Dambulla Sri Lanka.</div>
            <div className="gs-footer-item">(+94)707000767</div>
            <div className="gs-footer-item">info@goldenstarsdambulla.com</div>
          </div>
        </div>

        <div className="gs-footer-bottom">
          © 2026 Golden Stars Hotel & Restaurant. All rights reserved.
        </div>
      </footer>
    </>
  );
}