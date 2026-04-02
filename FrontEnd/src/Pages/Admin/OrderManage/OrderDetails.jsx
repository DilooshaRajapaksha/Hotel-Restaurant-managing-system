import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";
import api from "../../../utils/axiosInstance";

const Icons = {
  arrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  xIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const STATUS_COLORS = {
  PENDING: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  CONFIRMED: { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
  PREPARING: { bg: "#EDE9FE", color: "#6D28D9", dot: "#8B5CF6" },
  OUT_FOR_DELIVERY: { bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
  DELIVERED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

const PAYMENT_STATUS_COLORS = {
  PAID: { bg: "#D1FAE5", color: "#166534", dot: "#22C55E"  },
  PENDING: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  FAILED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

const PAYMENT_METHOD_COLORS = {
  CASH: { bg: "#E0F2FE", color: "#075985", dot: "#0EA5E9" },
  CARD: { bg: "#EDE9FE", color: "#5B21B6", dot: "#8B5CF6" },
  ONLINE: { bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [draftStatus, setDraftStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const res = await api.get(`http://localhost:8080/api/admin/orders/${id}`);
      setOrder(res.data || null);
      setDraftStatus(res.data?.order_status || "PENDING");
    } catch (err) {
      console.error(err);
      setPageError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async () => {
    try {
      setSaving(true);
      await api.put(`http://localhost:8080/api/admin/orders/${id}/status`, {
        order_status: draftStatus,
      });

      setOrder((prev) => ({
        ...prev,
        order_status: draftStatus,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      setSaving(true);
      await api.put(`http://localhost:8080/api/admin/orders/${id}/cancel`);

      setOrder((prev) => ({
        ...prev,
        order_status: "CANCELLED",
      }));
      setDraftStatus("CANCELLED");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (pageError || !order) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5" }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Order not found</div>
            <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>{pageError || "Unable to load order."}</div>
            <button
              onClick={() => navigate("/admin/orders")}
              style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[order.order_status] || STATUS_COLORS.PENDING;
  const paymentMethodStyle =PAYMENT_METHOD_COLORS[order.payment_method] || PAYMENT_METHOD_COLORS.CASH;
  const paymentStatusStyle =PAYMENT_STATUS_COLORS[order.payment_status] || PAYMENT_STATUS_COLORS.PAID;
  const calculatedTotal =
    order?.items?.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      return sum + qty * unitPrice;
    }, 0) || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#9CA3AF" }}>Orders</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Order #{order.order_id}</span>
            </div>
          </div>

          <div style={{ padding: "32px", flex: 1 }}>
            <button
              onClick={() => navigate("/admin/orders")}
              style={{ color: "#6B7280", fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: "none", border: "none", marginBottom: 14 }}
            >
              <Icons.arrowLeft /> Back to Orders
            </button>

            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Order Details</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Review order information and manage its status.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                  Ordered Items
                </div>

                <div style={{ padding: "20px 24px" }}>
                  {!order.items || order.items.length === 0 ? (
                    <div style={{ color: "#9CA3AF", fontSize: 14 }}>No order items available.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                          {["Item", "Qty", "Unit Price", "Subtotal"].map((h) => (
                            <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => {
                          const qty = Number(item.quantity) || 0;
                          const unitPrice = Number(item.unit_price) || 0;
                          const subtotal = qty * unitPrice;

                          return (
                            <tr key={item.order_item_id || idx} style={{ borderBottom: "1px solid #F9FAFB" }}>
                              <td style={{ padding: "14px", fontSize: 14, fontWeight: 600, color: "#111827" }}>
                                {item.item_name || `Item #${item.item_id}`}
                              </td>
                              <td style={{ padding: "14px", fontSize: 13, color: "#374151" }}>{qty}</td>
                              <td style={{ padding: "14px", fontSize: 13, color: "#374151" }}>LKR {unitPrice}</td>
                              <td style={{ padding: "14px", fontSize: 13, fontWeight: 700, color: "#059669" }}>
                                LKR {subtotal}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    Order Summary
                  </div>

                  <div style={{ padding: "20px 24px", display: "grid", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Order ID</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>#{order.order_id}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Customer</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{order.customer_name || "Customer"}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 3 }}>{order.customer_email || ""}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{order.customer_phone || ""}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Date</div>
                      <div style={{ fontSize: 14, color: "#374151" }}>
                        {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
                        Payment Method
                      </div>
                      <span
                        style={{
                          background: paymentMethodStyle.bg,
                          color: paymentMethodStyle.color,
                          fontSize: 12,
                          fontWeight: 700,
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
                            background: paymentMethodStyle.dot,
                            display: "inline-block",
                          }}
                        />
                        {order.payment_method || "N/A"}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
                        Payment Status
                      </div>
                      <span
                        style={{
                          background: paymentStatusStyle.bg,
                          color: paymentStatusStyle.color,
                          fontSize: 12,
                          fontWeight: 700,
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
                            background: paymentStatusStyle.dot,
                            display: "inline-block",
                          }}
                        />
                        {order.payment_status || "UNKNOWN"}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Address</div>
                      <div style={{ fontSize: 14, color: "#374151" }}>
                        {order.street || "-"}<br />
                        {order.city || ""} {order.district ? `, ${order.district}` : ""}<br />
                        {order.postal_code || ""}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Current Status</div>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                        {order.order_status}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Total Amount</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>LKR {calculatedTotal}</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    Manage Order
                  </div>

                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                      style={{ padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 14, color: "#111827" }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    <button
                      onClick={handleSaveStatus}
                      disabled={saving}
                      style={{ padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      <Icons.save />
                      {saving ? "Saving..." : "Save Status"}
                    </button>

                    <button
                      onClick={handleCancelOrder}
                      disabled={saving || order.order_status === "CANCELLED" || order.order_status === "DELIVERED"}
                      style={{ padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "1.5px solid #FECACA", background: "#fff", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving || order.order_status === "CANCELLED" || order.order_status === "DELIVERED" ? 0.5 : 1 }}
                    >
                      <Icons.xIcon />
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}