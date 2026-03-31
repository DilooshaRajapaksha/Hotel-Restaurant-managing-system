import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSideBar";
import api from "../../../Utils/axiosInstance";

const Icons = {
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  xIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const ORDER_STATUS_STYLES = {
  PENDING: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  CONFIRMED: { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" },
  PREPARING: { bg: "#EDE9FE", color: "#6D28D9", dot: "#8B5CF6" },
  OUT_FOR_DELIVERY: { bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
  DELIVERED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  CANCELLED: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

export default function OrderList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [savingId, setSavingId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const res = await api.get("http://localhost:8080/api/admin/orders");
      const data = res.data || [];

      setOrders(data);

      const drafts = {};
      data.forEach((o) => {
        drafts[o.order_id] = o.order_status;
      });
      setStatusDrafts(drafts);
    } catch (err) {
      console.error(err);
      setPageError("Failed to load orders. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDraftChange = (orderId, value) => {
    setStatusDrafts((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleSaveStatus = async (orderId) => {
    try {
      setSavingId(orderId);
      await api.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
        order_status: statusDrafts[orderId],
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? { ...o, order_status: statusDrafts[orderId] }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      setSavingId(orderId);
      await api.put(`http://localhost:8080/api/admin/orders/${orderId}/cancel`);

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? { ...o, order_status: "CANCELLED" }
            : o
        )
      );

      setStatusDrafts((prev) => ({
        ...prev,
        [orderId]: "CANCELLED",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const customerText =
        `${o.customer_name || ""} ${o.customer_email || ""} ${o.customer_phone || ""}`.toLowerCase();

      const orderDate = o.order_date ? String(o.order_date).slice(0, 10) : "";

      const matchesSearch =
        customerText.includes(search.toLowerCase()) ||
        String(o.order_id || "").includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || o.order_status === statusFilter;

      const matchesDate =
        !dateFilter || orderDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, statusFilter, dateFilter]);

  const stats = {
    total: orders.length,
    preparing: orders.filter((o) => o.order_status === "PREPARING").length,
    ready: orders.filter((o) => o.order_status === "OUT_FOR_DELIVERY").length,
    delivered: orders.filter((o) => o.order_status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.order_status === "CANCELLED").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .search-input:focus, .filter-input:focus {
          border-color: #C9A84C !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
          outline: none;
        }
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: #FFFBEB !important; }
        .action-btn { transition: all 0.18s; }
        .action-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Admin</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Orders</span>
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
              </div>
            </div>
          </div>

          <div style={{ padding: "32px", flex: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Order Management</h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                View, update and cancel restaurant orders.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Orders", value: stats.total, color: "#C9A84C" },
                { label: "Preparing", value: stats.preparing, color: "#8B5CF6" },
                { label: "Ready / Out", value: stats.ready, color: "#10B981" },
                { label: "Delivered", value: stats.delivered, color: "#059669" },
                { label: "Cancelled", value: stats.cancelled, color: "#EF4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>All Orders</span>
                  <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{filteredOrders.length}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                      <Icons.search />
                    </span>
                    <input
                      className="search-input"
                      style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 220, color: "#111827" }}
                      placeholder="Search customer or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="filter-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, color: "#111827" }}
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <input
                    className="filter-input"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, color: "#111827" }}
                  />
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading orders...</div>
              ) : pageError ? (
                <div style={{ padding: 48, textAlign: "center", color: "#EF4444", fontSize: 14 }}>{pageError}</div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: 64, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                  No orders found.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                      {["Order ID", "Customer", "Date", "Total", "Status", "Change Status", "Action"].map((h) => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const style = ORDER_STATUS_STYLES[order.order_status] || ORDER_STATUS_STYLES.PENDING;

                      return (
                        <tr key={order.order_id} className="row-hover" style={{ borderBottom: "1px solid #F9FAFB", background: index % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF", fontWeight: 700 }}>
                            #{order.order_id}
                          </td>

                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                              {order.customer_name || "Customer"}
                            </div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                              {order.customer_phone || order.customer_email || "No contact info"}
                            </div>
                          </td>

                          <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>
                            {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
                          </td>

                          <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>
                            LKR {order.total_amount}
                          </td>

                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ background: style.bg, color: style.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: style.dot, display: "inline-block" }} />
                              {order.order_status}
                            </span>
                          </td>

                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <select
                                value={statusDrafts[order.order_id] || order.order_status}
                                onChange={(e) => handleDraftChange(order.order_id, e.target.value)}
                                style={{ padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, color: "#111827", minWidth: 155 }}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>

                              <button
                                className="action-btn"
                                onClick={() => handleSaveStatus(order.order_id)}
                                disabled={savingId === order.order_id}
                                style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <Icons.save />
                                {savingId === order.order_id ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </td>

                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <button
                                className="action-btn"
                                onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                                style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <Icons.eye />
                                View
                              </button>

                              <button
                                className="action-btn"
                                onClick={() => handleCancelOrder(order.order_id)}
                                disabled={order.order_status === "CANCELLED" || order.order_status === "DELIVERED" || savingId === order.order_id}
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  fontSize: 13,
                                  fontWeight: 700,
                                  border: "1.5px solid #FECACA",
                                  background: "#fff",
                                  color: "#DC2626",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  opacity: order.order_status === "CANCELLED" || order.order_status === "DELIVERED" || savingId === order.order_id ? 0.5 : 1,
                                }}
                              >
                                <Icons.xIcon />
                                Cancel
                              </button>
                            </div>
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