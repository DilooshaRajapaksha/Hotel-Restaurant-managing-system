import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/NavBar/NavBar';
import { AuthContext } from '../Context/AuthContext';
import api from '../utils/axiosInstance';

const GOLD = "#d4af37";

const STATUS_META = {
  PENDING:          { label: "Pending",          color: "#F59E0B", bg: "#FEF3C7", icon: "⏳" },
  CONFIRMED:        { label: "Confirmed",         color: "#3B82F6", bg: "#DBEAFE", icon: "✅" },
  PREPARING:        { label: "Preparing",         color: "#8B5CF6", bg: "#EDE9FE", icon: "🍳" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery",  color: "#F97316", bg: "#FFEDD5", icon: "🚚" },
  DELIVERED:        { label: "Delivered",         color: "#10B981", bg: "#D1FAE5", icon: "✔️" },
  CANCELLED:        { label: "Cancelled",         color: "#EF4444", bg: "#FEE2E2", icon: "✖" },
};

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"];

function OrderCard({ order, onTrack }) {
  const navigate = useNavigate();
  const meta = STATUS_META[order.order_status] || { label: order.order_status, color: "#6B7280", bg: "#F3F4F6", icon: "📋" };
  const isActive = ACTIVE_STATUSES.includes(order.order_status);

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "20px 24px", marginBottom: 14,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6",
      transition: "box-shadow 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 3 }}>Order #{order.order_id}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{fmtDate(order.order_date)}</div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
          color: meta.color, background: meta.bg,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#374151" }}>
              <span>• {item.item_name || item.itemName} × {item.quantity}</span>
              <span style={{ color: "#6B7280" }}>LKR {((item.unit_price || item.unitPrice || 0) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Address */}
      {order.formatted_address && (
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, display: "flex", gap: 6, alignItems: "flex-start" }}>
          <span>📍</span>
          <span>{order.formatted_address}</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>
          LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isActive && (
            <button
              onClick={() => navigate(`/order-tracking?orderId=${order.order_id}`)}
              style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#b8972e)`, color: "#111", cursor: "pointer", fontFamily: "inherit" }}>
              🚚 Track Order
            </button>
          )}
          <button
            onClick={() => navigate(`/order-tracking?orderId=${order.order_id}`)}
            style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultTab = searchParams.get("tab") === "current"  ? "current"
                   : searchParams.get("tab") === "previous" ? "previous"
                   : "all";

  const [tab, setTab]       = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/customer/orders/my');
      setOrders(res.data || []);
    } catch (e) {
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allOrders      = orders;
  const currentOrders  = orders.filter(o => ACTIVE_STATUSES.includes(o.order_status));
  const previousOrders = orders.filter(o => !ACTIVE_STATUSES.includes(o.order_status));

  const displayOrders = tab === "current" ? currentOrders
                      : tab === "previous" ? previousOrders
                      : allOrders;

  const tabStyle = (active) => ({
    padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
    border: "none", fontFamily: "inherit", transition: "all 0.15s",
    background: active ? `linear-gradient(135deg,${GOLD},#b8972e)` : "#F3F4F6",
    color: active ? "#111" : "#6B7280",
    boxShadow: active ? "0 2px 8px rgba(212,175,55,0.3)" : "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #111; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#111", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <Navbar />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "110px 20px 60px" }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <button onClick={() => navigate('/profile')}
              style={{ background: "transparent", border: "none", color: GOLD, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
              ← Back to Profile
            </button>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 6 }}>My Orders</h1>
            <p style={{ color: "#9CA3AF", fontSize: 14 }}>
              {allOrders.length} total orders · {currentOrders.length} active
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button style={tabStyle(tab==="all")}      onClick={() => setTab("all")}>
              📋 All ({allOrders.length})
            </button>
            <button style={tabStyle(tab==="current")}  onClick={() => setTab("current")}>
              🔄 Active ({currentOrders.length})
            </button>
            <button style={tabStyle(tab==="previous")} onClick={() => setTab("previous")}>
              ✅ History ({previousOrders.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: 32, marginBottom: 12, display: "inline-block" }} className="spin">⏳</div>
              <div style={{ fontSize: 14 }}>Loading your orders...</div>
            </div>
          ) : error ? (
            <div style={{ background: "#FEE2E2", color: "#991B1B", padding: 20, borderRadius: 12, fontSize: 14, textAlign: "center" }}>
              ⚠ {error}
              <button onClick={fetchOrders} style={{ marginLeft: 10, background: "transparent", border: "1px solid #F87171", color: "#DC2626", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Retry</button>
            </div>
          ) : displayOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                {tab === "current" ? "🍽️" : tab === "previous" ? "📦" : "🛒"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                {tab === "current" ? "No active orders" : tab === "previous" ? "No past orders" : "No orders yet"}
              </div>
              <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 20 }}>
                {tab === "current" ? "Place an order to see it here." : "Your order history will appear here."}
              </p>
              <button onClick={() => navigate('/menu')}
                style={{ padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#b8972e)`, color: "#111", cursor: "pointer", fontFamily: "inherit" }}>
                Browse Menu
              </button>
            </div>
          ) : (
            displayOrders.map(order => (
              <OrderCard key={order.order_id} order={order} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
