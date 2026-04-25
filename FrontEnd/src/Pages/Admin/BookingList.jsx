import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import api from "../../Utils/axiosInstance";

const BASE_URL = "http://localhost:8080";
const PER_PAGE = 6;

const STATUS_CONFIG = {
  PENDING:   { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", label: "Pending"   },
  CONFIRMED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Confirmed" },
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", label: "Cancelled" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const nights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
};

function StatusDropdown({ booking, onStatusChange }) {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);
  const s = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.PENDING;

  const handleSelect = async (newStatus) => {
    if (newStatus === booking.bookingStatus) { setOpen(false); return; }
    setSaving(true); setOpen(false);
    try {
      await api.patch(
        `${BASE_URL}/api/admin/bookings/${booking.bookingId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      onStatusChange(booking.bookingId, newStatus);
    } catch { alert("Failed to update status."); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => !saving && setOpen(p => !p)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "5px 10px 5px 12px", borderRadius: 20, border: `1.5px solid ${s.dot}33`, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: saving ? "#9CA3AF" : s.dot }} />
        {saving ? "Saving..." : s.label}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)}
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", zIndex: 100, minWidth: 160, overflow: "hidden" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", padding: "8px 14px 4px" }}>Change Status</p>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button key={key} onClick={() => handleSelect(key)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: key === booking.bookingStatus ? val.bg : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: key === booking.bookingStatus ? 700 : 500, color: key === booking.bookingStatus ? val.color : "#374151", textAlign: "left", fontFamily: "inherit" }}
              onMouseEnter={e => { if (key !== booking.bookingStatus) e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { if (key !== booking.bookingStatus) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: val.dot, flexShrink: 0 }} />
              {val.label}
              {key === booking.bookingStatus && (
                <span style={{ marginLeft: "auto", fontSize: 10, background: val.dot, color: "#fff", padding: "1px 6px", borderRadius: 10 }}>Current</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewModal({ booking, userName, roomName, roomType, onClose }) {
  if (!booking) return null;
  const s = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.PENDING;
  const n = nights(booking.checkInDate, booking.checkOutDate);

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid #F3F4F6" }}>
      <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#111827", fontWeight: 600, textAlign: "right", marginLeft: 16 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeUp 0.2s ease" }}>

        {}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Booking Details</h3>
            </div>
            <span style={{ fontSize: 12, color: "#C9A84C", fontWeight: 700 }}>Booking {booking.bookingId}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${s.dot}33` }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
              {s.label}
            </span>
            <button onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", fontSize: 14, padding: 0 }}>✕</button>
          </div>
        </div>

        {}
        <div style={{ padding: "4px 24px 8px" }}>
          <Row label="Guest"       value={userName || `User ${booking.userId}`} />
          <Row label="Room"        value={roomName  || `Room ${booking.roomId}`} />
          <Row label="Room Type"   value={roomType  || "—"} />
          <Row label="Check-in"    value={fmtDate(booking.checkInDate)} />
          <Row label="Check-out"   value={fmtDate(booking.checkOutDate)} />
          <Row label="Duration"    value={`${n} night${n !== 1 ? "s" : ""}`} />
          <Row label="Guests"      value={`${booking.numberOfGuest} guest${booking.numberOfGuest !== 1 ? "s" : ""}`} />
          <Row label="Total Price" value={`Rs. ${Number(booking.totalPrice).toLocaleString()}`} />
          {booking.specialRequest && (
            <div style={{ padding: "12px 0" }}>
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginBottom: 6 }}>Special Request</div>
              <div style={{ fontSize: 13, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", lineHeight: 1.6 }}>
                {booking.specialRequest}
              </div>
            </div>
          )}
        </div>

        {}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose}
            style={{ padding: "9px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingList() {
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [fStatus,    setFStatus]    = useState("");
  const [fDate,      setFDate]      = useState("");
  const [page,       setPage]       = useState(1);
  const [toast,      setToast]      = useState("");
  const [userNames,  setUserNames]  = useState({});
  const [roomNames,  setRoomNames]  = useState({});
  const [roomTypes,  setRoomTypes]  = useState({});
  const [viewModal,  setViewModal]  = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchBookings = useCallback(async (isRefresh = false) => {
    setError(null);
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res  = await api.get(`${BASE_URL}/api/admin/bookings`);
      const data = res.data || [];
      setBookings(data);

      const uids = [...new Set(data.map(b => b.userId))];
      const rids = [...new Set(data.map(b => b.roomId))];

      const uNames = {};
      await Promise.all(uids.map(async uid => {
        try {
          const r = await api.get(`${BASE_URL}/api/admin/users/${uid}`);
          const u = r.data;
          uNames[uid] = `${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`.trim() || `User ${uid}`;
        } catch { uNames[uid] = `User ${uid}`; }
      }));
      setUserNames(uNames);

      const rNames = {}; const rTyps = {};
      await Promise.all(rids.map(async rid => {
        try {
          const r  = await api.get(`${BASE_URL}/api/admin/rooms/${rid}`);
          rNames[rid] = r.data.roomName || `Room ${rid}`;
          rTyps[rid]  = r.data.roomType?.roomTypeName || "";
        } catch { rNames[rid] = `Room ${rid}`; rTyps[rid] = ""; }
      }));
      setRoomNames(rNames); setRoomTypes(rTyps);

    } catch { setError("Failed to load bookings. Make sure the backend is running."); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b =>
      b.bookingId === bookingId ? { ...b, bookingStatus: newStatus } : b
    ));
    setViewModal(prev => prev?.bookingId === bookingId ? { ...prev, bookingStatus: newStatus } : prev);
    showToast(`Booking ${bookingId} updated to ${newStatus}`);
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    if (q && !(userNames[b.userId] || "").toLowerCase().includes(q) &&
             !(roomNames[b.roomId] || "").toLowerCase().includes(q) &&
             !String(b.bookingId).includes(q)) return false;
    if (fStatus && b.bookingStatus !== fStatus) return false;
    if (fDate   && b.checkInDate   !== fDate)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const clearFilters = () => { setSearch(""); setFStatus(""); setFDate(""); setPage(1); };

  const total     = bookings.length;
  const confirmed = bookings.filter(b => b.bookingStatus === "CONFIRMED").length;
  const pending   = bookings.filter(b => b.bookingStatus === "PENDING").length;
  const cancelled = bookings.filter(b => b.bookingStatus === "CANCELLED").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .bk-row:hover td { background: #FFFBEB !important; transition: background 0.12s; }
        .fil-input { font-size: 13px; padding: 6px 10px; border: 1.5px solid #E5E7EB; border-radius: 8px; background: #FAFAFA; color: #111827; height: 36px; font-family: inherit; outline: none; transition: border-color 0.15s, background 0.15s; }
        .fil-input:focus { border-color: #C9A84C !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
        .btn-outline { font-size: 13px; padding: 6px 16px; border: 1.5px solid #E5E7EB; border-radius: 8px; background: #fff; color: #374151; cursor: pointer; height: 36px; font-family: inherit; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.12s; white-space: nowrap; }
        .btn-outline:hover { background: #F3F4F6; border-color: #D1D5DB; }
        .btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }
        .action-btn { font-size: 12px; padding: 4px 12px; border: 1.5px solid #E5E7EB; border-radius: 6px; background: transparent; color: #374151; cursor: pointer; margin-right: 4px; font-family: inherit; font-weight: 500; transition: all 0.12s; white-space: nowrap; }
        .action-btn:hover { background: #F3F4F6; border-color: #C9A84C; color: #111827; }
        .pg-btn { min-width: 28px; height: 28px; font-size: 12px; border: 1.5px solid #E5E7EB; border-radius: 6px; background: #fff; color: #6B7280; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; transition: all 0.12s; }
        .pg-btn:hover:not(.pg-active):not(:disabled) { background: #F3F4F6; }
        .pg-active { background: #111827 !important; color: #fff !important; border-color: #111827 !important; }
        .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.25s ease; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        ::placeholder { color: #C4C9D4; }
      `}</style>

      {}
      {viewModal && (
        <ViewModal
          booking={viewModal}
          userName={userNames[viewModal.userId]}
          roomName={roomNames[viewModal.roomId]}
          roomType={roomTypes[viewModal.roomId]}
          onClose={() => setViewModal(null)}
        />
      )}

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

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
              {}
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

          <div style={{ padding: "28px 32px", flex: 1 }}>

            {}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>All Bookings</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>View and manage all hotel room bookings.</p>
            </div>

            {}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Bookings", value: total,     color: "#111827", border: "#C9A84C" },
                { label: "Confirmed",      value: confirmed, color: "#065F46", border: "#10B981" },
                { label: "Pending",        value: pending,   color: "#92400E", border: "#F59E0B" },
                { label: "Cancelled",      value: cancelled, color: "#991B1B", border: "#EF4444" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              {}
              <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Booking Records</span>
                <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10, marginLeft: 4 }}>{total}</span>
              </div>

              {}
              <div style={{ padding: "16px 28px", borderBottom: "1px solid #F9FAFB", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input className="fil-input" style={{ paddingLeft: 32, width: "100%" }}
                    placeholder="Search guest name or booking ID..."
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>

                <select className="fil-input" style={{ minWidth: 140 }} value={fStatus}
                  onChange={e => { setFStatus(e.target.value); setPage(1); }}>
                  <option value="">All statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <input className="fil-input" type="date" style={{ width: 160 }}
                  value={fDate} onChange={e => { setFDate(e.target.value); setPage(1); }} />

                <button className="btn-outline" onClick={clearFilters}>Clear</button>

                <button className="btn-outline" onClick={() => fetchBookings(true)} disabled={refreshing}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}>
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {}
              {loading ? (
                <div style={{ padding: 56, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading bookings...</div>
              ) : error ? (
                <div style={{ padding: 56, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{error}</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No bookings found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>
                    {search || fStatus || fDate ? "Try clearing the filters." : "No bookings yet."}
                  </div>
                  {(search || fStatus || fDate) && (
                    <button className="btn-outline" onClick={clearFilters}>Clear Filters</button>
                  )}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed", minWidth: 950 }}>
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                        {[
                          ["Booking ID","90px"],["Guest Name","150px"],["Room","130px"],
                          ["Type","140px"],["Check-in","105px"],["Check-out","105px"],
                          ["Nights","70px"],["Total","100px"],["Status","120px"],["Actions","100px"],
                        ].map(([h, w]) => (
                          <th key={h} style={{ width: w, textAlign: "left", padding: "11px 16px", color: "#9CA3AF", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {slice.map((b, i) => {
                        const n = nights(b.checkInDate, b.checkOutDate);
                        return (
                          <tr key={b.bookingId} className="bk-row"
                            style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F9FAFB" }}>

                            {}
                            <td style={{ padding: "14px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <span style={{ fontWeight: 700, color: "#C9A84C", fontSize: 13 }}>{b.bookingId}</span>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <div style={{ fontWeight: 600, color: "#111827" }}>{userNames[b.userId] || `User ${b.userId}`}</div>
                              <div style={{ fontSize: 11, color: "#9CA3AF" }}>User ID: {b.userId}</div>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <div style={{ fontWeight: 600, color: "#111827" }}>{roomNames[b.roomId] || `Room ${b.roomId}`}</div>
                              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Room ID: {b.roomId}</div>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <span style={{ fontSize: 12, color: "#6B7280" }}>{roomTypes[b.roomId] || "—"}</span>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap", color: "#374151" }}>
                              {fmtDate(b.checkInDate)}
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap", color: "#374151" }}>
                              {fmtDate(b.checkOutDate)}
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                              <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
                                {n}n
                              </span>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                              <span style={{ fontWeight: 700, color: "#111827" }}>Rs. {Number(b.totalPrice).toLocaleString()}</span>
                            </td>

                            {}
                            <td style={{ padding: "14px 16px" }}>
                              <StatusDropdown booking={b} onStatusChange={handleStatusChange} />
                            </td>

                            {}
                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                              <button className="action-btn" onClick={() => setViewModal(b)}>View</button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {}
              {filtered.length > 0 && (
                <div style={{ padding: "14px 28px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF", marginRight: "auto" }}>
                    Showing {Math.min((safePage - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} bookings
                  </span>
                  <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`pg-btn${p === safePage ? " pg-active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>→</button>
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
