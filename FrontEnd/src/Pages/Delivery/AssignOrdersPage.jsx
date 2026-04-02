import { useState, useEffect } from "react";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";
const GOLD = "#C9A84C";

const STATUS_CONFIG = {
  PENDING:          { bg: "#F3F4F6", color: "#6B7280",  dot: "#9CA3AF",  label: "Pending"          },
  CONFIRMED:        { bg: "#DBEAFE", color: "#1E40AF",  dot: "#3B82F6",  label: "Confirmed"        },
  PREPARING:        { bg: "#FEF3C7", color: "#92400E",  dot: "#F59E0B",  label: "Preparing"        },
  OUT_FOR_DELIVERY: { bg: "#E0E7FF", color: "#3730A3",  dot: "#6366F1",  label: "Out for Delivery" },
  DELIVERED:        { bg: "#D1FAE5", color: "#065F46",  dot: "#10B981",  label: "Delivered"        },
  CANCELLED:        { bg: "#FEE2E2", color: "#991B1B",  dot: "#EF4444",  label: "Cancelled"        },
};

const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

// ── Assign Staff Dropdown ──────────────────────────────────────────────────
function AssignDropdown({ order, staffList, onAssign, onUnassign, onReassign }) {
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const assignedStaff = staffList.find(s => s.staffId === order.staffId);

  const handleSelect = async (staffId) => {
    setSaving(true); setOpen(false);
    try {
      if (!order.staffId) {
        await onAssign(order.orderId, staffId);
      } else {
        await onReassign(order.orderId, staffId);
      }
    } finally { setSaving(false); }
  };

  const handleUnassign = async () => {
    setSaving(true); setOpen(false);
    try { await onUnassign(order.orderId); }
    finally { setSaving(false); }
  };

  const isLocked = order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

  if (isLocked) return (
    <span style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
      {order.orderStatus === "DELIVERED" ? "Completed" : "Cancelled"}
    </span>
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => !saving && setOpen(p => !p)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${order.staffId ? GOLD : "#E5E7EB"}`, background: order.staffId ? "#FFFBEB" : "#FAFAFA", color: order.staffId ? "#92400E" : "#6B7280", fontSize: 12, fontWeight: order.staffId ? 700 : 500, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
        {saving ? "Saving..." : assignedStaff ? `👤 ${assignedStaff.sName}` : "Assign Staff"}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div onMouseLeave={() => setOpen(false)}
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", zIndex: 100, minWidth: 200, overflow: "hidden" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", padding: "8px 12px 4px" }}>
            {order.staffId ? "Reassign to" : "Assign to"}
          </p>
          {staffList.map(s => (
            <button key={s.staffId} onClick={() => handleSelect(s.staffId)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: s.staffId === order.staffId ? "#FFFBEB" : "transparent", border: "none", cursor: "pointer", fontSize: 12, fontWeight: s.staffId === order.staffId ? 700 : 400, color: s.staffId === order.staffId ? "#92400E" : "#374151", textAlign: "left", fontFamily: "inherit" }}
              onMouseEnter={e => { if (s.staffId !== order.staffId) e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { if (s.staffId !== order.staffId) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                {(s.sName || "?").charAt(0).toUpperCase()}
              </div>
              {s.sName}
              {s.staffId === order.staffId && <span style={{ marginLeft: "auto", fontSize: 10, background: GOLD, color: "#fff", padding: "1px 6px", borderRadius: 8 }}>Current</span>}
            </button>
          ))}
          {order.staffId && (
            <>
              <div style={{ height: 1, background: "#F3F4F6", margin: "4px 0" }} />
              <button onClick={handleUnassign}
                style={{ width: "100%", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#EF4444", fontWeight: 500, textAlign: "left", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                ✕ Remove Assignment
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AssignOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [staff,    setStaff]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("ALL");   // ALL | UNASSIGNED | ASSIGNED
  const [search,   setSearch]   = useState("");
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/delivery/orders`),
        axios.get(`${BASE_URL}/api/delivery/staff`),
      ]);
      setOrders(oRes.data || []);
      setStaff(sRes.data  || []);
    } catch { /* handle silently */ }
    finally { setLoading(false); }
  };

  const handleAssign = async (orderId, staffId) => {
    const res = await axios.patch(`${BASE_URL}/api/delivery/orders/${orderId}/assign`, { staffId });
    setOrders(prev => prev.map(o => o.orderId === orderId ? res.data : o));
    const staffName = staff.find(s => s.staffId === staffId)?.sName || "Staff";
    showToast(`Order #${orderId} assigned to ${staffName}`);
  };

  const handleUnassign = async (orderId) => {
    const res = await axios.patch(`${BASE_URL}/api/delivery/orders/${orderId}/unassign`);
    setOrders(prev => prev.map(o => o.orderId === orderId ? res.data : o));
    showToast(`Assignment removed from Order #${orderId}`);
  };

  const handleReassign = async (orderId, staffId) => {
    const res = await axios.patch(`${BASE_URL}/api/delivery/orders/${orderId}/reassign`, { staffId });
    setOrders(prev => prev.map(o => o.orderId === orderId ? res.data : o));
    const staffName = staff.find(s => s.staffId === staffId)?.sName || "Staff";
    showToast(`Order #${orderId} reassigned to ${staffName}`);
  };

  const filtered = orders.filter(o => {
    if (filter === "UNASSIGNED" && o.staffId) return false;
    if (filter === "ASSIGNED"   && !o.staffId) return false;
    const q = search.toLowerCase();
    if (q && !String(o.orderId).includes(q) && !String(o.userId).includes(q)) return false;
    return true;
  });

  const unassigned = orders.filter(o => !o.staffId).length;
  const assigned   = orders.filter(o =>  o.staffId).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .or:hover td { background: #FFFBEB !important; transition: background 0.12s; }
        .ftab { padding: 7px 16px; borderRadius: 8px; fontSize: 13px; fontWeight: 500; border: 1.5px solid #E5E7EB; background: #fff; color: #6B7280; cursor: pointer; fontFamily: inherit; transition: all 0.15s; }
        .ftab.active { background: #111827; color: #fff; border-color: #111827; font-weight: 700; }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.25s ease; }
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
              <span style={{ color: "#111827", fontWeight: 600 }}>Assign Orders</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admin</div>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Assign Orders</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Assign delivery staff to food orders.</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Orders",      value: orders.length, border: GOLD },
                { label: "Unassigned",         value: unassigned,    border: "#EF4444" },
                { label: "Assigned",           value: assigned,      border: "#10B981" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Main card */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              {/* Filters */}
              <div style={{ padding: "16px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                {[["ALL","All Orders"],["UNASSIGNED","Unassigned"],["ASSIGNED","Assigned"]].map(([val, label]) => (
                  <button key={val} className={`ftab${filter === val ? " active" : ""}`} onClick={() => setFilter(val)}>
                    {label}
                    {val === "UNASSIGNED" && unassigned > 0 && (
                      <span style={{ marginLeft: 6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{unassigned}</span>
                    )}
                  </button>
                ))}
                <div style={{ marginLeft: "auto", position: "relative" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 200, color: "#111827", fontFamily: "inherit", outline: "none" }}
                    placeholder="Search order ID..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button onClick={loadData} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
              </div>

              {/* Table */}
              {loading ? (
                <div style={{ padding: 56, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading orders...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 56, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No orders found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Try a different filter.</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                        {["Order ID","Customer","Order Date","Total","Order Status","Assigned Staff","Action"].map(h => (
                          <th key={h} style={{ padding: "11px 20px", textAlign: "left", color: "#9CA3AF", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, i) => {
                        const sc = STATUS_CONFIG[o.orderStatus] || STATUS_CONFIG.PENDING;
                        const assignedStaff = staff.find(s => s.staffId === o.staffId);
                        return (
                          <tr key={o.orderId} className="or" style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F9FAFB" }}>
                            <td style={{ padding: "14px 20px", fontWeight: 700, color: GOLD }}>{o.orderId}</td>
                            <td style={{ padding: "14px 20px", color: "#374151", fontWeight: 500 }}>User {o.userId}</td>
                            <td style={{ padding: "14px 20px", color: "#6B7280", whiteSpace: "nowrap" }}>
                              <div>{fmtDate(o.orderDate)}</div>
                              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{fmtTime(o.orderDate)}</div>
                            </td>
                            <td style={{ padding: "14px 20px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
                              Rs. {Number(o.totalAmount || 0).toLocaleString()}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                                {sc.label}
                              </span>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              {assignedStaff ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                                    {(assignedStaff.sName || "?").charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: "#111827", fontSize: 12 }}>{assignedStaff.sName}</div>
                                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{assignedStaff.contactNumber}</div>
                                  </div>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 500 }}>⚠ Not assigned</span>
                              )}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <AssignDropdown
                                order={o}
                                staffList={staff}
                                onAssign={handleAssign}
                                onUnassign={handleUnassign}
                                onReassign={handleReassign}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length > 0 && (
                <div style={{ padding: "12px 28px", borderTop: "1px solid #F3F4F6", fontSize: 12, color: "#9CA3AF" }}>
                  Showing {filtered.length} of {orders.length} orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
