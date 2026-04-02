import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";
import api from "../../../Utils/axiosInstance";

const Icons = {
  xIcon: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  save: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  arrowLeft: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  upload: () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
};

export default function UpdateFood() {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("http://localhost:8081/api/admin/menu-categories");
      setCategories(res.data || []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  };

  const fetchItem = async () => {
    try {
      setIsFetching(true);

      const res = await api.get(`http://localhost:8081/api/admin/menu-items/${id}`);
      const item = res.data;

      setForm({
        item_name: item.item_name || "",
        category_id: item.category_id ? String(item.category_id) : "",
        description: item.description || "",
        price: item.price ?? "",
        half_price: item.half_price ?? "",
        full_price: item.full_price ?? "",
        preparation_time: item.preparation_time ?? "",
        is_available: !!item.is_available,
      });

      const imgRes = await api.get(`http://localhost:8081/api/admin/menu-items/${id}/images`);
      setExistingImages(imgRes.data || []);
    } catch (err) {
      console.error(err);
      setFetchError(`Food item with ID ${id} not found. Please check the ID and try again.`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // checkbox for availability
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

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    try {
      await api.delete(`http://localhost:8081/api/admin/menu-images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => (img.Fimage_id ?? img.fimage_id) !== imageId));
    } catch (err) {
      console.error("Failed to delete image:", err);
      setErrors({ general: "Failed to delete image. Please try again." });
      setSubmitStatus("error");
    }
  };

  const validate = () => {
    const e = {};
    if (!form.item_name.trim()) e.item_name = "Food name is required.";

    if (form.price === "") e.price = "Price is required.";
    else if (isNaN(form.price) || Number(form.price) < 0) e.price = "Price must be a valid number (>= 0).";

    if (form.half_price !== "" && (isNaN(form.half_price) || Number(form.half_price) < 0)) e.half_price = "Half price must be >= 0.";
    if (form.full_price !== "" && (isNaN(form.full_price) || Number(form.full_price) < 0)) e.full_price = "Full price must be >= 0.";
    if (form.preparation_time !== "" && (isNaN(form.preparation_time) || Number(form.preparation_time) < 0)) e.preparation_time = "Preparation time must be >= 0.";

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

      // REQUIRED
      formData.append("item_name", form.item_name.trim());
      formData.append("price", form.price);

      //  checkbox send true/false
      formData.append("is_available", String(form.is_available));

      // OPTIONAL STRING
      if (form.description?.trim()) formData.append("description", form.description.trim());

      // category_id NOT NULL (send default 1 if empty)
      formData.append("category_id", form.category_id ? form.category_id : DEFAULT_CATEGORY_ID);

      // IMPORTANT FIX: do not send "" for numbers
      if (form.half_price !== "") formData.append("half_price", form.half_price);
      if (form.full_price !== "") formData.append("full_price", form.full_price);
      if (form.preparation_time !== "") formData.append("preparation_time", form.preparation_time);

      // new images
      images.forEach((img) => formData.append("images", img));

      await api.put(`http://localhost:8081/api/admin/menu-items/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      setTimeout(() => navigate("/admin/menu"), 1200);
    } catch (err) {
      console.error("Error updating food:", err);
      setSubmitStatus("error");
      setErrors({ general: "Failed to update food item. Please try again." });
    } finally {
      setIsLoading(false);
    }
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

  if (isFetching) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#9CA3AF" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Loading food details...</div>
            <div style={{ fontSize: 13 }}>Fetching Item ID: {id}</div>
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
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Food Item Not Found</div>
            <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>{fetchError}</div>
            <button
              onClick={() => navigate("/admin/menu")}
              style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer" }}
            >
              Back to Menu List
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
          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ marginBottom: 24 }}>
              <button className="bk" onClick={() => navigate("/admin/menu")} style={{ marginBottom: 12 }}>
                <Icons.arrowLeft /> Back to Menu Management
              </button>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Update Food</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Editing Item ID: <strong style={{ color: "#C9A84C" }}>#{id}</strong> — {form.item_name}
              </p>
            </div>

            {submitStatus === "error" && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#991B1B", fontSize: 14, fontWeight: 500 }}>
                <Icons.xIcon /> {errors.general || "Please fix the highlighted fields before saving."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Food Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input className="fi" style={inp(!!errors.item_name)} type="text" name="item_name" value={form.item_name} onChange={handleChange} />
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

                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 11, pointerEvents: "none" }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Price (LKR) <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input className="fi" style={inp(!!errors.price)} type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" />
                      {errors.price && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.price}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Preparation Time (min)</label>
                      <input className="fi" style={inp(!!errors.preparation_time)} type="number" name="preparation_time" value={form.preparation_time} onChange={handleChange} min="0" />
                      {errors.preparation_time && <span style={{ fontSize: 12, color: "#EF4444" }}>⚠ {errors.preparation_time}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Half Price (optional)</label>
                      <input className="fi" style={inp(!!errors.half_price)} type="number" name="half_price" value={form.half_price} onChange={handleChange} min="0" step="0.01" />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Full Price (optional)</label>
                      <input className="fi" style={inp(!!errors.full_price)} type="number" name="full_price" value={form.full_price} onChange={handleChange} min="0" step="0.01" />
                    </div>

                    {/* Availability checkbox */}
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
                      <textarea className="fi" style={{ ...inp(false), minHeight: 100, resize: "vertical" }} name="description" value={form.description} onChange={handleChange} />
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#F3F4F6", margin: "28px 0" }} />

                  {/* Existing images */}
                  {existingImages.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10, display: "block" }}>
                        Current Images
                      </label>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {existingImages.map((img) => {
                          const imageId = img.Fimage_id ?? img.fimage_id;
                          const url = img.Fimage_url ?? img.fimage_url;

                          return (
                            <div key={imageId} className="image-container">
                              <img
                                src={`http://localhost:8081${url}`}
                                alt="Food"
                                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }}
                              />
                              <button type="button" className="remove-btn" onClick={() => removeExistingImage(imageId)}>
                                <Icons.xIcon />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Upload new images */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 600 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                      Add New Images <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span>
                    </label>

                    <label htmlFor="foodImagesUpdate">
                      <div className="uz" style={{ border: `2px dashed ${errors.images ? "#FCA5A5" : "#D1D5DB"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "center", color: "#9CA3AF", marginBottom: 8 }}>
                          <Icons.upload />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Click to upload new photos</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP · Max 5MB each</div>
                      </div>
                    </label>

                    <input id="foodImagesUpdate" type="file" accept="image/*" multiple onChange={handleImageUpload} />

                    {imagePreviews.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="image-container">
                            <img src={src} alt={`preview ${i + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #E5E7EB" }} />
                            <button type="button" className="remove-btn" onClick={() => removeNewImage(i)}>
                              <Icons.xIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", padding: "18px 28px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <button
                    type="button"
                    className="br"
                    onClick={() => navigate("/admin/menu")}
                    style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bs"
                    disabled={isLoading}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                      border: "none",
                      background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 2px 8px rgba(201,168,76,0.3)",
                    }}
                  >
                    <Icons.save />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {submitStatus === "success" && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 999,
            padding: "14px 20px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            background: "#D1FAE5",
            color: "#065F46",
            border: "1px solid #6EE7B7",
          }}
        >
          ✓ Food updated successfully! Redirecting...
        </div>
      )}
    </>
  );
}