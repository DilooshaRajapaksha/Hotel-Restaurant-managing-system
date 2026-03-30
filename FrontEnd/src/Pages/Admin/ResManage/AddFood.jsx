import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";
import axios from "axios";

const Icons = {
  upload: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  xIcon: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  arrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
};

export default function AddFood() {
  const navigate = useNavigate();

  const DEFAULT_CATEGORY_ID = "1";

  const [form, setForm] = useState({
    item_name: "",
    category_id: "",
    description: "",
    price: "",
    half_price: "",
    full_price: "",
    preparation_time: "",
    is_available: true,
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/menu-categories");
      setCategories(res.data || []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    //checkbox for availability
    if (name === "is_available" && type === "checkbox") {
      setForm((prev) => ({ ...prev, is_available: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (files.some((f) => !validTypes.includes(f.type))) {
      setErrors((prev) => ({ ...prev, images: "Only JPG, PNG, and WEBP images are allowed." }));
      return;
    }
    if (files.some((f) => f.size > 5 * 1024 * 1024)) {
      setErrors((prev) => ({ ...prev, images: "Each image must be under 5MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, images: "" }));
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};

    if (!form.item_name.trim()) e.item_name = "Food name is required.";

    if (form.price === "") e.price = "Price is required.";
    else if (isNaN(form.price) || Number(form.price) < 0) e.price = "Price must be a valid number (>= 0).";

    if (form.half_price !== "" && (isNaN(form.half_price) || Number(form.half_price) < 0)) e.half_price = "Half price must be >= 0.";
    if (form.full_price !== "" && (isNaN(form.full_price) || Number(form.full_price) < 0)) e.full_price = "Full price must be >= 0.";
    if (form.preparation_time !== "" && (isNaN(form.preparation_time) || Number(form.preparation_time) < 0)) e.preparation_time = "Preparation time must be >= 0.";

    if (images.length === 0) e.images = "Please upload at least one food image.";

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

      formData.append("item_name", form.item_name.trim());
      formData.append("price", form.price);

      // checkbox send true/false
      formData.append("is_available", String(form.is_available));

      if (form.description?.trim()) formData.append("description", form.description.trim());

      formData.append("category_id", form.category_id ? form.category_id : DEFAULT_CATEGORY_ID);

      if (form.half_price !== "") formData.append("half_price", form.half_price);
      if (form.full_price !== "") formData.append("full_price", form.full_price);
      if (form.preparation_time !== "") formData.append("preparation_time", form.preparation_time);

      images.forEach((img) => formData.append("images", img));

      await axios.post("http://localhost:8081/api/admin/menu-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      setTimeout(() => {
        handleReset();
      }, 1500);
    } catch (err) {
      console.error("Error saving food:", err);
      setSubmitStatus("error");
      setErrors({ general: "Failed to save food item. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      item_name: "",
      category_id: "",
      description: "",
      price: "",
      half_price: "",
      full_price: "",
      preparation_time: "",
      is_available: true,
    });
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    setSubmitStatus(null);
    setIsLoading(false);
  };

  const inp = (hasError, extra = {}) => ({
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    width: "100%",
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`,
    background: hasError ? "#FFF5F5" : "#FAFAFA",
    color: "#111827",
    fontFamily: "inherit",
    ...extra,
  });

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
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif", overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%", overflow: "auto" }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#9CA3AF" }}>Menu Management</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Add New Food</span>
            </div>
          </div>

          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ marginBottom: 24 }}>
              <button className="bk" onClick={() => navigate("/admin/menu")} style={{ marginBottom: 12 }}>
                <Icons.arrowLeft /> Back to Menu Management
              </button>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Add New Food</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>Fill in details to add a new item to the restaurant menu.</p>
            </div>

            {submitStatus === "error" && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#991B1B", fontSize: 14, fontWeight: 500 }}>
                <Icons.xIcon /> {errors.general || "Please fix the highlighted fields before saving."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Food Details</span>
                </div>

                <div style={{ padding: "28px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Food Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input className="fi" style={inp(!!errors.item_name)} type="text" name="item_name" placeholder="e.g. Chicken Kottu" value={form.item_name} onChange={handleChange} />
                      {errors.item_name && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.item_name}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Category <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span>
                      </label>

                      <div style={{ position: "relative" }}>
                        <select
                          className="fi"
                          style={{ ...inp(false), appearance: "none", cursor: "pointer" }}
                          name="category_id"
                          value={form.category_id}
                          onChange={handleChange}
                        >
                          {categories.map((c) => (
                            <option key={c.category_id} value={c.category_id}>
                              {c.category_name || c.menu_name || `Category #${c.category_id}`}
                            </option>
                          ))}
                        </select>

                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 11, pointerEvents: "none" }}>▼</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Price (LKR) <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input className="fi" style={inp(!!errors.price)} type="number" name="price" placeholder="e.g. 1200" value={form.price} onChange={handleChange} min="0" step="0.01" />
                      {errors.price && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.price}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Preparation Time (min)</label>
                      <input className="fi" style={inp(!!errors.preparation_time)} type="number" name="preparation_time" placeholder="e.g. 15" value={form.preparation_time} onChange={handleChange} min="0" />
                      {errors.preparation_time && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.preparation_time}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Half Price (optional)</label>
                      <input className="fi" style={inp(!!errors.half_price)} type="number" name="half_price" placeholder="e.g. 800" value={form.half_price} onChange={handleChange} min="0" step="0.01" />
                      {errors.half_price && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.half_price}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Full Price (optional)</label>
                      <input className="fi" style={inp(!!errors.full_price)} type="number" name="full_price" placeholder="e.g. 1500" value={form.full_price} onChange={handleChange} min="0" step="0.01" />
                      {errors.full_price && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.full_price}</span>}
                    </div>

                    {/*  Availability checkbox */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, gridColumn: "1 / -1", marginTop: 6 }}>
                      <input
                        type="checkbox"
                        name="is_available"
                        checked={form.is_available}
                        onChange={handleChange}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                        Available / Unavailable
                        <span style={{ marginLeft: 10, fontWeight: 700, color: form.is_available ? "#059669" : "#DC2626" }}>
                          {form.is_available ? "AVAILABLE" : "UNAVAILABLE"}
                        </span>
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Description</label>
                      <textarea className="fi" style={{ ...inp(false), minHeight: 100, resize: "vertical" }} name="description" placeholder="Describe the food item..." value={form.description} onChange={handleChange} />
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  {/* Images */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 600 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Food Images <span style={{ color: "#EF4444" }}>*</span>
                    </label>

                    <label htmlFor="foodImages">
                      <div className="uz" style={{ border: `2px dashed ${errors.images ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 8 }}>
                          <Icons.upload />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Click to upload photos</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP · Max 5MB each</div>
                      </div>
                    </label>

                    <input id="foodImages" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    {errors.images && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.images}</span>}

                    {imagePreviews.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                        {imagePreviews.map((src, i) => (
                          <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                            <img src={src} alt={`preview ${i + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }} />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              style={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: "#EF4444",
                                border: "2px solid #fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#fff",
                                padding: 0,
                              }}
                            >
                              <Icons.xIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "18px 28px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <button type="button" className="br" onClick={handleReset} style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}>
                    Clear Form
                  </button>

                  <button type="submit" className="bs" disabled={isLoading} style={{ padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
                    <Icons.plus /> {isLoading ? "Saving..." : "Save Food"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {submitStatus === "success" && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ Food saved successfully!
        </div>
      )}
    </>
  );
}