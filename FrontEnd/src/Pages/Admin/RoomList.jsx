import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";

const Icons = {
  plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  edit: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  trash: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>),
  search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  empty: () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>),
  warning: () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  noImage: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  chevron: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
};

// ✅ Status colors for AVAILABLE and MAINTENANCE only (team schema)
const STATUS_COLORS = {
  AVAILABLE:   { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Available"   },
  MAINTENANCE: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", label: "Maintenance" },
};

function RoomThumbnail({ roomId }) {
  const [src,    setSrc]    = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios.get(`${BASE_URL}/api/admin/rooms/${roomId}/images`)
      .then(res => {
        if (cancelled) return;
        const images = res.data || [];
        if (images.length === 0) { setSrc(""); return; }
        const main = images.find(img => img.isMain) || images[0];
        const url  = main.rimageUrl?.startsWith("http") ? main.rimageUrl : `${BASE_URL}${main.rimageUrl}`;
        setSrc(url);
      })
      .catch(() => { if (!cancelled) setSrc(""); });
    return () => { cancelled = true; };
  }, [roomId]);

  if (src === null) return <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F3F4F6", animation: "pulse 1.5s infinite" }} />;
  if (src === "" || failed) return (
    <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F3F4F6", border: "1.5px dashed #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", color: "#D1D5DB" }}>
      <Icons.noImage />
    </div>
  );
  return <img src={src} alt="Room" onError={() => setFailed(true)} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", border: "1.5px solid #E5E7EB", display: "block" }} />;
}

function AvailabilityDropdown({ room, onStatusChange }) {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const s   = STATUS_COLORS[room.roomStatus] || STATUS_COLORS.AVAILABLE;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = async (newStatus) => {
    if (newStatus === room.roomStatus) { setOpen(false); return; }
    setSaving(true); setOpen(false);
    try {
      await axios.patch(`${BASE_URL}/api/admin/rooms/${room.roomId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      onStatusChange(room.roomId, newStatus);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(p => !p)} disabled={saving}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "5px 10px 5px 12px", borderRadius: 20, border: `1.5px solid ${s.dot}22`, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: saving ? "#9CA3AF" : s.dot }} />
        {saving ? "Saving..." : s.label}
        <Icons.chevron />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", zIndex: 50, minWidth: 160, overflow: "hidden", animation: "slideUp 0.15s ease" }}>
          <div style={{ padding: "6px 0" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", padding: "4px 14px 8px" }}>Change Status</p>
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <button key={key} onClick={() => handleSelect(key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: key === room.roomStatus ? val.bg : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: key === room.roomStatus ? 700 : 500, color: key === room.roomStatus ? val.color : "#374151", textAlign: "left" }}
                onMouseEnter={e => { if (key !== room.roomStatus) e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { if (key !== room.roomStatus) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: val.dot }} />
                {val.label}
                {key === room.roomStatus && <span style={{ marginLeft: "auto", fontSize: 11, background: val.dot, color: "#fff", padding: "1px 7px", borderRadius: 10 }}>Current</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteModal({ room, onConfirm, onCancel, isDeleting }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideUp 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}><Icons.warning /></div>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 8 }}>Delete Room?</h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 6 }}>You are about to permanently delete:</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#EF4444", textAlign: "center", marginBottom: 20 }}>#{room.roomId} — {room.roomName}</p>
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 24, fontSize: 13, color: "#991B1B" }}>
          ⚠ This action <strong>cannot be undone.</strong> The room and all its images will be permanently removed.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} disabled={isDeleting} style={{ flex: 1, padding: "11px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} style={{ flex: 1, padding: "11px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: isDeleting ? "#FCA5A5" : "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", cursor: isDeleting ? "not-allowed" : "pointer" }}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoomList() {
  const navigate = useNavigate();
  const [rooms,        setRooms]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [toast,        setToast]        = useState("");

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/rooms`);
      setRooms(res.data || []);
    } catch {
      setError("Failed to load rooms. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(prev => prev.map(r => r.roomId === roomId ? { ...r, roomStatus: newStatus } : r));
    const label = STATUS_COLORS[newStatus]?.label || newStatus;
    showToast(`Room status updated to "${label}" ✓`);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/admin/rooms/${roomToDelete.roomId}`);
      setRooms(prev => prev.filter(r => r.roomId !== roomToDelete.roomId));
      showToast(`Room "${roomToDelete.roomName}" deleted successfully!`);
    } catch {
      alert("Failed to delete room. Please try again.");
    } finally {
      setIsDeleting(false);
      setRoomToDelete(null);
    }
  };

  // ✅ Search by roomName and roomType.roomTypeName
  const filteredRooms = rooms.filter(room =>
    room.roomName?.toLowerCase().includes(search.toLowerCase()) ||
    room.roomType?.roomTypeName?.toLowerCase().includes(search.toLowerCase())
  );

  const availableCount   = rooms.filter(r => r.roomStatus === "AVAILABLE").length;
  const maintenanceCount = rooms.filter(r => r.roomStatus === "MAINTENANCE").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .room-row:hover { background: #FFFBEB !important; }
        .room-row:hover .room-thumb img { transform: scale(1.08); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .room-thumb img { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .edit-btn:hover { background: linear-gradient(135deg,#C9A84C,#8B6914) !important; color: #fff !important; border-color: transparent !important; }
        .edit-btn { transition: all 0.18s; }
        .del-btn:hover { background: linear-gradient(135deg,#EF4444,#DC2626) !important; color: #fff !important; border-color: transparent !important; }
        .del-btn { transition: all 0.18s; }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .add-btn { transition: all 0.18s; }
        .search-input:focus { border-color: #C9A84C !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.3s ease; }
      `}</style>

      {roomToDelete && (
        <DeleteModal room={roomToDelete} onConfirm={handleDeleteConfirm}
          onCancel={() => setRoomToDelete(null)} isDeleting={isDeleting} />
      )}

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Room Management</span>
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

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Room Management</h1>
                <p style={{ fontSize: 14, color: "#6B7280" }}>View, add, update and delete hotel rooms. Click availability badge to change status instantly.</p>
              </div>
              <button className="add-btn" onClick={() => navigate("/admin/rooms/add")}
                style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
                <Icons.plus /> Add New Room
              </button>
            </div>

            {/* ✅ Stats — AVAILABLE and MAINTENANCE only */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Rooms",   value: rooms.length,    color: "#C9A84C" },
                { label: "Available",     value: availableCount,  color: "#10B981" },
                { label: "Maintenance",   value: maintenanceCount, color: "#F59E0B" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Table card */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>All Rooms</span>
                  <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{filteredRooms.length}</span>
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}><Icons.search /></span>
                  <input className="search-input"
                    style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 220, color: "#111827" }}
                    placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading rooms...</div>
              ) : error ? (
                <div style={{ padding: 48, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{error}</div>
              ) : filteredRooms.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#D1D5DB", display: "flex", justifyContent: "center", marginBottom: 16 }}><Icons.empty /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No rooms found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Add your first room using the button above.</div>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                      {["ID", "Image", "Room Name", "Type", "Price", "Capacity", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room, i) => (
                      <tr key={room.roomId} className="room-row"
                        style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>

                        {/* ✅ roomId */}
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>#{room.roomId}</td>

                        {/* Thumbnail */}
                        <td style={{ padding: "10px 20px" }}>
                          <div className="room-thumb"><RoomThumbnail roomId={room.roomId} /></div>
                        </td>

                        {/* Room Name */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{room.roomName}</div>
                          {/* ✅ Description from roomType.roomDescription */}
                          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                            {room.roomType?.roomDescription?.substring(0, 40)}
                            {room.roomType?.roomDescription?.length > 40 ? "..." : ""}
                          </div>
                        </td>

                        {/* ✅ Type from roomType.roomTypeName */}
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                            {room.roomType?.roomTypeName || "—"}
                          </span>
                        </td>

                        {/* ✅ roomPrice */}
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 600 }}>
                          Rs. {Number(room.roomPrice || 0).toLocaleString()}
                        </td>

                        {/* ✅ Capacity from roomType.capacity */}
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                          {room.roomType?.capacity || "—"} guests
                        </td>

                        {/* ✅ Status dropdown — AVAILABLE and MAINTENANCE */}
                        <td style={{ padding: "14px 20px" }}>
                          <AvailabilityDropdown room={room} onStatusChange={handleStatusChange} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="edit-btn" onClick={() => navigate(`/admin/rooms/edit/${room.roomId}`)}
                              style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                              <Icons.edit /> Edit
                            </button>
                            <button className="del-btn" onClick={() => setRoomToDelete(room)}
                              style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #FECACA", background: "#FFF5F5", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                              <Icons.trash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
