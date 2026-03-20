import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";

const Icons = {
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  xIcon: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  arrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
};

export default function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_name: "",
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.category_name.trim()) {
      newErrors.category_name = "Category name is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus("error");
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      setSubmitStatus(null);

      await axios.post("http://localhost:8081/api/admin/menu-categories", {
        category_name: form.category_name.trim(),
        description: form.description.trim(),
        is_active: form.is_active,
      });

      setSubmitStatus("success");

      setTimeout(() => {
        navigate("/admin/menu");
      }, 2000);
    } catch (error) {
      console.error("Failed to save category:", error);
      setSubmitStatus("error");
      setErrors({
        general:
          error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to save category. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      category_name: "",
      description: "",
      is_active: true,
    });
    setErrors({});
    setSubmitStatus(null);
    setIsLoading(false);
  };

  const inputStyle = (hasError, extra = {}) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`,
    background: hasError ? "#FFF5F5" : "#FAFAFA",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
    ...extra,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #F0F2F5;
          font-family: 'DM Sans','Segoe UI',sans-serif;
        }

        .fi:focus {
          border-color: #C9A84C !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }

        .btn-hover {
          transition: all 0.18s;
        }

        .btn-hover:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(201,168,76,0.4) !important;
        }

        .back-btn {
          color: #6B7280;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.15s;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }

        .back-btn:hover {
          color: #C9A84C;
        }

        .secondary-btn {
          transition: all 0.18s;
        }

        .secondary-btn:hover {
          background: #F3F4F6 !important;
          border-color: #C9A84C !important;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast {
          animation: slideUp 0.3s ease;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          background: "#F0F2F5",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        <AdminSidebar />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderBottom: "1px solid #E5E7EB",
              padding: "0 32px",
              height: 64,
              display: "flex",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#9CA3AF" }}>Menu Management</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Add Category</span>
            </div>
          </div>

          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ marginBottom: 24 }}>
              <button
                className="back-btn"
                onClick={() => navigate("/admin/menu")}
                style={{ marginBottom: 12 }}
              >
                <Icons.arrowLeft /> Back to Menu Management
              </button>

              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                Add New Category
              </h1>

              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Fill in details to add a new menu category.
              </p>
            </div>

            {submitStatus === "error" && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#991B1B",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <Icons.xIcon />
                {errors.general || "Please fix the highlighted fields before saving."}
              </div>
            )}

            {submitStatus === "success" && (
              <div
                style={{
                  background: "#D1FAE5",
                  border: "1px solid #6EE7B7",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#065F46",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                ✓ Category saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "18px 28px",
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#C9A84C",
                    }}
                  />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    Category Details
                  </span>
                </div>

                <div style={{ padding: "28px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px 24px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Category Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>

                      <input
                        className="fi"
                        style={inputStyle(!!errors.category_name)}
                        type="text"
                        name="category_name"
                        value={form.category_name}
                        onChange={handleChange}
                        placeholder="e.g. Rice, Noodles, Drinks"
                      />

                      {errors.category_name && (
                        <span style={{ fontSize: 12, color: "#EF4444" }}>
                          ⚠ {errors.category_name}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30 }}>
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />

                      <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                        Active / Inactive
                        <span
                          style={{
                            marginLeft: 10,
                            fontWeight: 700,
                            color: form.is_active ? "#059669" : "#DC2626",
                          }}
                        >
                          {form.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        gridColumn: "1 / -1",
                      }}
                    >
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        Description
                      </label>

                      <textarea
                        className="fi"
                        style={inputStyle(false, { minHeight: 120, resize: "vertical" })}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe this category..."
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                    padding: "18px 28px",
                    borderTop: "1px solid #F3F4F6",
                    background: "#FAFAFA",
                  }}
                >
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleReset}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      border: "1.5px solid #E5E7EB",
                      background: "#fff",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    className="btn-hover"
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
                    <Icons.plus />
                    {isLoading ? "Saving..." : "Save Category"}
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
          ✓ Category saved successfully!
        </div>
      )}
    </>
  );
}
