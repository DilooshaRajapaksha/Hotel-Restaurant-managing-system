import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSideBar";
import axios from "axios";

const Icons = {
  check: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  xIcon: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  save: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  arrowLeft: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  upload: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>),
};

export default function UpdateRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    room_name: "",
    room_type_id: "",
    room_price: "",
    room_status: "AVAILABLE",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchRoomTypes();
    fetchRoom();
  }, [id]);

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/room-types");
      setRoomTypes(res.data);
    } catch (err) {
      console.error("Failed to load room types:", err);
    }
  };

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/admin/rooms/${id}`);
      const room = res.data;
      setForm({
        room_name: room.room_name || "",
        room_type_id: room.room_type_id || "",
        room_price: room.room_price || "",
        room_status: room.room_status || "AVAILABLE",
      });

      // Fetch room images
      const imagesRes = await axios.get(`http://localhost:8081/api/admin/rooms/${id}/images`);
      setExistingImages(imagesRes.data);
    } catch (err) {
      setFetchError(`Room with ID ${id} not found. Please check the ID and try again.`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (files.some(f => !validTypes.includes(f.type))) {
      setErrors(prev => ({ ...prev, images: "Only JPG, PNG, and WEBP images are allowed." }));
      return;
    }
    if (files.some(f => f.size > 5 * 1024 * 1024)) {
      setErrors(prev => ({ ...prev, images: "Each image must be under 5MB." }));
      return;
    }
    setErrors(prev => ({ ...prev, images: "" }));
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:8081/api/admin/room-images/${imageId}`);
      setExistingImages(prev => prev.filter(img => img.Rimage_id !== imageId));
    } catch (err) {
      console.error("Failed to delete image:", err);
      setErrors({ general: "Failed to delete image. Please try again." });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.room_name.trim()) e.room_name = "Room name is required.";
    if (!form.room_type_id) e.room_type_id = "Please select a room type.";
    if (!form.room_price) e.room_price = "Room price is required.";
    else if (isNaN(form.room_price) || Number(form.room_price) < 0)
      e.room_price = "Price must be a positive number.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("room_name", form.room_name);
      formData.append("room_type_id", form.room_type_id);
      formData.append("room_price", form.room_price);
      formData.append("room_status", form.room_status);
      images.forEach(img => formData.append("images", img));

      await axios.put(`http://localhost:8081/api/admin/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      setTimeout(() => navigate("/admin/rooms"), 2000);

    } catch (error) {
      console.error("Error updating room:", error);
      setSubmitStatus("error");
      setErrors({ general: "Failed to update room. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const inp = (hasError, extra = {}) => ({
    padding: "10px 14px", borderRadius: 8, fontSize: 14, width: "100%",
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`,
    background: hasError ? "#FFF5F5" : "#FAFAFA",
    color: "#111827", fontFamily: "inherit", ...extra,
  });

  if (isFetching) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#9CA3AF" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Loading room details...</div>
            <div style={{ fontSize: 13 }}>Fetching Room ID: {id}</div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Room Not Found</div>
            <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>{fetchError}</div>
            <button onClick={() => navigate("/admin/rooms")} style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer" }}>
              Back to Room List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .fi:focus { border-color: #C9A84C !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }
        .fi { transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
        .uz:hover { border-color: #C9A84C !important; background: #FFFBEB !important; }
        .br:hover { background: #F3F4F6 !important; border-color: #C9A84C !important; }
        .bs:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .bs { transition: all 0.18s; } .bs:disabled { opacity: 0.7; cursor: not-allowed; }
        .bk { color:#6B7280; font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer; transition:color 0.15s; background:none; border:none; font-family:inherit; padding:0; }
        .bk:hover { color: #C9A84C; }
        input[type="file"] { display: none; } ::placeholder { color: #C4C9D4; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.3s ease; }
        .image-container { position: relative; display: inline-block; }
        .remove-btn { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; padding: 0; }
      `}</style>

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

            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
              <button className="bk" onClick={() => navigate("/admin/rooms")} style={{ marginBottom: 12 }}>
                <Icons.arrowLeft /> Back to Room Management
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Update Room</h1>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>Editing Room ID: <strong style={{ color: "#C9A84C" }}>#{id}</strong> — {form.room_name}</p>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {submitStatus === "error" && Object.keys(errors).length > 0 && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#991B1B", fontSize: 14, fontWeight: 500 }}>
                <Icons.xIcon /> {errors.general || "Please fix the highlighted fields before saving."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

                {/* Card header */}
                <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Edit Room Details</span>
                  <span style={{ marginLeft: "auto", background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, letterSpacing: "0.5px" }}>
                    EDITING #{id}
                  </span>
                </div>

                <div style={{ padding: "28px" }}>

                  {/* Basic Information */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Basic Information</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>

                    {/* Room Name */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Name <span style={{ color: "#EF4444" }}>*</span></label>
                      <input className="fi" style={inp(!!errors.room_name)} type="text" name="room_name" placeholder="e.g. Deluxe Suite 101" value={form.room_name} onChange={handleChange} />
                      {errors.room_name && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.room_name}</span>}
                    </div>

                    {/* Room Type */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Type <span style={{ color: "#EF4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <select className="fi" style={{ ...inp(!!errors.room_type_id), appearance: "none", cursor: "pointer" }} name="room_type_id" value={form.room_type_id} onChange={handleChange}>
                          <option value="">Select room type...</option>
                          {roomTypes.map(type => (
                            <option key={type.room_type_id} value={type.room_type_id}>
                              {type.room_type_name} - {type.capacity} guests
                            </option>
                          ))}
                        </select>
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 11, pointerEvents: "none" }}>▼</span>
                      </div>
                      {errors.room_type_id && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.room_type_id}</span>}
                    </div>

                    {/* Room Price */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Price (LKR) <span style={{ color: "#EF4444" }}>*</span></label>
                      <input className="fi" style={inp(!!errors.room_price)} type="number" name="room_price" placeholder="e.g. 15000" value={form.room_price} onChange={handleChange} min="0" step="0.01" />
                      {errors.room_price && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.room_price}</span>}
                    </div>

                    {/* Room Status */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Room Status</label>
                      <div style={{ position: "relative" }}>
                        <select className="fi" style={{ ...inp(false), appearance: "none", cursor: "pointer" }} name="room_status" value={form.room_status} onChange={handleChange}>
                          <option value="AVAILABLE">Available</option>
                          <option value="MAINTENANCE">Under Maintenance</option>
                        </select>
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 11, pointerEvents: "none" }}>▼</span>
                      </div>
                    </div>

                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  {/* Room Images */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Room Images</p>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10, display: "block" }}>
                        Current Images
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {existingImages.map(img => (
                          <div key={img.Rimage_id} className="image-container">
                            <img 
                              src={`http://localhost:8081${img.Rimage_url}`} 
                              alt="Room" 
                              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }} 
                            />
                            <button 
                              type="button" 
                              className="remove-btn"
                              onClick={() => removeExistingImage(img.Rimage_id)}
                            >
                              <Icons.xIcon />
                            </button>
                            {img.is_main && (
                              <span style={{ position: "absolute", bottom: -6, left: -6, background: "#C9A84C", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 12 }}>
                                MAIN
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 500 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Add New Images <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <label htmlFor="roomImages">
                      <div className="uz" style={{ border: `2px dashed ${errors.images ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 8 }}><Icons.upload /></div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Click to upload new photos</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP · Max 5MB each</div>
                      </div>
                    </label>
                    <input id="roomImages" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    {errors.images && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.images}</span>}
                    
                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="image-container">
                            <img src={src} alt={`preview ${i+1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }} />
                            <button type="button" className="remove-btn" onClick={() => removeImage(i)}>
                              <Icons.xIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Form actions */}
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "18px 28px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <button type="button" className="br" onClick={() => navigate("/admin/rooms")}
                    style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" className="bs" disabled={isLoading}
                    style={{ padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
                    <Icons.save />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {submitStatus === "success" && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ Room updated successfully! Redirecting...
        </div>
      )}
    </>
  );
}