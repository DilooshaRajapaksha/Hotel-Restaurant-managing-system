import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const Icons = {
  plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  edit: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  bell: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  empty: () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>),
};

const STATUS_COLORS = {
  available:   { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  unavailable: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
  maintenance: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  AVAILABLE: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  MAINTENANCE: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
};

export default function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchRooms(); }, []);
  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8081/api/admin/rooms");
      setRooms(res.data);
    } catch (err) {
      setError("Failed to load rooms. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomName?.toLowerCase().includes(search.toLowerCase()) ||
    room.roomType?.toLowerCase().includes(search.toLowerCase())
  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/room-types");
      setRoomTypes(res.data);
    } catch (err) {
      console.error("Failed to load room types:", err);
    }
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.room_type_id === roomTypeId);
    return roomType ? roomType.room_type_name : 'Unknown';
  };

  const filteredRooms = rooms.filter(room =>
    room.room_name?.toLowerCase().includes(search.toLowerCase()) ||
    getRoomTypeName(room.room_type_id)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .room-row { transition: background 0.15s; }
        .room-row:hover { background: #FFFBEB !important; }
        .edit-btn:hover { background: linear-gradient(135deg,#C9A84C,#8B6914) !important; color: #fff !important; border-color: transparent !important; }
        .edit-btn { transition: all 0.18s; }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .add-btn { transition: all 0.18s; }
        .search-input:focus { border-color: #C9A84C !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }
      `}</style>

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
              <button style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", padding: 0 }}>🔔</button>
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

          {/* Content */}
          <div style={{ padding: "32px", flex: 1 }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Room Management</h1>
                <p style={{ fontSize: 14, color: "#6B7280" }}>View, add and update hotel rooms.</p>
              </div>
              <button className="add-btn" onClick={() => navigate("/admin/rooms/add")}
                style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
              <button
                className="add-btn"
                onClick={() => navigate("/admin/rooms/add")}
                style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}
              >
                <Icons.plus /> Add New Room
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Rooms", value: rooms.length, color: "#C9A84C" },
                { label: "Available", value: rooms.filter(r => r.availability === "available").length, color: "#10B981" },
                { label: "Unavailable / Maintenance", value: rooms.filter(r => r.availability !== "available").length, color: "#EF4444" },
            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Rooms", value: rooms.length, color: "#C9A84C" },
                { label: "Available", value: rooms.filter(r => r.room_status === "AVAILABLE").length, color: "#10B981" },
                { label: "Under Maintenance", value: rooms.filter(r => r.room_status === "MAINTENANCE").length, color: "#EF4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Table card */}
            {/* Search bar */}
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

                  <input
                    className="search-input"
                    style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 220, color: "#111827" }}
                    placeholder="Search rooms..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
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
                      {["ID", "Room Name", "Type", "Capacity", "Availability", "Action"].map(h => (
                      {["ID", "Room Name", "Type", "Price", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room, i) => {
                      const s = STATUS_COLORS[room.availability] || STATUS_COLORS.unavailable;
                      return (
                        <tr key={room.id} className="room-row" style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA", cursor: "default" }}>
                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>#{room.id}</td>
                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{room.roomName}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{room.description?.substring(0, 40)}{room.description?.length > 40 ? "..." : ""}</div>
                          </td>
                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>{room.roomType}</span>
                          </td>
                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#374151", fontWeight: 500 }}>{room.capacity} guests</td>
                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
                              {room.availability?.charAt(0).toUpperCase() + room.availability?.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: "14px 24px" }}>
                            <button className="edit-btn" onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                              style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      const statusStyle = STATUS_COLORS[room.room_status] || STATUS_COLORS.MAINTENANCE;
                      return (
                        <tr key={room.room_id} className="room-row" style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>#{room.room_id}</td>
                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{room.room_name}</div>
                          </td>
                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                              {getRoomTypeName(room.room_type_id)}
                            </span>
                          </td>
                          <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600, color: "#059669" }}>
                            LKR {room.room_price}
                          </td>
                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                              {room.room_status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 24px" }}>
                            <button
                              className="edit-btn"
                              onClick={() => navigate(`/admin/rooms/edit/${room.room_id}`)}
                              style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                            >
                              <Icons.edit /> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}