import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../utils/axiosInstance";

const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF",  label: "Pending"          },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6",  label: "Confirmed"        },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B",  label: "Preparing"        },
  OUT_FOR_DELIVERY: { bg: "#E0E7FF", color: "#3730A3", dot: "#6366F1",  label: "Out for Delivery" },
  DELIVERED:        { bg: "#D1FAE5", color: "#065F46", dot: "#10B981",  label: "Delivered ✓"      },
  CANCELLED:        { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444",  label: "Cancelled"        },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function DeliveryDashboard() {
  const navigate       = useNavigate();
  const { user }       = useContext(AuthContext);
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get("/api/delivery/me/profile");
      setProfile(res.data);
    } catch (e) {
      setError(e.response?.data || "Failed to load your profile.");
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
      <DeliverySidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚴</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Loading your dashboard...</div>
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
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Could not load dashboard</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>{error}</div>
          <button onClick={loadProfile}
            style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  const { staff, activeOrders, historyOrders, totalDelivered } = profile;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .act-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .act-card { transition: all 0.2s; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <DeliverySidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>My Dashboard</span>
            </div>
            <button onClick={loadProfile}
              style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              ↻ Refresh
            </button>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Profile banner */}
            <div style={{ background: `linear-gradient(135deg,${NAVY},#2D4270)`, borderRadius: 16, padding: "24px 28px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 4px 16px rgba(27,42,74,0.25)" }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", border: "3px solid rgba(255,255,255,0.25)", flexShrink: 0 }}>
                {(staff.sName || "?").charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  Welcome back, {staff.sName}! 👋
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>✉ {staff.email}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>📞 {staff.contactNumber}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>📅 Joined {fmtDate(staff.joinTime)}</span>
                </div>
              </div>
              <span style={{ fontSize: 12, background: "rgba(201,168,76,0.2)", color: GOLD, fontWeight: 700, padding: "5px 14px", borderRadius: 20, border: `1px solid ${GOLD}55`, whiteSpace: "nowrap" }}>
                🚴 Delivery Staff
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Active Orders",     value: activeOrders.length,                       color: "#3730A3", bg: "#E0E7FF",  border: "#6366F1" },
                { label: "Completed Today",   value: totalDelivered,                            color: "#065F46", bg: "#D1FAE5",  border: "#10B981" },
                { label: "Total Deliveries",  value: activeOrders.length + historyOrders.length, color: "#92400E", bg: "#FEF3C7", border: GOLD      },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <button onClick={() => navigate("/delivery/available")}
                style={{ background: `linear-gradient(135deg,${GOLD},#8B6914)`, border: "none", borderRadius: 14, padding: "20px 24px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(201,168,76,0.3)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📦</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Available Orders</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Pick up new delivery orders</div>
              </button>
              <button onClick={() => navigate("/delivery/my-orders")}
                style={{ background: "#fff", border: "2px solid #E5E7EB", borderRadius: 14, padding: "20px 24px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🚚</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 4 }}>My Active Orders</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>
                  {activeOrders.length > 0 ? `${activeOrders.length} order${activeOrders.length > 1 ? "s" : ""} in progress` : "No active orders right now"}
                </div>
              </button>
            </div>

            {/* Active orders preview */}
            {activeOrders.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Active Orders</span>
                    <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{activeOrders.length}</span>
                  </div>
                  <button onClick={() => navigate("/delivery/my-orders")}
                    style={{ fontSize: 12, color: GOLD, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    View All →
                  </button>
                </div>

                <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeOrders.slice(0, 3).map(enriched => {
                    const o  = enriched.order;
                    const sc = STATUS_CONFIG[o.orderStatus] || STATUS_CONFIG.PENDING;
                    return (
                      <div key={o.orderId} className="act-card"
                        style={{ background: "#FAFAFA", borderRadius: 10, padding: "14px 16px", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                        onClick={() => navigate("/delivery/my-orders")}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🚚</div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>Order #{o.orderId}</div>
                            <div style={{ fontSize: 12, color: "#6B7280" }}>{fmtDate(o.orderDate)}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontWeight: 700, color: GOLD, fontSize: 14 }}>Rs. {Number(o.totalAmount || 0).toLocaleString()}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                            {sc.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeOrders.length === 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "40px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>All clear! No active orders.</div>
                <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>Check Available Orders to pick up a new delivery.</div>
                <button onClick={() => navigate("/delivery/available")}
                  style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                  Browse Available Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
