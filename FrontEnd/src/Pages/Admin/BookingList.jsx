import { useState, useEffect } from "react";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";

const Icons = {
  search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  empty: () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>),
  calendar: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  chevron: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  user: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  bed: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"/><path d="M6 12v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>),
  refresh: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
};

const STATUS_CONFIG = {
  PENDING:   { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", label: "Pending"   },
  CONFIRMED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Confirmed" },
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", label: "Cancelled" },
};

const FILTER_TABS = ["ALL", "PENDING", "CONFIRMED", "CANCELLED"];

function StatusDropdown({ booking, onStatusChange }) {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);
  const s = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.PENDING;

  const handleSelect = async (newStatus) => {
    if (newStatus === booking.bookingStatus) { setOpen(false); return; }
    setSaving(true); setOpen(false);
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/bookings/${booking.bookingId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      onStatusChange(booking.bookingId, newStatus);
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(p => !p)} disabled={saving}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "5px 10px 5px 12px", borderRadius: 20, border: `1.5px solid ${s.dot}33`, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: saving ? "#9CA3AF" : s.dot }} />
        {saving ? "Saving..." : s.label}
        <Icons.chevron />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", zIndex: 50, minWidth: 160, overflow: "hidden", animation: "slideUp 0.15s ease" }}>
          <div style={{ padding: "6px 0" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", padding: "4px 14px 8px" }}>Change Status</p>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <button key={key} onClick={() => handleSelect(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: key === booking.bookingStatus ? val.bg : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: key === booking.bookingStatus ? 700 : 500, color: key === booking.bookingStatus ? val.color : "#374151", textAlign: "left" }}
                onMouseEnter={e => { if (key !== booking.bookingStatus) e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { if (key !== booking.bookingStatus) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: val.dot }} />
                {val.label}
                {key === booking.bookingStatus && (
                  <span style={{ marginLeft: "auto", fontSize: 11, background: val.dot, color: "#fff", padding: "1px 7px", borderRadius: 10 }}>Current</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingList() {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [tab,       setTab]       = useState("ALL");
  const [toast,     setToast]     = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [userNames, setUserNames] = useState({});  
  const [roomNames, setRoomNames] = useState({});   

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async (isRefresh = false) => {
    try {
      setError(null); 
      if (isRefresh) {
        setRefreshing(true);
        setUserNames({});
        setRoomNames({});
      } else {
        setLoading(true);
      }
      const res = await axios.get(`${BASE_URL}/api/admin/bookings`);
      const data = res.data || [];
      setBookings(data);

      const uniqueUserIds = [...new Set(data.map(b => b.userId))];
      const uniqueRoomIds = [...new Set(data.map(b => b.roomId))];

      fetchUserNames(uniqueUserIds);
      fetchRoomNames(uniqueRoomIds);
    } catch {
      setError("Failed to load bookings. Make sure the backend is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserNames = async (userIds) => {
    const names = {};
    await Promise.all(
      userIds.map(async (uid) => {
        try {
          const res = await axios.get(`${BASE_URL}/api/admin/users/${uid}`);
          const u = res.data;
          names[uid] = `${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`.trim() || `User ${uid}`;
        } catch {
          names[uid] = `User ${uid}`; 
        }
      })
    );
    setUserNames(names);
  };

  const fetchRoomNames = async (roomIds) => {
    const names = {};
    await Promise.all(
      roomIds.map(async (rid) => {
        try {
          const res = await axios.get(`${BASE_URL}/api/admin/rooms/${rid}`);
          names[rid] = res.data.roomName || `Room #${rid}`;
        } catch {
          names[rid] = `Room ${rid}`; // fallback
        }
      })
    );
    setRoomNames(names);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b =>
      b.bookingId === bookingId ? { ...b, bookingStatus: newStatus } : b
    ));
    showToast(`Booking ${bookingId} updated to ${STATUS_CONFIG[newStatus]?.label} ✓`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = bookings.filter(b => {
    const matchTab = tab === "ALL" || b.bookingStatus === tab;
    const kw       = search.toLowerCase();
    const userName = (userNames[b.userId] || "").toLowerCase();
    const roomName = (roomNames[b.roomId] || "").toLowerCase();
    const matchSearch = !kw
      || String(b.bookingId).includes(kw)
      || userName.includes(kw)
      || roomName.includes(kw)
      || b.bookingStatus?.toLowerCase().includes(kw);
    return matchTab && matchSearch;
  });

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.bookingStatus === "PENDING").length,
    confirmed: bookings.filter(b => b.bookingStatus === "CONFIRMED").length,
    cancelled: bookings.filter(b => b.bookingStatus === "CANCELLED").length,
  };

  const formatDate   = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const nightsBetween = (cin, cout) => {
    if (!cin || !cout) return "—";
    const nights = Math.round((new Date(cout) - new Date(cin)) / (1000 * 60 * 60 * 24));
    return `${nights} night${nights !== 1 ? "s" : ""}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .bk-row:hover { background: #FFFBEB !important; }
        .tab-btn:hover { color: #C9A84C !important; }
        .search-input:focus { border-color: #C9A84C !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        .toast { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Bookings</span>
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

          <div style={{ padding: "32px", flex: 1 }}>

            {}
            <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Bookings</h1>
                <p style={{ fontSize: 14, color: "#6B7280" }}>View and manage all hotel room bookings.</p>
              </div>
              <button
                onClick={() => fetchBookings(true)}
                disabled={refreshing}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: refreshing ? "#F9FAFB" : "#fff", color: refreshing ? "#9CA3AF" : "#374151", cursor: refreshing ? "not-allowed" : "pointer", transition: "all 0.18s" }}
              >
                <span style={{ display: "inline-flex", animation: refreshing ? "spin 0.8s linear infinite" : "none" }}>
                  <Icons.refresh />
                </span>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Bookings", value: stats.total,     color: "#C9A84C" },
                { label: "Pending",        value: stats.pending,   color: "#F59E0B" },
                { label: "Confirmed",      value: stats.confirmed, color: "#10B981" },
                { label: "Cancelled",      value: stats.cancelled, color: "#EF4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              {}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  {}
                  <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 10, padding: 4 }}>
                    {FILTER_TABS.map(t => {
                      const active = tab === t;
                      const count  = t === "ALL" ? stats.total : t === "PENDING" ? stats.pending : t === "CONFIRMED" ? stats.confirmed : stats.cancelled;
                      return (
                        <button key={t} className="tab-btn" onClick={() => setTab(t)}
                          style={{ padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: active ? 700 : 500, border: "none", background: active ? "#fff" : "transparent", color: active ? "#111827" : "#6B7280", cursor: "pointer", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                          {t.charAt(0) + t.slice(1).toLowerCase()}
                          <span style={{ background: active ? "#F3F4F6" : "transparent", color: active ? "#6B7280" : "#9CA3AF", fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 10 }}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                  {}
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}><Icons.search /></span>
                    <input className="search-input"
                      style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 240, color: "#111827" }}
                      placeholder="Search by name, room, ID..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </div>
              </div>

              {}
              {loading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading bookings...</div>
              ) : error ? (
                <div style={{ padding: 48, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{error}</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#D1D5DB", display: "flex", justifyContent: "center", marginBottom: 16 }}><Icons.empty /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No bookings found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>{search ? "Try a different search keyword." : "No bookings in this category yet."}</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                        {["Booking ID", "Guest", "Room", "Check In", "Check Out", "Duration", "Guests", "Total Price", "Status"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, i) => (
                        <tr key={b.bookingId} className="bk-row"
                          style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontWeight: 700, color: "#C9A84C", fontSize: 13 }}>Booking {b.bookingId}</span>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                {(userNames[b.userId] || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                  {userNames[b.userId] || `User ${b.userId}`}
                                </div>
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>ID: {b.userId}</div>
                              </div>
                            </div>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                🏨
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                  {roomNames[b.roomId] || `Room ${b.roomId}`}
                                </div>
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>ID: {b.roomId}</div>
                              </div>
                            </div>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
                              <Icons.calendar />
                              {formatDate(b.checkInDate)}
                            </div>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
                              <Icons.calendar />
                              {formatDate(b.checkOutDate)}
                            </div>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                              {nightsBetween(b.checkInDate, b.checkOutDate)}
                            </span>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                            {b.numberOfGuest} guest{b.numberOfGuest !== 1 ? "s" : ""}
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
                              Rs. {Number(b.totalPrice).toLocaleString()}
                            </span>
                          </td>

                          {}
                          <td style={{ padding: "16px 20px" }}>
                            <StatusDropdown booking={b} onStatusChange={handleStatusChange} />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filtered.length > 0 && (
                <div style={{ padding: "12px 24px", borderTop: "1px solid #F3F4F6", fontSize: 13, color: "#9CA3AF" }}>
                  Showing {filtered.length} of {bookings.length} bookings
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
