import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import api from "../../utils/axiosInstance";

const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280",  dot: "#9CA3AF",  label: "Pending",           next: ["CONFIRMED"]                    },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF",  dot: "#3B82F6",  label: "Confirmed",         next: ["PREPARING"]                    },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E",  dot: "#F59E0B",  label: "Preparing",         next: ["OUT_FOR_DELIVERY"]             },
  OUT_FOR_DELIVERY: { bg: "#E0E7FF", color: "#3730A3",  dot: "#6366F1",  label: "Out for Delivery",  next: ["DELIVERED"]                    },
  DELIVERED:        { bg: "#D1FAE5", color: "#065F46",  dot: "#10B981",  label: "Delivered ✓",       next: []                               },
  CANCELLED:        { bg: "#FEE2E2", color: "#991B1B",  dot: "#EF4444",  label: "Cancelled",         next: []                               },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

function OrderCard({ enriched, onStatusUpdate }) {
  const { order, address, mapsUrl } = enriched;
  const sc = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.PENDING;
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
    } catch { alert("Failed to update order status."); }
    finally { setUpdating(false); }
  };

  const nextSc = sc.next.length ? STATUS_CONFIG[sc.next[0]] : null;

  return (
    <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden", border: `1px solid ${sc.dot}22` }}>

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

      <div style={{ padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>Order Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Customer ID</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>User {order.userId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Total Amount</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Rs. {Number(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>Delivery Address</div>
          {address ? (
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: "#111827" }}>{address.street}</div>
              <div>{address.city}, {address.district}</div>
              {address.postalCode && <div style={{ color: "#6B7280" }}>Postal: {address.postalCode}</div>}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>No address found</div>
          )}
        </div>

      </div>

      <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#EFF6FF", color: "#1E40AF", fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1.5px solid #BFDBFE", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#DBEAFE"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#EFF6FF"; }}>
            📍 Track on Google Maps
          </a>
        )}

        {nextSc && (
          <button onClick={handleNextStatus} disabled={updating}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: updating ? "#9CA3AF" : `linear-gradient(135deg,${nextSc.dot},${nextSc.dot}CC)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: updating ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s", marginLeft: "auto" }}>
            {updating ? "Updating..." : `Mark as ${nextSc.label.replace(" ✓", "")} →`}
          </button>
        )}

        {order.orderStatus === "DELIVERED" && (
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#065F46", fontWeight: 700 }}>✓ Delivery Complete</span>
        )}
      </div>
    </div>
  );
}

export default function AdminStaffProfilePage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // active | history

  useEffect(() => { loadProfile(); }, [id]);

  const loadProfile = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get(`/api/delivery/staff/${id}/profile`);
      setProfile(res.data);
    } catch (e) {
      setError(e.response?.data || "Failed to load staff profile.");
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updateList = (list) => list.map(e =>
        e.order.orderId === orderId
          ? { ...e, order: { ...e.order, orderStatus: newStatus } }
          : e
      );
      let updatedActive  = updateList(prev.activeOrders);
      let updatedHistory = updateList(prev.historyOrders);

      if (newStatus === "DELIVERED" || newStatus === "CANCELLED") {
        const moved = updatedActive.find(e => e.order.orderId === orderId);
        if (moved) {
          updatedActive  = updatedActive.filter(e => e.order.orderId !== orderId);
          updatedHistory = [moved, ...updatedHistory];
        }
      }
      return { ...prev, activeOrders: updatedActive, historyOrders: updatedHistory,
               totalDelivered: updatedHistory.filter(e => e.order.orderStatus === "DELIVERED").length };
    });
  };

  if (loading) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚴</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Loading profile...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Profile Not Found</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>{error}</div>
          <button onClick={() => navigate("/admin/delivery/staff")}
            style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
            Back to Staff List
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
        .tab-btn { padding: 8px 20px; border-radius: 8px; fontSize: 13px; fontWeight: 500; border: 1.5px solid #E5E7EB; background: #fff; color: #6B7280; cursor: pointer; fontFamily: inherit; transition: all 0.15s; }
        .tab-btn.active { background: ${NAVY}; color: #fff; border-color: ${NAVY}; font-weight: 700; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.2s ease; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF", cursor: "pointer" }} onClick={() => navigate("/admin/delivery/staff")}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#9CA3AF", cursor: "pointer" }} onClick={() => navigate("/admin/delivery/staff")}>Staff</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>{staff.sName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admin</div>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 24 }}>

              <div style={{ background: `linear-gradient(135deg,${NAVY},#2D4270)`, padding: "24px 28px 28px", display: "flex", alignItems: "center", gap: 20 }}>
                {/* Avatar */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", flexShrink: 0 }}>
                  {(staff.sName || "?").charAt(0).toUpperCase()}
                </div>
 
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", marginBottom: 6 }}>{staff.sName}</h2>
                  <span style={{ fontSize: 12, background: "rgba(201,168,76,0.25)", color: GOLD, fontWeight: 600, padding: "3px 12px", borderRadius: 20, border: `1px solid ${GOLD}66` }}>
                    🚴 Delivery Staff · ID: {staff.staffId}
                  </span>
                </div>
              </div>

              <div style={{ padding: "24px 28px 24px" }}>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {[
                    { icon: "✉️", label: "Email",        value: staff.email         },
                    { icon: "📞", label: "Contact",      value: staff.contactNumber },
                    { icon: "📅", label: "Joined",       value: fmtDate(staff.joinTime) },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", border: "1px solid #F3F4F6" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
                  {[
                    { label: "Active Orders",    value: activeOrders.length,  color: "#3730A3", bg: "#E0E7FF" },
                    { label: "Completed",        value: totalDelivered,        color: "#065F46", bg: "#D1FAE5" },
                    { label: "Total Assigned",   value: activeOrders.length + historyOrders.length, color: GOLD, bg: "#FFFBEB" },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              <div style={{ padding: "16px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginRight: 8 }}>My Orders</span>
                <button className={`tab-btn${activeTab === "active" ? " active" : ""}`} onClick={() => setActiveTab("active")}
                  style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: activeTab === "active" ? 700 : 500, border: "1.5px solid #E5E7EB", background: activeTab === "active" ? NAVY : "#fff", color: activeTab === "active" ? "#fff" : "#6B7280", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  Active
                  {activeOrders.length > 0 && <span style={{ marginLeft: 6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{activeOrders.length}</span>}
                </button>
                <button className={`tab-btn${activeTab === "history" ? " active" : ""}`} onClick={() => setActiveTab("history")}
                  style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: activeTab === "history" ? 700 : 500, border: "1.5px solid #E5E7EB", background: activeTab === "history" ? NAVY : "#fff", color: activeTab === "history" ? "#fff" : "#6B7280", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  History
                  <span style={{ marginLeft: 6, background: "#F3F4F6", color: "#6B7280", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{historyOrders.length}</span>
                </button>
                <button onClick={loadProfile} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  ↻ Refresh
                </button>
              </div>

              <div style={{ padding: "20px 28px" }}>
                {activeTab === "active" ? (
                  activeOrders.length === 0 ? (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No active orders!</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF" }}>You have no orders assigned right now. Enjoy the break!</div>
                    </div>
                  ) : (
                    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {activeOrders.map((enriched, i) => (
                        <OrderCard key={enriched.order.orderId} enriched={enriched} onStatusUpdate={handleStatusUpdate} />
                      ))}
                    </div>
                  )
                ) : (
                  historyOrders.length === 0 ? (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No delivery history yet</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF" }}>Completed deliveries will appear here.</div>
                    </div>
                  ) : (
                    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
