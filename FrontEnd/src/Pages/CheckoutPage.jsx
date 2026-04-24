import { useContext, useState } from "react";
import api from "../utils/axiosInstance";
import Navbar from '../Components/NavBar/NavBar';
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";
import { AuthContext } from "../context/AuthContext";
import LocationPicker from "../Components/LocationPicker";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    area: "",
    city: "",
    notes: "",
    paymentMethod: "CASH",
  });

  const [locationData, setLocationData] = useState({
    lat: null,
    lng: null,
    formattedAddress: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: "error", text: "Please sign in to place your order." });
      return;
    }
    if (!items.length) {
      setMessage({ type: "error", text: "Your cart is empty." });
      return;
    }
    if (!form.customerName.trim()) {
      setMessage({ type: "error", text: "Enter your full name." });
      return;
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setMessage({ type: "error", text: "Enter a valid email." });
      return;
    }
    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone)) {
      setMessage({ type: "error", text: "Enter a valid 10-digit phone number." });
      return;
    }
    if (!form.street.trim() || !form.city.trim()) {
      setMessage({ type: "error", text: "Street and city are required." });
      return;
    }

    // Location is mandatory — either from map click OR "Use Current Location"
    // but typed address fields (street/city) are sufficient without map coords
    // We'll use 0,0 as fallback if no map location selected but address is filled
    const lat = locationData.lat || 0;
    const lng = locationData.lng || 0;

    const payload = {
      customerName: form.customerName,
      email:        form.email,
      phone:        form.phone,
      houseNo:      form.houseNo,
      street:       form.street,
      area:         form.area,
      city:         form.city,
      notes:        form.notes,
      paymentMethod: form.paymentMethod,
      latitude:     lat,
      longitude:    lng,
      formattedAddress: locationData.formattedAddress || `${form.street}, ${form.city}`,
      items: items.map((i) => ({
        itemId:       i.itemId || i.item_id,
        quantity:     i.quantity,
        selectedSize: i.selectedSize || "DEFAULT",
        unitPrice:    i.price,
      })),
    };

    try {
      setLoading(true);
      setMessage(null);
      await api.post("/api/customer/orders", payload);
      clearCart();
      setMessage({ type: "success", text: "🎉 Order placed successfully! Redirecting..." });
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to place order. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fffdf8", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 70px" }}>
        <h1 style={{ marginBottom: 28, fontSize: 32, fontWeight: 800, color: "#1f1a14" }}>Checkout</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr", gap: 24 }}>

          {/* LEFT — delivery details */}
          <div style={{ ...panelStyle, display: "grid", gap: 14 }}>
            <div style={sectionLabel}>Personal Info</div>

            <input placeholder="Full Name *" value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Email *" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Phone (10 digits) *" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={fieldStyle} />

            <div style={sectionLabel}>Delivery Address</div>

            <input placeholder="House No / Apartment" value={form.houseNo}
              onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Street *" value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Area (optional)" value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              style={fieldStyle} />

            <input placeholder="City *" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={fieldStyle} />

            <textarea placeholder="Delivery notes (optional)" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ ...fieldStyle, height: 80, resize: "vertical" }} />

            <select value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              style={fieldStyle}>
              <option value="CASH">Cash on delivery</option>
              <option value="CARD">Card</option>
            </select>

            <div style={sectionLabel}>
              Pin Location on Map
              <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400, marginLeft: 8 }}>
                (optional — helps with delivery)
              </span>
            </div>

            <LocationPicker
              value={locationData}
              onChange={(data) => {
                setLocationData({ lat: data.lat, lng: data.lng, formattedAddress: data.formattedAddress });
                setForm((prev) => ({
                  ...prev,
                  street: data.street || prev.street,
                  city:   data.city   || prev.city,
                }));
              }}
            />

            {locationData.formattedAddress && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: 10, fontSize: 13, color: "#166534" }}>
                📍 {locationData.formattedAddress}
              </div>
            )}
          </div>

          {/* RIGHT — summary */}
          <div style={panelStyle}>
            <div style={sectionLabel}>Order Summary</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "12px 0" }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#374151" }}>{item.itemName} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "8px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <strong style={{ fontSize: 15 }}>Total</strong>
              <strong style={{ fontSize: 15, color: "#059669" }}>Rs. {total.toFixed(2)}</strong>
            </div>

            <button type="submit" disabled={loading} style={goldBtn}>
              {loading ? "Placing..." : "Place Order"}
            </button>

            {message && (
              <div style={message.type === "success" ? successBox : errorBox}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

const panelStyle   = { background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" };
const fieldStyle   = { padding: "12px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };
const sectionLabel = { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 4 };
const goldBtn      = { marginTop: 4, padding: 14, width: "100%", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 };
const successBox   = { marginTop: 12, padding: "12px 14px", background: "#d1fae5", color: "#065f46", borderRadius: 10, fontSize: 14 };
const errorBox     = { marginTop: 12, padding: "12px 14px", background: "#fee2e2", color: "#991b1b", borderRadius: 10, fontSize: 14 };
