import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import api from "../../utils/axiosInstance";

const GOLD = "#C9A84C";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF",  label: "Pending"   },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6",  label: "Confirmed" },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B",  label: "Preparing" },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

export default function DeliveryAvailableOrdersPage() {
  const navigate      = useNavigate();
  const [orders,  setOrders]   = useState([]);
  const [loading, setLoading]  = useState(true);
  const [toast,   setToast]    = useState(null);
  const [taking,  setTaking]   = useState(null); // orderId being claimed

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { loadOrders(); }, []);

  // Auto-refresh every 20s so delivery person sees new orders in real time
  useEffect(() => {
    const t = setInterval(loadOrders, 20000);
    return () => clearInterval(t);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/delivery/orders/unassigned");
      // Show only PENDING / CONFIRMED / PREPARING — ignore DELIVERED / CANCELLED
      const eligible = (res.data || []).filter(o =>
        ["PENDING", "CONFIRMED", "PREPARING"].includes(o.orderStatus)
      );
      setOrders(eligible);
    } catch {
      showToast("Failed to load orders. Please refresh.", "error");
    } finally { setLoading(false); }
  };

  const handleTakeOrder = async (orderId) => {
    setTaking(orderId);
    try {
      await api.patch(`/api/delivery/orders/${orderId}/self-assign`);
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      showToast(`Order #${orderId} assigned to you! Head to My Active Orders.`);
    } catch (e) {
      showToast(e.response?.data || "Could not take this order.", "error");
    } finally { setTaking(null); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; }
        .ord-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.10) !important; transform: translateY(-2px); }
        .ord-card { transition: all 0.2s; }
        .take-btn:hover:not(:disabled) { background: linear-gradient(135deg,${GOLD},#8B6914) !important; color: #fff !important; border-color: transparent !important; transform: translateY(-1px); }
        .take-btn { transition: all 0.15s; }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.25s ease; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .live-dot { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: toast.type === "error" ? "#FEE2E2" : "#D1FAE5", color: toast.type === "error" ? "#991B1B" : "#065F46", border: `1px solid ${toast.type === "error" ? "#FCA5A5" : "#6EE7B7"}` }}>
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <DeliverySidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Available Orders</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                Live · Auto-refreshes every 20s
              </span>
              <button onClick={loadOrders}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                ↻ Refresh
              </button>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Available Orders</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                These orders have no delivery person assigned yet. Click <strong>Take This Order</strong> to claim one.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Available Now",  value: orders.length,                                         border: GOLD      },
                { label: "Pending",        value: orders.filter(o => o.orderStatus === "PENDING").length,   border: "#9CA3AF" },
                { label: "Ready to Ship",  value: orders.filter(o => o.orderStatus !== "PENDING").length,   border: "#10B981" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Orders */}
            {loading ? (
              <div style={{ padding: 56, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading available orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "56px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No available orders right now</div>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>Check back soon — this page refreshes automatically every 20 seconds.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {orders.map(order => {
                  const sc        = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
                  const isTaking  = taking === order.orderId;
                  return (
                    <div key={order.orderId} className="ord-card"
                      style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", border: `1px solid ${sc.dot}22` }}>

                      {/* Card header */}
                      <div style={{ padding: "14px 20px", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: sc.color }}>Order #{order.orderId}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff", color: sc.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${sc.dot}44` }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                            {sc.label}
                          </span>
                        </div>
                        <span style={{ fontSize: 12, color: sc.color }}>
                          {fmtDate(order.orderDate)} {fmtTime(order.orderDate)}
                        </span>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Customer</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>User {order.userId}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Total</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>Rs. {Number(order.totalAmount || 0).toLocaleString()}</div>
                          </div>
                          {order.paymentMethod && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Payment</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{order.paymentMethod}</div>
                            </div>
                          )}
                        </div>

                        <button className="take-btn"
                          onClick={() => handleTakeOrder(order.orderId)}
                          disabled={isTaking || taking !== null}
                          style={{
                            padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                            border: `2px solid ${GOLD}`,
                            background: isTaking ? "#9CA3AF" : "transparent",
                            color: isTaking ? "#fff" : GOLD,
                            cursor: isTaking || taking !== null ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: (taking !== null && !isTaking) ? 0.5 : 1,
                          }}>
                          {isTaking ? "Claiming..." : "🚴 Take This Order"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
