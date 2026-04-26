import { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "./MenuCard";

const BASE_URL = "http://localhost:8081";

export default function FeaturedSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/public/menu/featured`)
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error("Failed to load featured items", err));
  }, []);

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "64px 24px",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#b8922f", fontWeight: 800, marginBottom: 8 }}>
          FEATURED DISHES
        </div>
        <h2 style={{ fontSize: 40, margin: 0, color: "#1f1a14" }}>
          Signature picks from Golden Stars
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        {items.map((item) => (
          <MenuCard key={item.item_id} item={item} />
        ))}
      </div>
    </section>
  );
}