import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import api from "../../utils/axiosInstance";

const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF", label: "Pending",         next: ["CONFIRMED"]          },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6", label: "Confirmed",       next: ["PREPARING"]          },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", label: "Preparing",       next: ["OUT_FOR_DELIVERY"]    },
  OUT_FOR_DELIVERY: { bg: "#E0E7FF", color: "#3730A3", dot: "#6366F1", label: "Out for Delivery",next: ["DELIVERED"]           },
  DELIVERED:        { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Delivered ✓",     next: []                     },
  CANCELLED:        { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", label: "Cancelled",       next: []                     },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

function OrderCard({ enriched, onStatusUpdate }) {
  const { order, address, mapsUrl } = enriched;
  const sc       = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
  const nextSc   = sc.next.length ? STATUS_CONFIG[sc.next[0]] : null;
  const [updating, setUpdating] = useState(false);

  const handleNextStatus = async () => {
    if (!sc.next.length) return;
    const nextStatus = sc.next[0];
    setUpdating(true);
    try {
      await api.patch(
        `/api/delivery/orders/${order.orderId}/status`,
        { status: nextStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      onStatusUpdate(order.orderId, nextStatus);
    } catch { alert("Failed to update order status. Please try again."); }
    finally { setUpdating(false); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", border: `1px solid ${sc.dot}22`, marginBottom: 0 }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: sc.color }}>Order #{order.orderId}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff", color: sc.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${sc.dot}44` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
            {sc.label}
          </span>
        </div>
        <span style={{ fontSize: 12, color: sc.color, fontWeight: 500 }}>
          {fmtDate(order.orderDate)} {fmtTime(order.orderDate)}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>Order Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Customer</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>User {order.userId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Total Amount</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Rs. {Number(order.totalAmount || 0).toLocaleString()}</span>
            </div>
            {order.paymentMethod && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Payment</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{order.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>Delivery Address</div>
          {address ? (
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: "#111827" }}>{address.street}</div>
              <div>{address.city}{address.district ? `, ${address.district}` : ""}</div>
              {address.postalCode && <div style={{ color: "#6B7280" }}>Postal: {address.postalCode}</div>}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>No address on file</div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#EFF6FF", color: "#1E40AF", fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1.5px solid #BFDBFE" }}
            onMouseEnter={e => e.currentTarget.style.background = "#DBEAFE"}
            onMouseLeave={e => e.currentTarget.style.background = "#EFF6FF"}>
            📍 Open in Google Maps
          </a>
        )}

        {nextSc && (
          <button onClick={handleNextStatus} disabled={updating}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: updating ? "#9CA3AF" : `linear-gradient(135deg,${nextSc.dot},${nextSc.dot}CC)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: updating ? "not-allowed" : "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
            {updating ? "Updating..." : `Mark as ${nextSc.label.replace(" ✓", "")} →`}
          </button>
        )}

        {order.orderStatus === "DELIVERED" && (
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#065F46", fontWeight: 700 }}>
            ✓ Delivery Complete
          </span>
        )}
      </div>
    </div>
  );
}

export default function DeliveryMyOrdersPage({ defaultTab } = {}) {
  const navigate       = useNavigate();
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab, setTab] = useState(defaultTab || "active"); // "active" | "history"

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get("/api/delivery/me/profile");
      setProfile(res.data);
    } catch (e) {
      setError(e.response?.data || "Failed to load your orders.");
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setProfile(prev => {
      if (!prev) return prev;
      const update = (list) => list.map(e =>
        e.order.orderId === orderId ? { ...e, order: { ...e.order, orderStatus: newStatus } } : e
      );
      let active  = update(prev.activeOrders);
      let history = update(prev.historyOrders);

      if (newStatus === "DELIVERED" || newStatus === "CANCELLED") {
        const moved = active.find(e => e.order.orderId === orderId);
        if (moved) {
          active  = active.filter(e => e.order.orderId !== orderId);
          history = [moved, ...history];
        }
      }
      return { ...prev, activeOrders: active, historyOrders: history,
               totalDelivered: history.filter(e => e.order.orderStatus === "DELIVERED").length };
    });
  };

  const tabBtn = (id, label, count) => (
    <button onClick={() => setTab(id)}
      style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: tab === id ? 700 : 500, border: "1.5px solid #E5E7EB", background: tab === id ? NAVY : "#fff", color: tab === id ? "#fff" : "#6B7280", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
      {label}
      {count > 0 && <span style={{ background: tab === id ? GOLD : "#F3F4F6", color: tab === id ? "#111" : "#6B7280", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8 }}>{count}</span>}
    </button>
  );

  if (loading) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
      <DeliverySidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚴</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Loading your orders...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
      <DeliverySidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Could not load orders</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>{error}</div>
          <button onClick={loadProfile}
            style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  const { activeOrders, historyOrders } = profile;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.2s ease; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <DeliverySidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>{tab === "active" ? "My Active Orders" : "Delivery History"}</span>
            </div>
            <button onClick={loadProfile}
              style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              ↻ Refresh
            </button>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>My Orders</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Orders assigned to you. Update status as you progress each delivery.</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Active",    value: activeOrders.length,             border: "#6366F1" },
                { label: "Completed", value: profile.totalDelivered,           border: "#10B981" },
                { label: "Total",     value: activeOrders.length + historyOrders.length, border: GOLD },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Tab header */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginRight: 4 }}>My Orders</span>
                {tabBtn("active",  "🚚 Active",  activeOrders.length)}
                {tabBtn("history", "✅ History", historyOrders.length)}
              </div>

              <div style={{ padding: "20px 24px" }}>
                {tab === "active" ? (
                  activeOrders.length === 0 ? (
                    <div style={{ padding: "48px 0", textAlign: "center" }}>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No active orders!</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>You have no orders in progress right now.</div>
                      <button onClick={() => navigate("/delivery/available")}
                        style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                        Browse Available Orders
                      </button>
                    </div>
                  ) : (
                    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {activeOrders.map(enriched => (
                        <OrderCard key={enriched.order.orderId} enriched={enriched} onStatusUpdate={handleStatusUpdate} />
                      ))}
                    </div>
                  )
                ) : (
                  historyOrders.length === 0 ? (
                    <div style={{ padding: "48px 0", textAlign: "center" }}>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>📦</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No delivery history yet</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF" }}>Completed and cancelled orders will appear here.</div>
                    </div>
                  ) : (
                    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {historyOrders.map(enriched => (
                        <OrderCard key={enriched.order.orderId} enriched={enriched} onStatusUpdate={handleStatusUpdate} />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
