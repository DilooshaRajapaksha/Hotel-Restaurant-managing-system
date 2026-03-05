import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Family Room", "Executive", "Penthouse"];
const AMENITIES_LIST = [
  "Air Conditioning", "Free WiFi", "Flat Screen TV", "Mini Bar",
  "Room Service", "Balcony", "Sea View", "Garden View",
  "Jacuzzi", "King Size Bed", "Safe Box", "Hair Dryer",
];

const Icons = {
  bell: () => (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  upload: () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>),
  globe: () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>),
  check: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  xIcon: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  arrowLeft: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
};

export default function AddRoom() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ roomName: "", roomType: "", pricePerNight: "", description: "", capacity: "", amenities: [], availability: "available" });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [media360, setMedia360] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({ ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity] }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (files.some(f => !validTypes.includes(f.type))) { setErrors(prev => ({ ...prev, images: "Only JPG, PNG, and WEBP images are allowed." })); return; }
    if (files.some(f => f.size > 5 * 1024 * 1024)) { setErrors(prev => ({ ...prev, images: "Each image must be under 5MB." })); return; }
    setErrors(prev => ({ ...prev, images: "" }));
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handle360Upload = (e) => { const file = e.target.files[0]; if (file) setMedia360(file.name); };
  const removeImage = (index) => { setImages(prev => prev.filter((_, i) => i !== index)); setImagePreviews(prev => prev.filter((_, i) => i !== index)); };

  const validate = () => {
    const e = {};
    if (!form.roomName.trim()) e.roomName = "Room name is required.";
    if (!form.roomType) e.roomType = "Please select a room type.";
    if (!form.pricePerNight) e.pricePerNight = "Price per night is required.";
    else if (isNaN(form.pricePerNight) || Number(form.pricePerNight) <= 0) e.pricePerNight = "Price must be a valid positive number.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.capacity) e.capacity = "Room capacity is required.";
    else if (isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = "Capacity must be at least 1.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); setSubmitStatus("error"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomName",      form.roomName);
      formData.append("roomType",      form.roomType);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("description",   form.description);
      formData.append("capacity",      form.capacity);
      formData.append("amenities",     form.amenities.join(","));
      formData.append("availability",  form.availability);
      images.forEach(img => formData.append("images", img));

      await axios.post("http://localhost:8081/api/admin/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      setTimeout(() => { handleReset(); }, 2500);

    } catch (error) {
      console.error("Error saving room:", error);
      setSubmitStatus("error");
      setErrors({ general: "Failed to save room. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ roomName: "", roomType: "", pricePerNight: "", description: "", capacity: "", amenities: [], availability: "available" });
    setImages([]); setImagePreviews([]); setMedia360(null); setErrors({}); setSubmitStatus(null); setIsLoading(false);
  };

  const inp = (hasError, extra = {}) => ({ padding: "10px 14px", borderRadius: 8, fontSize: 14, width: "100%", border: `1.5px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`, background: hasError ? "#FFF5F5" : "#FAFAFA", color: "#111827", fontFamily: "inherit", ...extra });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .fi:focus { border-color: #C9A84C !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }
        .fi { transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
        .ac:hover { border-color: #C9A84C !important; }
        .uz:hover { border-color: #C9A84C !important; background: #FFFBEB !important; }
        .br:hover { background: #F3F4F6 !important; border-color: #C9A84C !important; }
        .bs:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .bs { transition: all 0.18s; } .bs:disabled { opacity: 0.7; cursor: not-allowed; }
        .bk { color:#6B7280; font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer; transition:color 0.15s; background:none; border:none; font-family:inherit; padding:0; }
        .bk:hover { color: #C9A84C; }
        input[type="file"] { display: none; } ::placeholder { color: #C4C9D4; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.3s ease; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%", overflow: "auto" }}>

                    {/* Topbar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ color: "#9CA3AF" }}>Admin</span>
                <span style={{ color: "#D1D5DB" }}>›</span>
                <span style={{ color: "#9CA3AF" }}>Room Management</span>
                <span style={{ color: "#D1D5DB" }}>›</span>
                <span style={{ color: "#111827", fontWeight: 600 }}>Add New Room</span>
            </div>

            {/* Right side — Bell + Admin profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

                <button style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", flexShrink: 0, padding: 0, lineHeight: 1 }}>
  🔔              </button>

                {/* Divider */}
                <div style={{ width: 1, height: 32, background: "#E5E7EB" }} />

                {/* Admin profile */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "6px 10px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>Admin</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.2 }}>administrator@goldenstar.lk</div>
                </div>
                {/* Dropdown arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
                </div>

            </div>
            </div>

          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ marginBottom: 24 }}>
              <button className="bk" onClick={() => navigate("/admin/rooms")} style={{ marginBottom: 12 }}><Icons.arrowLeft /> Back to Room Management</button>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Add New Room</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Fill in the details below to add a new room to the hotel inventory.</p>
            </div>

            {submitStatus === "error" && Object.keys(errors).length > 0 && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#991B1B", fontSize: 14, fontWeight: 500 }}>
                <Icons.xIcon /> Please fix the highlighted fields before saving.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

                <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Room Details</span>
                </div>

                <div style={{ padding: "28px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Basic Information</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Name <span style={{ color: "#EF4444" }}>*</span></label>
                      <input className="fi" style={inp(!!errors.roomName)} type="text" name="roomName" placeholder="e.g. Deluxe Suite 101" value={form.roomName} onChange={handleChange} />
                      {errors.roomName && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.roomName}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Type <span style={{ color: "#EF4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <select className="fi" style={{ ...inp(!!errors.roomType), appearance: "none", cursor: "pointer" }} name="roomType" value={form.roomType} onChange={handleChange}>
                          <option value="">Select room type...</option>
                          {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 11, pointerEvents: "none" }}>▼</span>
                      </div>
                      {errors.roomType && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.roomType}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Price Per Night (Rs.) <span style={{ color: "#EF4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 13, fontWeight: 600 }}>Rs.</span>
                        <input className="fi" style={inp(!!errors.pricePerNight, { paddingLeft: 44 })} type="number" name="pricePerNight" placeholder="e.g. 7500" value={form.pricePerNight} onChange={handleChange} min="0" />
                      </div>
                      {errors.pricePerNight && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.pricePerNight}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Capacity <span style={{ color: "#EF4444" }}>*</span></label>
                      <input className="fi" style={inp(!!errors.capacity)} type="number" name="capacity" placeholder="e.g. 2" value={form.capacity} onChange={handleChange} min="1" />
                      {errors.capacity && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.capacity}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Description <span style={{ color: "#EF4444" }}>*</span></label>
                      <textarea className="fi" style={{ ...inp(!!errors.description), minHeight: 100, resize: "vertical" }} name="description" placeholder="Describe the room — views, special features, atmosphere..." value={form.description} onChange={handleChange} />
                      {errors.description && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.description}</span>}
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Amenities</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {AMENITIES_LIST.map(amenity => {
                      const sel = form.amenities.includes(amenity);
                      return (
                        <div key={amenity} className="ac" onClick={() => toggleAmenity(amenity)}
                          style={{ padding: "9px 12px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${sel ? "#C9A84C" : "#E5E7EB"}`, background: sel ? "#FFFBEB" : "#FAFAFA", color: sel ? "#92400E" : "#4B5563", fontWeight: sel ? 600 : 400, cursor: "pointer", userSelect: "none", transition: "all 0.15s" }}>
                          <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: sel ? "#C9A84C" : "transparent", border: `1.5px solid ${sel ? "#C9A84C" : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                            {sel && <Icons.check />}
                          </div>
                          {amenity}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Availability Status</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[{ value: "available", label: "Available" }, { value: "unavailable", label: "Unavailable" }, { value: "maintenance", label: "Under Maintenance" }].map(({ value, label }) => {
                      const sel = form.availability === value;
                      return (
                        <label key={value} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 8, cursor: "pointer", border: `1.5px solid ${sel ? "#C9A84C" : "#E5E7EB"}`, background: sel ? "#FFFBEB" : "#FAFAFA", color: sel ? "#92400E" : "#4B5563", fontWeight: sel ? 600 : 400, fontSize: 13, userSelect: "none" }}>
                          <input type="radio" name="availability" value={value} checked={sel} onChange={handleChange} style={{ display: "none" }} />
                          <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `2px solid ${sel ? "#C9A84C" : "#D1D5DB"}`, background: sel ? "#C9A84C" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {sel && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                          </div>
                          {label}
                        </label>
                      );
                    })}
                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Room Images & Media</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Images <span style={{ color: "#EF4444" }}>*</span></label>
                      <label htmlFor="roomImages">
                        <div className="uz" style={{ border: `2px dashed ${errors.images ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 8 }}><Icons.upload /></div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Click to upload photos</div>
                          <div style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP · Max 5MB each</div>
                        </div>
                      </label>
                      <input id="roomImages" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                      {errors.images && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.images}</span>}
                      {imagePreviews.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                          {imagePreviews.map((src, i) => (
                            <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                              <img src={src} alt={`preview ${i+1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }} />
                              <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", padding: 0 }}>
                                <Icons.xIcon />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>360° / 3D Media <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></label>
                      <label htmlFor="media360">
                        <div className="uz" style={{ border: "2px dashed #D1D5DB", borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 8 }}><Icons.globe /></div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Upload 360° tour</div>
                          <div style={{ fontSize: 12, color: "#9CA3AF" }}>MP4, equirectangular JPG · Max 50MB</div>
                        </div>
                      </label>
                      <input id="media360" type="file" accept="video/*,image/*" onChange={handle360Upload} />
                      {media360 && <div style={{ padding: "8px 12px", background: "#ECFDF5", borderRadius: 8, fontSize: 13, color: "#065F46", border: "1px solid #6EE7B7" }}>✓ {media360}</div>}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "18px 28px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <button type="button" className="br" onClick={handleReset} style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>Clear Form</button>
                  <button type="submit" className="bs" disabled={isLoading} style={{ padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
                    <Icons.plus />{isLoading ? "Saving..." : "Save Room"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {submitStatus === "success" && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ Room saved successfully!
        </div>
      )}
    </>
  );
}