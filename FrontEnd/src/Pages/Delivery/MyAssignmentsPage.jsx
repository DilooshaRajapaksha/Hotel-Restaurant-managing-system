import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";
const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280",  dot: "#9CA3AF",  label: "Pending"          },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF",  dot: "#3B82F6",  label: "Confirmed"        },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E",  dot: "#F59E0B",  label: "Preparing"        },
  OUT_FOR_DELIVERY: { bg: "#E0E7FF", color: "#3730A3",  dot: "#6366F1",  label: "Out for Delivery" },
  DELIVERED:        { bg: "#D1FAE5", color: "#065F46",  dot: "#10B981",  label: "Delivered ✓"      },
  CANCELLED:        { bg: "#FEE2E2", color: "#991B1B",  dot: "#EF4444",  label: "Cancelled"        },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function MyAssignmentsPage() {
  const navigate  = useNavigate();
  const [staff,   setStaff]   = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("ACTIVE"); // ACTIVE | ALL

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/delivery/staff`),
        axios.get(`${BASE_URL}/api/delivery/orders`),
      ]);
      setStaff(sRes.data  || []);
      setOrders(oRes.data || []);
    } catch { /* handle silently */ }
    finally { setLoading(false); }
  };

  const assignedOrders = orders.filter(o => o.staffId !== null && o.staffId !== undefined);

  const displayOrders = filter === "ACTIVE"
    ? assignedOrders.filter(o => o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED")
    : assignedOrders;

  const grouped = staff.map(s => ({
    staff: s,
    orders: displayOrders.filter(o => o.staffId === s.staffId),
  })).filter(g => g.orders.length > 0);

  const activeCount = assignedOrders.filter(o =>
    o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED"
  ).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .ftab { padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1.5px solid #E5E7EB; background: #fff; color: #6B7280; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .ftab.active { background: ${NAVY}; color: #fff; border-color: ${NAVY}; font-weight: 700; }
        .order-row:hover { background: #FFFBEB !important; }
        ::placeholder { color: #C4C9D4; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <DeliverySidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>My Assignments</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admin</div>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>My Assignments</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Overview of all delivery assignments grouped by staff member.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Staff",        value: staff.length,           border: GOLD      },
                { label: "Active Assignments",  value: activeCount,            border: "#6366F1" },
                { label: "Total Assigned",      value: assignedOrders.length,  border: "#10B981" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              <div style={{ padding: "16px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginRight: 8 }}>Assignments</span>
                <button className={`ftab${filter === "ACTIVE" ? " active" : ""}`} onClick={() => setFilter("ACTIVE")}>
                  Active Only
                  {activeCount > 0 && <span style={{ marginLeft: 6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{activeCount}</span>}
                </button>
                <button className={`ftab${filter === "ALL" ? " active" : ""}`} onClick={() => setFilter("ALL")}>
                  All Assigned
                </button>
                <button onClick={loadData}
                  style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ padding: 56, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading assignments...</div>
              ) : grouped.length === 0 ? (
                <div style={{ padding: 56, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No active assignments</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>All orders are completed or no orders assigned yet.</div>
                  <button onClick={() => navigate("/delivery/orders")}
                    style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                    Go to Assign Orders
                  </button>
                </div>
              ) : (
                <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 28 }}>
                  {grouped.map(({ staff: s, orders: sOrders }) => (
                    <div key={s.staffId}>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                          {(s.sName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", cursor: "pointer" }}
                            onClick={() => navigate(`/delivery/staff/${s.staffId}`)}>
                            {s.sName}
                            <span style={{ marginLeft: 8, fontSize: 11, color: GOLD, fontWeight: 600, textDecoration: "underline" }}>View Profile →</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#6B7280" }}>{s.email} · {s.contactNumber}</div>
                        </div>
                        <span style={{ marginLeft: "auto", background: "#FFFBEB", color: "#92400E", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, border: `1px solid ${GOLD}44` }}>
                          {sOrders.length} order{sOrders.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      
                      <div style={{ background: "#FAFAFA", borderRadius: 12, overflow: "hidden", border: "1px solid #F3F4F6" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr style={{ background: "#F3F4F6" }}>
                              {["Order ID", "Customer", "Date", "Total", "Status"].map(h => (
                                <th key={h} style={{ padding: "9px 16px", textAlign: "left", color: "#6B7280", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sOrders.map((o, i) => {
                              const sc = STATUS_CONFIG[o.orderStatus] || STATUS_CONFIG.PENDING;
                              return (
                                <tr key={o.orderId} className="order-row"
                                  style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderTop: "1px solid #F3F4F6", transition: "background 0.12s" }}>
                                  <td style={{ padding: "12px 16px", fontWeight: 700, color: GOLD }}>#{o.orderId}</td>
                                  <td style={{ padding: "12px 16px", color: "#374151" }}>User {o.userId}</td>
                                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>{fmtDate(o.orderDate)}</td>
                                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827" }}>
                                    Rs. {Number(o.totalAmount || 0).toLocaleString()}
                                  </td>
                                  <td style={{ padding: "12px 16px" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                                      {sc.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
