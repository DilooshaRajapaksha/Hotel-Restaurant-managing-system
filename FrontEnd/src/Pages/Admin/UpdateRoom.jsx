import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import api from "../../Utils/axiosInstance";

const BASE_URL = "http://localhost:8080";

const FALLBACK_ROOM_TYPES = [
  { roomTypeName: "Two-Bedroom Villa",                capacity: 4 },
  { roomTypeName: "Budget Twin Room",                 capacity: 2 },
  { roomTypeName: "Double Room with Balcony",         capacity: 2 },
  { roomTypeName: "Triple Room with Balcony",         capacity: 3 },
  { roomTypeName: "Double Room with Private Bathroom",capacity: 2 },
  { roomTypeName: "Triple Room with Bathroom",        capacity: 3 },
  { roomTypeName: "Family Room",                      capacity: 4 },
];

const FACILITY_CATEGORIES = [
  { category: "General",      icon: "🏨", items: ["WiFi", "Free WiFi", "Air Conditioning", "TV", "Room Service", "Daily Housekeeping", "Ironing Service"] },
  { category: "Room Features",icon: "🛏️", items: ["Mini Bar", "Balcony", "Private Bathroom", "Shower", "Tea/Coffee Maker", "Socket Near the Bed", "Clothes Rack", "Electric Kettle"] },
  { category: "Views & Outdoors",icon:"🌿",items: ["Sea View", "Garden View", "Outdoor Furniture", "Garden", "Parking", "Free Parking"] },
  { category: "Family & Entertainment",icon:"👨‍👩‍👧",items: ["Family Rooms", "Board Games / Puzzles", "Breakfast Included", "Washing Machine", "Kitchen"] },
  { category: "Activities & Tours",icon:"🚴",items: ["Bicycle Rental", "Cooking Class", "Walking Tours", "Bike Tours", "Tour Desk", "Happy Hour", "Local Culture Class"] },
  { category: "Laundry",      icon: "👕", items: ["Laundry Service", "Washing Machine"] },
];

const Icons = {
  xIcon: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  save: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  arrowLeft: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  upload: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>),
  image: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  users: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  check: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
};

function AddTypeModal({ onSave, onClose }) {
  const [newType, setNewType] = useState({ name: "", description: "", capacity: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const handleSave = async () => {
    if (!newType.name.trim())  { setError("Type name is required."); return; }
    if (!newType.capacity)     { setError("Capacity is required."); return; }
    if (isNaN(newType.capacity) || Number(newType.capacity) < 1) { setError("Capacity must be at least 1."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("roomTypeName",    newType.name.trim());
      fd.append("roomDescription", newType.description.trim() || newType.name.trim());
      fd.append("capacity",        newType.capacity);
      const res = await api.post(`${BASE_URL}/api/admin/rooms/types`, fd);
      onSave(res.data);
    } catch { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  const minp = { padding: "9px 12px", borderRadius: 8, fontSize: 13, width: "100%", border: "1.5px solid #E5E7EB", background: "#FAFAFA", color: "#111827", fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 2 }}>Add New Room Type</h3>
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>Saved to ROOM_TYPES table in database</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "#6B7280" }}><Icons.xIcon /></button>
        </div>
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#991B1B", fontSize: 13 }}>⚠ {error}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Type Name <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={minp} placeholder="e.g. Penthouse Suite" value={newType.name} onChange={e => { setNewType(p => ({...p, name: e.target.value})); setError(""); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Max Capacity (guests) <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={minp} type="number" min="1" max="20" placeholder="e.g. 4" value={newType.capacity} onChange={e => { setNewType(p => ({...p, capacity: e.target.value})); setError(""); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Description <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
            <textarea style={{ ...minp, resize: "vertical", minHeight: 72 }} placeholder="e.g. Luxury penthouse with rooftop terrace" value={newType.description} onChange={e => setNewType(p => ({...p, description: e.target.value}))} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: saving ? "#9CA3AF" : "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {saving ? "Saving..." : "Save Type"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FacilityCheckbox({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", padding: "4px 0" }}>
      <div onClick={onChange} style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? "#C9A84C" : "#D1D5DB"}`, background: checked ? "#C9A84C" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", cursor: "pointer" }}>
        {checked && <span style={{ color: "#fff" }}><Icons.check /></span>}
      </div>
      <span style={{ fontSize: 13, color: checked ? "#92400E" : "#374151", fontWeight: checked ? 600 : 400, transition: "all 0.15s" }}>{label}</span>
    </label>
  );
}

export default function UpdateRoom() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [roomTypes,     setRoomTypes]     = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [form, setForm] = useState({ roomName: "", description: "", roomTypeName: "", roomPrice: "", roomStatus: "AVAILABLE" });
  const [autoCapacity,   setAutoCapacity]   = useState(null);
  const [facilities,     setFacilities]     = useState({});
  const [errors,         setErrors]         = useState({});
  const [images,         setImages]         = useState([]);
  const [imagePreviews,  setImagePreviews]  = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitStatus,   setSubmitStatus]   = useState(null);
  const [isLoading,      setIsLoading]      = useState(false);
  const [isFetching,     setIsFetching]     = useState(true);
  const [fetchError,     setFetchError]     = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        let resolved = FALLBACK_ROOM_TYPES;
        try {
          const tr = await api.get(`${BASE_URL}/api/admin/rooms/types`);
          if (tr.data && tr.data.length > 0) {
            const seen = new Set();
            resolved = tr.data.filter(t => { if (seen.has(t.roomTypeName)) return false; seen.add(t.roomTypeName); return true; });
          }
        } catch {}
        setRoomTypes(resolved);

        const rr = await api.get(`${BASE_URL}/api/admin/rooms/${id}`);
        const room = rr.data;
        const typeName = room.roomType?.roomTypeName || "";
        setForm({ roomName: room.roomName || "", description: room.description || "", roomTypeName: typeName, roomPrice: room.roomPrice || "", roomStatus: room.roomStatus || "AVAILABLE" });
        const found = resolved.find(t => t.roomTypeName === typeName);
        if (found) setAutoCapacity(found.capacity);

        try {
          const ir = await api.get(`${BASE_URL}/api/admin/rooms/${id}/images`);
          setExistingImages(ir.data || []);
        } catch { setExistingImages([]); }

      } catch { setFetchError(`Room with ID ${id} not found.`); }
      finally  { setIsFetching(false); }
    };
    loadAll();
  }, [id]);

  const handleNewTypeSaved = (saved) => {
    setRoomTypes(prev => { const ex = prev.find(t => t.roomTypeName === saved.roomTypeName); return ex ? prev : [...prev, saved]; });
    setForm(prev => ({ ...prev, roomTypeName: saved.roomTypeName }));
    setAutoCapacity(saved.capacity);
    setShowTypeModal(false);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    if (val === "__ADD_NEW__") { setShowTypeModal(true); return; }
    setForm(prev => ({ ...prev, roomTypeName: val }));
    if (errors.roomTypeName) setErrors(prev => ({ ...prev, roomTypeName: "" }));
    if (!val) { setAutoCapacity(null); return; }
    const found = roomTypes.find(t => t.roomTypeName === val);
    setAutoCapacity(found ? found.capacity : null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleFacility = (item) => setFacilities(prev => ({ ...prev, [item]: !prev[item] }));

  const deleteExistingImage = async (imageId) => {
    try {
      await api.delete(`${BASE_URL}/api/admin/rooms/images/${imageId}`);
      setExistingImages(prev => prev.filter(img => img.rimageId !== imageId));
    } catch { alert("Could not delete image. Please try again."); }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg","image/png","image/webp"];
    if (files.some(f => !validTypes.includes(f.type))) { setErrors(prev => ({...prev, images: "Only JPG, PNG, and WEBP images are allowed."})); return; }
    if (files.some(f => f.size > 5*1024*1024)) { setErrors(prev => ({...prev, images: "Each image must be under 5MB."})); return; }
    setErrors(prev => ({...prev, images: ""}));
    setImages(files); setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeNewImage = (i) => { setImages(prev => prev.filter((_,j) => j !== i)); setImagePreviews(prev => prev.filter((_,j) => j !== i)); };

  const validate = () => {
    const e = {};
    if (!form.roomName.trim())  e.roomName     = "Room name is required.";
    if (!form.roomTypeName)     e.roomTypeName = "Please select a room type.";
    if (!form.roomPrice)        e.roomPrice    = "Room price is required.";
    else if (isNaN(form.roomPrice) || Number(form.roomPrice) < 0) e.roomPrice = "Price must be a valid positive number.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); setSubmitStatus("error"); window.scrollTo({top:0,behavior:"smooth"}); return; }
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("roomName",     form.roomName);
      fd.append("roomTypeName", form.roomTypeName);
      fd.append("roomPrice",    form.roomPrice);
      fd.append("roomStatus",   form.roomStatus);
      images.forEach(img => fd.append("images", img));
      await api.put(`${BASE_URL}/api/admin/rooms/${id}`, fd);
      setSubmitStatus("success");
      setTimeout(() => navigate("/admin/rooms"), 2000);
    } catch (err) {
      setSubmitStatus("error");
      setErrors({ general: err.response?.data || "Failed to update room. Please try again." });
    } finally { setIsLoading(false); }
  };

  const inp = (hasError, extra = {}) => ({
    padding: "10px 14px", borderRadius: 8, fontSize: 14, width: "100%",
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`,
    background: hasError ? "#FFF5F5" : "#FAFAFA",
    color: "#111827", fontFamily: "inherit", outline: "none",
    transition: "border-color 0.15s, background 0.15s", ...extra,
  });

  const selectedCount = Object.values(facilities).filter(Boolean).length;

  if (isFetching) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#9CA3AF", fontSize: 15, fontWeight: 600 }}>Loading room #{id}...</div>
      </div>
    </div>
  );

  if (fetchError) return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Room Not Found</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>{fetchError}</div>
          <button onClick={() => navigate("/admin/rooms")} style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer" }}>Back to Room List</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .fi:focus { border-color: #C9A84C !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
        .fi { transition: border-color 0.18s, background 0.18s; }
        .uz:hover { border-color: #C9A84C !important; background: #FFFBEB !important; }
        .br:hover { background: #F3F4F6 !important; border-color: #C9A84C !important; }
        .bs:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .bs { transition: all 0.18s; } .bs:disabled { opacity: 0.7; cursor: not-allowed; }
        .bk { color:#6B7280; font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer; transition:color 0.15s; background:none; border:none; font-family:inherit; padding:0; }
        .bk:hover { color: #C9A84C; }
        .del-img:hover { background: #DC2626 !important; transform: scale(1.1); }
        .del-img { transition: all 0.15s; }
        input[type="file"] { display: none; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.3s ease; }
        ::placeholder { color: #C4C9D4; }
      `}</style>

      {showTypeModal && <AddTypeModal onSave={handleNewTypeSaved} onClose={() => setShowTypeModal(false)} />}

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span><span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#9CA3AF", cursor: "pointer" }} onClick={() => navigate("/admin/rooms")}>Room Management</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Update Room #{id}</span>
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
            <div style={{ marginBottom: 24 }}>
              <button className="bk" onClick={() => navigate("/admin/rooms")} style={{ marginBottom: 12 }}><Icons.arrowLeft /> Back to Room Management</button>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Update Room</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Editing Room ID: <strong style={{ color: "#C9A84C" }}>#{id}</strong> — {form.roomName}</p>
            </div>

            {submitStatus === "error" && Object.keys(errors).length > 0 && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#991B1B", fontSize: 14, fontWeight: 500 }}>
                {errors.general || "⚠ Please fix the highlighted fields before saving."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

                {}
                <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Edit Room Details</span>
                  <span style={{ marginLeft: "auto", background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>EDITING #{id}</span>
                </div>

                <div style={{ padding: "28px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 }}>Basic Information</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }}>

                    {}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Name <span style={{ color: "#EF4444" }}>*</span></label>
                      <input className="fi" style={inp(!!errors.roomName)} type="text" name="roomName" value={form.roomName} onChange={handleChange} />
                      {errors.roomName && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.roomName}</span>}
                    </div>

                    {}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Room Type <span style={{ color: "#EF4444" }}>*</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>(capacity auto-fills)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <select className="fi" style={{ ...inp(!!errors.roomTypeName), appearance: "none", cursor: "pointer", paddingRight: 36 }}
                          value={form.roomTypeName} onChange={handleTypeChange}>
                          <option value="">— Select room type —</option>
                          {roomTypes.map((t, i) => (
                            <option key={`${t.roomTypeName}-${i}`} value={t.roomTypeName}>{t.roomTypeName}</option>
                          ))}
                          <option value="__ADD_NEW__">✦ Add New Room Type...</option>
                        </select>
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none", fontSize: 12 }}>▼</span>
                      </div>
                      {errors.roomTypeName && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.roomTypeName}</span>}
                    </div>

                    {}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Price (Rs.) <span style={{ color: "#EF4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13, fontWeight: 600, pointerEvents: "none" }}>Rs.</span>
                        <input className="fi" style={inp(!!errors.roomPrice, { paddingLeft: 46 })} type="number" name="roomPrice" value={form.roomPrice} onChange={handleChange} min="0" step="0.01" />
                      </div>
                      {errors.roomPrice && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.roomPrice}</span>}
                    </div>

                    {}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Capacity <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>(auto-filled from room type)</span>
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, fontSize: 14, border: `1.5px solid ${autoCapacity ? "#C9A84C" : "#E5E7EB"}`, background: autoCapacity ? "#FFFBEB" : "#F9FAFB", color: autoCapacity ? "#92400E" : "#9CA3AF", fontWeight: autoCapacity ? 700 : 400, minHeight: 44, transition: "all 0.2s" }}>
                        <Icons.users />
                        {autoCapacity ? `${autoCapacity} guest${autoCapacity > 1 ? "s" : ""}` : "Select room type first..."}
                      </div>
                    </div>

                  </div>

                  {}
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Room Description
                      <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>(optional)</span>
                    </label>
                    <textarea className="fi"
                      style={{ ...inp(false), resize: "vertical", minHeight: 90, lineHeight: 1.6, padding: "10px 14px" }}
                      name="description"
                      placeholder="e.g. Room size 28 m², The spacious double room features air conditioning, a flat-screen TV..."
                      value={form.description} onChange={handleChange} />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>ℹ Saved once Diloosha adds the description column to ROOM table during merge.</span>
                  </div>
                </div>

                <div style={{ height: 1, background: "#F3F4F6", margin: "0 28px" }} />

                {}
                <div style={{ padding: "24px 28px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Room Status</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[
                      { value: "AVAILABLE",   label: "Available",   dot: "#10B981", bg: "#D1FAE5", color: "#065F46" },
                      { value: "MAINTENANCE", label: "Maintenance", dot: "#F59E0B", bg: "#FEF3C7", color: "#92400E" },
                    ].map(({ value, label, dot, bg, color }) => {
                      const sel = form.roomStatus === value;
                      return (
                        <label key={value} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${sel ? dot : "#E5E7EB"}`, background: sel ? bg : "#FAFAFA", color: sel ? color : "#4B5563", fontWeight: sel ? 700 : 400, fontSize: 13, userSelect: "none", transition: "all 0.15s" }}>
                          <input type="radio" name="roomStatus" value={value} checked={sel} onChange={handleChange} style={{ display: "none" }} />
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: sel ? dot : "#D1D5DB" }} />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ height: 1, background: "#F3F4F6", margin: "0 28px" }} />

                {}
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase" }}>Facilities & Amenities</p>
                    {selectedCount > 0 && (
                      <span style={{ background: "#C9A84C", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{selectedCount} selected</span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {FACILITY_CATEGORIES.map(cat => (
                      <div key={cat.category}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 16 }}>{cat.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{cat.category}</span>
                          <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "4px 24px" }}>
                          {cat.items.map(item => (
                            <FacilityCheckbox key={item} label={item} checked={!!facilities[item]} onChange={() => toggleFacility(item)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedCount > 0 && (
                    <div style={{ marginTop: 20, padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>Selected Facilities:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {Object.entries(facilities).filter(([,v]) => v).map(([k]) => (
                          <span key={k} style={{ background: "#FEF3C7", color: "#92400E", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                            {k} <span onClick={() => toggleFacility(k)} style={{ cursor: "pointer", opacity: 0.6, fontSize: 11 }}>✕</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ height: 1, background: "#F3F4F6", margin: "0 28px" }} />

                {}
                <div style={{ padding: "24px 28px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Room Images</p>

                  {existingImages.length > 0 ? (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <Icons.image />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Current Images</span>
                        <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>{existingImages.length} photo{existingImages.length > 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {existingImages.map(img => {
                          const src = img.rimageUrl?.startsWith("http") ? img.rimageUrl : `${BASE_URL}${img.rimageUrl}`;
                          return (
                            <div key={img.rimageId} style={{ position: "relative", width: 90, height: 90 }}>
                              <img src={src} alt="Room" onError={e => { e.target.style.background = "#F3F4F6"; }} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "2px solid #E5E7EB" }} />
                              {img.isMain && <span style={{ position: "absolute", bottom: 4, left: 4, background: "#C9A84C", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4 }}>MAIN</span>}
                              <button type="button" className="del-img" onClick={() => deleteExistingImage(img.rimageId)}
                                style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", padding: 0 }}>
                                <Icons.xIcon />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Click ✕ to permanently delete an image.</p>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 20, padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 13, color: "#92400E" }}>
                      ⚠ No images yet for this room. Add some below!
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 600 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Add New Images <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>(optional)</span></label>
                    <label htmlFor="roomImagesUpdate">
                      <div className="uz" style={{ border: "2px dashed #D1D5DB", borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer", transition: "all 0.18s" }}>
                        <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 10 }}><Icons.upload /></div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Click to upload new photos</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP · Max 5MB each</div>
                      </div>
                    </label>
                    <input id="roomImagesUpdate" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    {errors.images && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.images}</span>}
                    {imagePreviews.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                        {imagePreviews.map((src, i) => (
                          <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                            <img src={src} alt={`new ${i+1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #C9A84C" }} />
                            <button type="button" onClick={() => removeNewImage(i)} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", padding: 0 }}><Icons.xIcon /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "18px 28px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <button type="button" className="br" onClick={() => navigate("/admin/rooms")}
                    style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <button type="submit" className="bs" disabled={isLoading}
                    style={{ padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)", fontFamily: "inherit" }}>
                    <Icons.save />{isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {submitStatus === "success" && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ Room updated successfully! Redirecting...
        </div>
      )}
    </>
  );
}
