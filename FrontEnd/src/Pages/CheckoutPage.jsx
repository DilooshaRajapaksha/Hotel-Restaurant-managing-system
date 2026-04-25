import { useContext, useState } from "react";
import api from "../utils/axiosInstance";
import Navbar from '../Components/NavBar/NavBar';
import Footer from "../Components/Footer";
import { useCart } from "../Context/CartContext";
import { AuthContext } from "../Context/AuthContext";
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

    if (!form.email.trim()) {
      setMessage({ type: "error", text: "Enter your email." });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage({ type: "error", text: "Enter a valid email." });
      return;
    }

    if (!form.phone.trim()) {
      setMessage({ type: "error", text: "Enter your phone number." });
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setMessage({ type: "error", text: "Enter a valid 10-digit phone number." });
      return;
    }

    if (!form.street.trim() || !form.city.trim()) {
      setMessage({ type: "error", text: "Street and city are required." });
      return;
    }

    if (!locationData.lat || !locationData.lng) {
      setMessage({ type: "error", text: "Please select location on map." });
      return;
    }

    const payload = {
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      houseNo: form.houseNo,
      street: form.street,
      area: form.area,
      city: form.city,
      notes: form.notes,
      paymentMethod: form.paymentMethod,
      latitude: locationData.lat,
      longitude: locationData.lng,
      formattedAddress: locationData.formattedAddress,
      items: items.map((i) => ({
        itemId: i.itemId || i.item_id,
        quantity: i.quantity,
      })),
    };

    try {
      setLoading(true);
      setMessage(null);

      await api.post("/api/customer/orders", payload);

      clearCart();

      setMessage({
        type: "success",
        text: "🎉 Order placed successfully! Redirecting...",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (err) {
      console.error(err.response?.data || err.message);

      setMessage({
        type: "error",
        text: "Failed to place order. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fffdf8", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 70px"}}>
        <h1>Checkout</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr", gap: 24 }}>
          
          {/* LEFT */}
          <div style={{ ...panelStyle, display: "grid", gap: 14 }}>

            <input placeholder="Full Name" value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={fieldStyle} />

            <input placeholder="House No / Apartment"
              value={form.houseNo}
              onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Street"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              style={fieldStyle} />

            <input placeholder="Area (optional)"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              style={fieldStyle} />

            <input placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={fieldStyle} />

            <textarea placeholder="Delivery notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ ...fieldStyle, height: 80 }} />

            <select value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              style={fieldStyle}>
              <option value="CASH">Cash on delivery</option>
              <option value="CARD">Card</option>
            </select>

            <LocationPicker
              value={locationData}
              onChange={(data) => {
                setLocationData({
                  lat: data.lat,
                  lng: data.lng,
                  formattedAddress: data.formattedAddress,
                });

                setForm((prev) => ({
                  ...prev,
                  street: data.street || prev.street,
                  city: data.city || prev.city,
                }));
              }}
            />

            {locationData.formattedAddress && (
              <div style={locationBox}>
                 {locationData.formattedAddress}
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div style={panelStyle}>
            <h3>Summary</h3>

            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.itemName} × {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <hr />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Total</strong>
              <strong>Rs. {total.toFixed(2)}</strong>
            </div>

            <button type="submit" style={goldBtn}>
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

const panelStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
};

const fieldStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const goldBtn = {
  marginTop: 12,
  padding: 12,
  width: "100%",
  background: "#c9a44d",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const locationBox = {
  background: "#fff",
  padding: 10,
  borderRadius: 10,
};

const successBox = {
  marginTop: 10,
  padding: 10,
  background: "#d1fae5",
  color: "#065f46",
  borderRadius: 10,
};

const errorBox = {
  marginTop: 10,
  padding: 10,
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: 10,
};