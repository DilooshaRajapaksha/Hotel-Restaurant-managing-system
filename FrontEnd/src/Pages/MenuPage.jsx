// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../../Components/Customer/Navbar";
// import Footer from "../../Components/Customer/Footer";
// import MenuCard from "../../Components/Customer/MenuCard";

// export default function MenuPage() {
//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");

//   useEffect(() => {
//     axios
//       .get("http://localhost:8081/api/public/menu/categories")
//       .then((res) => setCategories(res.data || []))
//       .catch((err) => console.error("Failed to load categories:", err));
//   }, []);

//   useEffect(() => {
//     const url =
//       selectedCategoryId === "ALL"
//         ? "http://localhost:8081/api/public/menu/items"
//         : `http://localhost:8081/api/public/menu/items?categoryId=${selectedCategoryId}`;

//     axios
//       .get(url)
//       .then((res) => setItems(res.data || []))
//       .catch((err) => console.error("Failed to load menu items:", err));
//   }, [selectedCategoryId]);

//   return (
//     <div style={{ background: "#fffdf8", minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
//       <Navbar />

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
//         <h1 style={{ fontSize: 42, marginBottom: 12, color: "#1f1a14" }}>Our Menu</h1>
//         <p style={{ color: "#5e5548", marginBottom: 24 }}>
//           Explore our carefully prepared dishes at Golden Stars Hotel & Restaurant.
//         </p>

//         <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
//           <button
//             onClick={() => setSelectedCategoryId("ALL")}
//             style={chip(selectedCategoryId === "ALL")}
//           >
//             All
//           </button>

//           {categories.map((category) => (
//             <button
//               key={category.categoryId}
//               onClick={() => setSelectedCategoryId(category.categoryId)}
//               style={chip(selectedCategoryId === category.categoryId)}
//             >
//               {category.categoryName}
//             </button>
//           ))}
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
//           {items.map((item) => (
//             <MenuCard key={item.itemId} item={item} />
//           ))}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// function chip(active) {
//   return {
//     padding: "10px 14px",
//     borderRadius: 999,
//     border: "1px solid #eadfcb",
//     background: active ? "#f8edd1" : "white",
//     cursor: "pointer",
//     fontWeight: 600,
//   };
// }


import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Customer/Navbar";
import Footer from "../../Components/Customer/Footer";
import MenuCard from "../../Components/Customer/MenuCard";

const BASE_URL = "http://localhost:8081";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120);

    axios
      .get(`${BASE_URL}/api/public/menu/categories`)
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    const url =
      selectedCategoryId === "ALL"
        ? `${BASE_URL}/api/public/menu/items`
        : `${BASE_URL}/api/public/menu/items?categoryId=${selectedCategoryId}`;

    axios
      .get(url)
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error("Failed to load menu items:", err));
  }, [selectedCategoryId]);

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top right, rgba(201,168,76,0.10), transparent 20%), linear-gradient(180deg, #fffdf8 0%, #fffaf0 100%)",
        minHeight: "100vh",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

        @keyframes fadeUpLuxury {
          from {
            opacity: 0;
            transform: translateY(34px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInSoft {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmerMove {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(130%); }
        }

        .lux-menu-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(234,223,203,0.8);
        }

        .lux-menu-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at left top, rgba(217,184,95,0.12), transparent 28%),
            radial-gradient(circle at right center, rgba(201,168,76,0.09), transparent 22%);
          pointer-events: none;
        }

        .lux-menu-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 34px;
          z-index: 1;
        }

        .lux-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(201,168,76,0.2);
          color: #a0781d;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.2px;
          margin-bottom: 18px;
          backdrop-filter: blur(10px);
        }

        .lux-kicker-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8cb76, #b8922f);
        }

        .lux-menu-title {
          font-family: "Playfair Display", serif;
          font-size: 58px;
          line-height: 1.04;
          margin: 0 0 14px;
          color: #1f1a14;
          letter-spacing: -1px;
        }

        .lux-menu-desc {
          max-width: 760px;
          color: #5e5548;
          font-size: 18px;
          line-height: 1.9;
          margin: 0 0 26px;
        }

        .lux-chip-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .lux-chip {
          position: relative;
          overflow: hidden;
          padding: 11px 18px;
          border-radius: 999px;
          border: 1px solid rgba(217,184,95,0.34);
          background: rgba(255,255,255,0.85);
          color: #2f261d;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
          backdrop-filter: blur(8px);
        }

        .lux-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(185,146,47,0.12);
        }

        .lux-chip.active {
          color: #8b6914;
          background: linear-gradient(135deg, rgba(248,237,209,0.98), rgba(255,255,255,0.92));
          box-shadow: inset 0 0 0 1px rgba(201,168,76,0.24);
        }

        .lux-chip.active::after {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 6px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #d9b85f, #b8922f);
        }

        .lux-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 34px 24px 64px;
        }

        .lux-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .lux-empty {
          padding: 56px 20px;
          text-align: center;
          color: #8b7d68;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(234,223,203,0.9);
          border-radius: 24px;
          box-shadow: 0 12px 26px rgba(83,62,12,0.06);
        }

        .anim-up {
          opacity: 0;
          animation: fadeUpLuxury 0.85s ease forwards;
        }

        .anim-fade {
          opacity: 0;
          animation: fadeInSoft 0.9s ease forwards;
        }

        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.18s; }
        .delay-3 { animation-delay: 0.28s; }
        .delay-4 { animation-delay: 0.38s; }
        .delay-5 { animation-delay: 0.48s; }

        @media (max-width: 1024px) {
          .lux-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .lux-menu-title {
            font-size: 46px;
          }
        }

        @media (max-width: 700px) {
          .lux-grid {
            grid-template-columns: 1fr;
          }

          .lux-menu-title {
            font-size: 38px;
          }

          .lux-menu-desc {
            font-size: 16px;
          }
        }
      `}</style>

      <Navbar />

      <section className="lux-menu-hero">
        <div className="lux-menu-container">
          <div className={loaded ? "anim-up delay-1" : ""}>
            <div className="lux-kicker">
              <span className="lux-kicker-dot" />
              GOLDEN STARS SIGNATURE MENU
            </div>
          </div>

          <div className={loaded ? "anim-up delay-2" : ""}>
            <h1 className="lux-menu-title">Our Menu</h1>
          </div>

          <div className={loaded ? "anim-up delay-3" : ""}>
            <p className="lux-menu-desc">
              Explore our carefully prepared dishes at Golden Stars Hotel &
              Restaurant, where each meal is crafted with warmth, elegance, and
              premium taste.
            </p>
          </div>

          <div className={`lux-chip-row ${loaded ? "anim-up delay-4" : ""}`}>
            <button
              onClick={() => setSelectedCategoryId("ALL")}
              className={`lux-chip ${selectedCategoryId === "ALL" ? "active" : ""}`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategoryId(category.categoryId)}
                className={`lux-chip ${
                  selectedCategoryId === category.categoryId ? "active" : ""
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="lux-section">
        {items.length === 0 ? (
          <div className="lux-empty">No menu items found for this category.</div>
        ) : (
          <div className="lux-grid">
            {items.map((item, index) => (
              <div
                key={item.itemId}
                className={loaded ? `anim-up delay-${(index % 5) + 1}` : ""}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}