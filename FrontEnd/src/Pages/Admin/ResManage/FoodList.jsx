import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from "../../../Components/Admin/AdminTopBar";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";
import api from "../../../utils/axiosInstance";

const Icons = {
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  delete: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  empty: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
};

const STATUS_COLORS = {
  AVAILABLE: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  UNAVAILABLE: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

export default function FoodList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thumbs, setThumbs] = useState({});

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const needThumb = items.filter((it) => !getInlineImageUrl(it));
    if (needThumb.length === 0) return;

    (async () => {
      try {
        await Promise.all(
          needThumb.map(async (it) => {
            const id = it.item_id;
            if (!id) return;
            if (thumbs[id]) return;

            const imgRes = await api.get(`http://localhost:8081/api/admin/menu-items/${id}/images`);
            const arr = imgRes.data || [];
            const first = arr[0];

            const url =
              first?.Fimage_url ??
              first?.fimage_url ??
              first?.image_url ??
              first?.url ??
              "";

            if (url) {
              setThumbs((prev) => ({ ...prev, [id]: url }));
            }
          })
        );
      } catch {
        // ignore thumb errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("http://localhost:8081/api/admin/menu-items");
      setItems(res.data || []);
    } catch {
      setError("Failed to load menu items. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);
      const res = await api.get("http://localhost:8081/api/admin/menu-categories");
      setCategories(res.data || []);
    } catch {
      setCategories([]);
      setCategoryError("Failed to load menu categories.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDelete = async (itemId, itemName) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${itemName}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(itemId);
      await api.delete(`http://localhost:8081/api/admin/menu-items/${itemId}`);

      setItems((prev) => prev.filter((item) => item.item_id !== itemId));
      setThumbs((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete item:", err);
      const errorMessage =
    err?.response?.data?.message ||
    err?.response?.data ||
    "Failed to delete menu item. Please try again.";

    alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const confirmed = window.confirm(`Are you sure you want to remove category "${categoryName}"?`);
    if (!confirmed) return;

    try {
      setDeletingCategoryId(categoryId);
      await api.delete(`http://localhost:8081/api/admin/menu-categories/${categoryId}`);
      setCategories((prev) => prev.filter((cat) => cat.category_id !== categoryId));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to delete category. It may be linked to menu items."
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => String(c.category_id) === String(categoryId));
    return cat ? (cat.category_name || c.name || `Category #${cat.category_id}`) : `Category #${categoryId}`;
  };

  const filteredItems = items.filter((it) =>
    it.item_name?.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryName(it.category_id)?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) =>
    (cat.category_name || "")
      .toLowerCase()
      .includes(categorySearch.toLowerCase())
  );

  const toStatusKey = (isAvailable) => (isAvailable ? "AVAILABLE" : "UNAVAILABLE");

  const moneyCell = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    return `LKR ${val}`;
  };

  const getInlineImageUrl = (it) => {
    return it?.image_url ?? it?.item_image ?? it?.thumbnail ?? "";
  };

  const getThumbUrl = (it) => {
    const inline = getInlineImageUrl(it);
    const fromMap = thumbs[it.item_id];
    const url = inline || fromMap || "";
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:8081${url}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .row { transition: background 0.15s; }
        .row:hover { background: #FFFBEB !important; }
        .edit-btn:hover { background: linear-gradient(135deg,#C9A84C,#8B6914) !important; color: #fff !important; border-color: transparent !important; }
        .edit-btn { transition: all 0.18s; }
        .delete-btn:hover { background: #EF4444 !important; color: #fff !important; border-color: #EF4444 !important; }
        .delete-btn { transition: all 0.18s; }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important; }
        .add-btn { transition: all 0.18s; }
        .search-input:focus { border-color: #C9A84C !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); outline: none; }

        .table-scroll { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .table-scroll table { min-width: 680px; }
        @media (max-width: 768px) { .fl-filter { flex-direction: column !important; } .fl-filter > * { width: 100% !important; } }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <AdminTopBar pageTitle="Menu Management" />

          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Menu Management</h1>
                <p style={{ fontSize: 14, color: "#6B7280" }}>View, add, update and delete restaurant menu items.</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  className="add-btn"
                  onClick={() => navigate("/admin/menu/add-category")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
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
                  <Icons.plus /> Add Category
                </button>

                <button
                  className="add-btn"
                  onClick={() => navigate("/admin/menu/add")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
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
                  <Icons.plus /> Add New Item
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Items", value: items.length, color: "#C9A84C" },
                { label: "Available", value: items.filter((i) => i.is_available).length, color: "#10B981" },
                { label: "Unavailable", value: items.filter((i) => !i.is_available).length, color: "#EF4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Items Table */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 28 }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>All Items</span>
                  <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>
                    {filteredItems.length}
                  </span>
                </div>

                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                    <Icons.search />
                  </span>
                  <input
                    className="search-input"
                    style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 240, color: "#111827" }}
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading items...</div>
              ) : error ? (
                <div style={{ padding: 48, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{error}</div>
              ) : filteredItems.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#D1D5DB", display: "flex", justifyContent: "center", marginBottom: 16 }}><Icons.empty /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No items found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Add your first item using the button above.</div>
                </div>
              ) : (
                <div className="table-scroll"><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                      {["ID", "Item Name", "Category", "Price", "Half Price", "Full Price", "Status", "Image", "Action"].map((h) => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((it, i) => {
                      const statusKey = toStatusKey(!!it.is_available);
                      const statusStyle = STATUS_COLORS[statusKey];
                      const thumb = getThumbUrl(it);

                      return (
                        <tr key={it.item_id} className="row" style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>#{it.item_id}</td>

                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{it.item_name}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{it.description}</div>
                          </td>

                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                              {getCategoryName(it.category_id)}
                            </span>
                          </td>

                          <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>
                            {moneyCell(it.price)}
                          </td>

                          <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                            {moneyCell(it.half_price)}
                          </td>

                          <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                            {moneyCell(it.full_price)}
                          </td>

                          <td style={{ padding: "14px 24px" }}>
                            <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                              {statusKey}
                            </span>
                          </td>

                          <td style={{ padding: "10px 24px" }}>
                            {thumb ? (
                              <img
                                src={thumb}
                                alt="thumb"
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  border: "2px solid #E5E7EB",
                                  background: "#fff",
                                }}
                              />
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: 10, border: "2px dashed #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 11 }}>
                                —
                              </div>
                            )}
                          </td>

                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <button
                                className="edit-btn"
                                onClick={() => navigate(`/admin/menu/edit/${it.item_id}`)}
                                style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <Icons.edit /> Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(it.item_id, it.item_name)}
                                disabled={deletingId === it.item_id}
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 8,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  border: "1.5px solid #FECACA",
                                  background: "#fff",
                                  color: "#DC2626",
                                  cursor: deletingId === it.item_id ? "not-allowed" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  opacity: deletingId === it.item_id ? 0.7 : 1,
                                }}
                              >
                                <Icons.delete />
                                {deletingId === it.item_id ? "Removing..." : "Remove"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table></div>
              )}
            </div>

            {/* Categories Table */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>All Categories</span>
                  <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>
                    {filteredCategories.length}
                  </span>
                </div>

                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                    <Icons.search />
                  </span>
                  <input
                    className="search-input"
                    style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 240, color: "#111827" }}
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
              </div>

              {categoryLoading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading categories...</div>
              ) : categoryError ? (
                <div style={{ padding: 48, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{categoryError}</div>
              ) : filteredCategories.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#D1D5DB", display: "flex", justifyContent: "center", marginBottom: 16 }}><Icons.empty /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No categories found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Add your first category using the button above.</div>
                </div>
              ) : (
                <div className="table-scroll"><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                      {["ID", "Category Name", "Description", "Status", "Action"].map((h) => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCategories.map((cat, i) => {
                      const isActive = cat.is_active ?? cat.isActive ?? true;

                      return (
                        <tr key={cat.category_id} className="row" style={{ borderBottom: "1px solid #F9FAFB", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>#{cat.category_id}</td>

                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                              {cat.category_name}
                            </div>
                          </td>

                          <td style={{ padding: "14px 24px", fontSize: 13, color: "#6B7280" }}>
                            {cat.description || "—"}
                          </td>

                          <td style={{ padding: "14px 24px" }}>
                            <span
                              style={{
                                background: isActive ? "#D1FAE5" : "#FEE2E2",
                                color: isActive ? "#065F46" : "#991B1B",
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "4px 12px",
                                borderRadius: 20,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: isActive ? "#10B981" : "#EF4444",
                                  display: "inline-block",
                                }}
                              />
                              {isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>

                          <td style={{ padding: "14px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <button
                                className="edit-btn"
                                onClick={() => navigate(`/admin/menu/categories/edit/${cat.category_id}`)}
                                style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <Icons.edit /> Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteCategory(cat.category_id, cat.category_name)}
                                disabled={deletingCategoryId === cat.category_id}
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 8,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  border: "1.5px solid #FECACA",
                                  background: "#fff",
                                  color: "#DC2626",
                                  cursor: deletingCategoryId === cat.category_id ? "not-allowed" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  opacity: deletingCategoryId === cat.category_id ? 0.7 : 1,
                                }}
                              >
                                <Icons.delete />
                                {deletingCategoryId === cat.category_id ? "Removing..." : "Remove"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
               </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}