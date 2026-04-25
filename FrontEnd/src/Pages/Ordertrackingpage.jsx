import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/NavBar/NavBar';
import { AuthContext } from '../Context/AuthContext';
import api from '../utils/axiosInstance';

const GOLD = "#d4af37";

const STEPS = [
  { status: "PENDING",          label: "Order Placed",       desc: "Your order has been received",              icon: "📋" },
  { status: "CONFIRMED",        label: "Order Confirmed",    desc: "Restaurant has confirmed your order",        icon: "✅" },
  { status: "PREPARING",        label: "Preparing",          desc: "Your food is being freshly prepared",        icon: "🍳" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery",   desc: "Your order is on its way to you",            icon: "🚚" },
  { status: "DELIVERED",        label: "Delivered",          desc: "Your order has been delivered. Enjoy!",      icon: "🎉" },
];

const STATUS_ORDER = STEPS.map(s => s.status);

function getStepIndex(status) {
  if (status === "CANCELLED") return -1;
  return STATUS_ORDER.indexOf(status);
}

export default function OrderTrackingPage() {
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId   = searchParams.get("orderId");

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    if (!orderId) { setLoading(false); return; }
    fetchOrder();
  }, [user, orderId]);

  // Auto-refresh every 30s for active orders
  useEffect(() => {
    if (!order) return;
    const active = ["PENDING","CONFIRMED","PREPARING","OUT_FOR_DELIVERY"];
    if (!active.includes(order.order_status)) return;
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/customer/orders/${orderId}`);
      setOrder(res.data);
    } catch (e) {
      setError(e.response?.status === 403
        ? "This order doesn't belong to your account."
        : "Could not load order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })
    : "—";

  const currentStep = order ? getStepIndex(order.order_status) : -1;
  const isCancelled = order?.order_status === "CANCELLED";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #111; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        .step-dot { transition: all 0.3s ease; }
        .step-line { transition: background 0.3s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#111", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <Navbar />

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "110px 20px 60px" }}>

          <button onClick={() => navigate('/my-orders')}
            style={{ background: "transparent", border: "none", color: GOLD, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
            ← Back to My Orders
          </button>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
              <div style={{ fontSize: 36, marginBottom: 12, display: "inline-block" }} className="spin">⏳</div>
              <div style={{ fontSize: 14 }}>Loading order details...</div>
            </div>
          ) : error ? (
            <div style={{ background: "#FEE2E2", color: "#991B1B", padding: 24, borderRadius: 14, fontSize: 14, textAlign: "center" }}>
              ⚠ {error}
            </div>
          ) : !orderId ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No Order Selected</h2>
              <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 20 }}>Go to My Orders and click Track on an active order.</p>
              <button onClick={() => navigate('/my-orders?tab=current')}
                style={{ padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#b8972e)`, color: "#111", cursor: "pointer", fontFamily: "inherit" }}>
                Go to Active Orders
              </button>
            </div>
          ) : !order ? null : (
            <>
              {/* Order header */}
              <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "24px 28px", marginBottom: 20, border: "1px solid #2a2a2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                      Order #{order.order_id}
                    </h1>
                    <div style={{ color: "#9CA3AF", fontSize: 13 }}>{fmtDate(order.order_date)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>
                      LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Status tracker */}
              {!isCancelled ? (
                <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #2a2a2a" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 28 }}>Order Status</h2>

                  {/* Active orders: auto-refresh badge */}
                  {["PENDING","CONFIRMED","PREPARING","OUT_FOR_DELIVERY"].includes(order.order_status) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 12, color: "#10B981" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} className="pulse" />
                      Live · Auto-refreshes every 30 seconds
                    </div>
                  )}

                  <div style={{ position: "relative" }}>
                    {STEPS.map((step, idx) => {
                      const done    = idx < currentStep;
                      const active  = idx === currentStep;
                      const pending = idx > currentStep;

                      return (
                        <div key={step.status} style={{ display: "flex", gap: 16, marginBottom: idx < STEPS.length - 1 ? 0 : 0 }}>

                          {/* Left: dot + line */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                            <div className="step-dot" style={{
                              width: 40, height: 40, borderRadius: "50%",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: active ? 20 : 16, zIndex: 1,
                              background: done    ? GOLD
                                        : active  ? `linear-gradient(135deg,${GOLD},#b8972e)`
                                        : "#2a2a2a",
                              border: active  ? `3px solid ${GOLD}` : "3px solid transparent",
                              boxShadow: active  ? `0 0 0 4px rgba(212,175,55,0.2)` : "none",
                              color: done || active ? "#111" : "#4B5563",
                              transition: "all 0.3s",
                            }}>
                              {done ? "✓" : step.icon}
                            </div>
                            {idx < STEPS.length - 1 && (
                              <div className="step-line" style={{
                                width: 3, flex: 1, minHeight: 36,
                                background: done ? GOLD : "#2a2a2a",
                                margin: "3px 0",
                              }} />
                            )}
                          </div>

                          {/* Right: text */}
                          <div style={{ paddingBottom: idx < STEPS.length - 1 ? 24 : 0, paddingTop: 8 }}>
                            <div style={{ fontSize: 15, fontWeight: active ? 800 : 600, color: done || active ? "#fff" : "#4B5563", marginBottom: 4 }}>
                              {step.label}
                              {active && (
                                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, background: `rgba(212,175,55,0.15)`, color: GOLD, padding: "2px 8px", borderRadius: 20, border: `1px solid rgba(212,175,55,0.3)` }}>
                                  Current
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: done || active ? "#9CA3AF" : "#374151" }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #F87171", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✖</div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#EF4444", marginBottom: 6 }}>Order Cancelled</h2>
                  <p style={{ color: "#9CA3AF", fontSize: 14 }}>This order was cancelled and will not be delivered.</p>
                </div>
              )}

              {/* Delivery address */}
              {order.formatted_address && (
                <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "20px 24px", marginBottom: 20, border: "1px solid #2a2a2a" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Delivery Address</h3>
                  <div style={{ color: "#fff", fontSize: 14, display: "flex", gap: 8 }}>
                    <span>📍</span>
                    <span>{order.formatted_address}</span>
                  </div>
                </div>
              )}

              {/* Order items */}
              {order.items && order.items.length > 0 && (
                <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "20px 24px", marginBottom: 20, border: "1px solid #2a2a2a" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
                    Order Items ({order.items.length})
                  </h3>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: idx < order.items.length - 1 ? "1px solid #2a2a2a" : "none" }}>
                      <div>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                          {item.item_name || item.itemName}
                        </div>
                        <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
                          Qty: {item.quantity} × LKR {(item.unit_price || item.unitPrice || 0).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: GOLD, fontSize: 14 }}>
                        LKR {((item.unit_price || item.unitPrice || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, marginTop: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: GOLD }}>
                      LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment info */}
              {order.payment_method && (
                <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "20px 24px", marginBottom: 20, border: "1px solid #2a2a2a", display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.8px" }}>Payment Method</div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.payment_method}</div>
                  </div>
                  {order.payment_status && (
                    <div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.8px" }}>Payment Status</div>
                      <div style={{ color: "#10B981", fontWeight: 700, fontSize: 14 }}>{order.payment_status}</div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => navigate('/my-orders')}
                  style={{ flex: 1, minWidth: 160, padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "1.5px solid #2a2a2a", background: "#1a1a1a", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                  ← All Orders
                </button>
                <button onClick={() => navigate('/menu')}
                  style={{ flex: 1, minWidth: 160, padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#b8972e)`, color: "#111", cursor: "pointer", fontFamily: "inherit" }}>
                  Order Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
