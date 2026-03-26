import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt  = (n) => Number(n || 0).toLocaleString();
const fmtR = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;


function BarChart({ data, color, formatValue }) {
  const max  = Math.max(...data, 1);
  const W    = 560, H = 160, PAD = 32, barW = 28;
  const gap  = (W - PAD * 2 - barW * 12) / 11;

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} width="100%" style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={PAD} y1={H - H * t} x2={W - PAD} y2={H - H * t}
          stroke="#F3F4F6" strokeWidth="1" />
      ))}
      {data.map((val, i) => {
        const bh = Math.max((val / max) * H, val > 0 ? 4 : 0);
        const x  = PAD + i * (barW + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bh} width={barW} height={bh}
              fill={color} rx="4" opacity="0.85">
              <title>{MONTHS[i]}: {formatValue ? formatValue(val) : val}</title>
            </rect>
            <text x={x + barW / 2} y={H + 18} textAnchor="middle"
              fontSize="10" fill="#9CA3AF" fontFamily="DM Sans, sans-serif">
              {MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return (
    <div style={{ width: 140, height: 140, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#9CA3AF" }}>
      No data
    </div>
  );
  const R = 54, r = 34, cx = 70, cy = 70;
  let angle = -Math.PI / 2;
  const paths = segments.map(seg => {
    const sweep = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const ix2 = cx + r * Math.cos(angle - sweep), iy2 = cy + r * Math.sin(angle - sweep);
    const ix1 = cx + r * Math.cos(angle),          iy1 = cy + r * Math.sin(angle);
    return { d: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix1},${iy1} A${r},${r} 0 ${large},0 ${ix2},${iy2} Z`, color: seg.color, label: seg.label, value: seg.value };
  });
  return (
    <svg viewBox="0 0 140 140" width="140" height="140">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity="0.9">
          <title>{p.label}: {p.value}</title>
        </path>
      ))}
      <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827" fontFamily="DM Sans">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#9CA3AF"  fontFamily="DM Sans">Total</text>
    </svg>
  );
}

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#9CA3AF" }}>{sub}</div>}
    </div>
  );
}


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/reports/summary`)
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load report data. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .nav-card:hover { background: #FFFBEB !important; border-color: #C9A84C !important; }
        .nav-card { transition: all 0.18s; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Reports & Dashboard</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>🔔</button>
              <div style={{ width: 1, height: 32, background: "#E5E7EB" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>Admin</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.2 }}>administrator@goldenstar.lk</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div style={{ padding: "32px", flex: 1, overflowY: "auto" }}>

            {/* Page title */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Reports & Dashboard</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Golden Stars Hotel — overview for {data?.currentYear || new Date().getFullYear()}
              </p>
            </div>

            {loading ? (
              <div style={{ padding: 80, textAlign: "center", color: "#9CA3AF", fontSize: 15 }}>Loading dashboard data...</div>
            ) : error ? (
              <div style={{ padding: 80, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{error}</div>
            ) : (
              <>
                {}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                  <StatCard label="Total Revenue"    value={fmtR(data.totalRevenue)}    color="#C9A84C" icon="💰" sub="From confirmed bookings" />
                  <StatCard label="Total Bookings"   value={fmt(data.totalBookings)}    color="#6366F1" icon="📅" sub={`${fmt(data.confirmedBookings)} confirmed`} />
                  <StatCard label="Registered Users" value={fmt(data.totalUsers)}       color="#F59E0B" icon="👥" sub="Customers" />
                  <StatCard label="Menu Items"       value={fmt(data.totalMenuItems)}   color="#F97316" icon="🍽️" sub={`${fmt(data.totalMenuCategories)} categories`} />
                </div>

                {}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>🏨 Room Availability</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Current status of all {fmt(data.totalRooms)} rooms</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>

                    {}
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "18px 20px", borderLeft: "4px solid #C9A84C" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#C9A84C" }}>{fmt(data.totalRooms)}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginTop: 4 }}>Total Rooms</div>
                    </div>

                    {}
                    <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "18px 20px", borderLeft: "4px solid #10B981" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#10B981" }}>{fmt(data.availableRooms)}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginTop: 4 }}>Available</div>
                      <div style={{ marginTop: 10, height: 6, background: "#D1FAE5", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${data.totalRooms > 0 ? (data.availableRooms / data.totalRooms) * 100 : 0}%`, background: "#10B981", borderRadius: 4 }} />
                      </div>
                    </div>

                    {}
                    <div style={{ background: "#FFF5F5", borderRadius: 10, padding: "18px 20px", borderLeft: "4px solid #EF4444" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#EF4444" }}>{fmt(data.unavailableRooms)}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginTop: 4 }}>Unavailable</div>
                      <div style={{ marginTop: 10, height: 6, background: "#FEE2E2", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${data.totalRooms > 0 ? (data.unavailableRooms / data.totalRooms) * 100 : 0}%`, background: "#EF4444", borderRadius: 4 }} />
                      </div>
                    </div>

                    {}
                    <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "18px 20px", borderLeft: "4px solid #F59E0B" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>{fmt(data.maintenanceRooms)}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginTop: 4 }}>Maintenance</div>
                      <div style={{ marginTop: 10, height: 6, background: "#FEF3C7", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${data.totalRooms > 0 ? (data.maintenanceRooms / data.totalRooms) * 100 : 0}%`, background: "#F59E0B", borderRadius: 4 }} />
                      </div>
                    </div>

                  </div>
                </div>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>

                  {}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Monthly Bookings</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>{data.currentYear} — room bookings per month</div>
                      </div>
                      <span style={{ background: "#EEF2FF", color: "#6366F1", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                        {fmt(data.totalBookings)} total
                      </span>
                    </div>
                    <BarChart data={Array.from(data.monthlyBookings)} color="#6366F1" />
                  </div>

                  {}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Booking Status</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Distribution by status</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                      <DonutChart segments={[
                        { value: Number(data.pendingBookings),   color: "#F59E0B", label: "Pending"   },
                        { value: Number(data.confirmedBookings), color: "#10B981", label: "Confirmed" },
                        { value: Number(data.cancelledBookings), color: "#EF4444", label: "Cancelled" },
                      ]} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                          { label: "Pending",   value: data.pendingBookings,   color: "#F59E0B" },
                          { label: "Confirmed", value: data.confirmedBookings, color: "#10B981" },
                          { label: "Cancelled", value: data.cancelledBookings, color: "#EF4444" },
                        ].map(({ label, value, color }) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
                            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "#111827" }}>{fmt(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>

                  {}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Monthly Revenue</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>{data.currentYear} — income from confirmed bookings</div>
                      </div>
                      <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                        {fmtR(data.totalRevenue)} total
                      </span>
                    </div>
                    <BarChart data={Array.from(data.monthlyRevenue).map(Number)} color="#C9A84C" formatValue={fmtR} />
                  </div>

                  {}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>⚡ Quick Actions</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Jump to a section</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {}
                      {[
                        { label: "View All Rooms",    path: "/admin/rooms",    icon: "🏨", sub: `${fmt(data.totalRooms)} rooms total`    },
                        { label: "Add New Room",      path: "/admin/rooms/add",icon: "➕", sub: "Add a new hotel room"                   },
                        { label: "View All Bookings", path: "/admin/bookings", icon: "📅", sub: `${fmt(data.totalBookings)} bookings total` },
                      ].map(({ label, path, icon, sub }) => (
                        <button key={path} className="nav-card" onClick={() => navigate(path)}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA", cursor: "pointer", textAlign: "left", width: "100%" }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{label}</div>
                            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{sub}</div>
                          </div>
                          <span style={{ marginLeft: "auto", color: "#D1D5DB", fontSize: 18 }}>›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>🏆 Most Booked Rooms</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Top 5 rooms by total bookings</div>
                  {data.topBookedRooms.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF", fontSize: 13 }}>No booking data yet — bookings will appear here once customers start reserving rooms.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {data.topBookedRooms.map((room, i) => {
                        const maxCount = data.topBookedRooms[0]?.count || 1;
                        const pct      = Math.round((room.count / maxCount) * 100);
                        const medals   = ["🥇","🥈","🥉","4️⃣","5️⃣"];
                        return (
                          <div key={room.roomId} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{medals[i]}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room #{room.roomId}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C" }}>
                                  {fmt(room.count)} booking{room.count !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C9A84C,#8B6914)", borderRadius: 4, transition: "width 0.6s ease" }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {}
                <div style={{ background: "linear-gradient(135deg,#0F1923,#1E2D3D)", borderRadius: 14, padding: "28px 32px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                    📊 {data.currentYear} Year Summary
                  </div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>Golden Stars Hotel & Restaurant — annual overview</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
                    {[
                      { label: "Total Rooms",   value: fmt(data.totalRooms),        icon: "🏨", color: "#C9A84C" },
                      { label: "Available",     value: fmt(data.availableRooms),    icon: "✅", color: "#10B981" },
                      { label: "Unavailable",   value: fmt(data.unavailableRooms),  icon: "❌", color: "#EF4444" },
                      { label: "Maintenance",   value: fmt(data.maintenanceRooms),  icon: "🔧", color: "#F59E0B" },
                      { label: "Total Bookings",value: fmt(data.totalBookings),     icon: "📅", color: "#6366F1" },
                      { label: "Total Revenue", value: fmtR(data.totalRevenue),     icon: "💰", color: "#10B981" },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
