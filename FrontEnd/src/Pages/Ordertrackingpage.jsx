import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/NavBar/NavBar';
import Footer from '../Components/Footer';
import { AuthContext } from '../Context/AuthContext';
import api from '../utils/axiosInstance';

const GOLD       = '#d4af37';
const GOLD_HOVER = '#b8972e';

const STEPS = [
  { status: 'PENDING',          label: 'Order Placed',      desc: 'Your order has been received',              icon: '📋' },
  { status: 'CONFIRMED',        label: 'Order Confirmed',   desc: 'Restaurant has confirmed your order',        icon: '✅' },
  { status: 'PREPARING',        label: 'Preparing',         desc: 'Your food is being freshly prepared',        icon: '🍳' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery',  desc: 'Your order is on its way to you',            icon: '🚚' },
  { status: 'DELIVERED',        label: 'Delivered',         desc: 'Your order has been delivered. Enjoy!',      icon: '🎉' },
];
const STATUS_ORDER = STEPS.map(s => s.status);
const ACTIVE       = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'];

export default function OrderTrackingPage() {
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId   = searchParams.get('orderId');

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    if (!orderId) { setLoading(false); return; }
    fetchOrder();
  }, [user, orderId]);

  useEffect(() => {
    if (!order || !ACTIVE.includes(order.order_status)) return;
    const t = setInterval(fetchOrder, 30000);
    return () => clearInterval(t);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/customer/orders/${orderId}`);
      setOrder(res.data);
    } catch (e) {
      setError(e.response?.status === 403
        ? "This order doesn't belong to your account."
        : 'Could not load order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const currentStep = order ? STATUS_ORDER.indexOf(order.order_status) : -1;
  const isCancelled = order?.order_status === 'CANCELLED';

  /* ── Shared card style ──────────────────────────────────────────────────── */
  const card = {
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(234,223,203,0.95)',
    borderRadius: 20,
    padding: '22px 26px',
    marginBottom: 16,
    boxShadow: '0 8px 24px rgba(83,62,12,0.06)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right,rgba(201,168,76,0.10),transparent 18%),linear-gradient(180deg,#fffdf8 0%,#fffaf0 100%)', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .spin  { animation: spin  0.9s linear infinite; display: inline-block; }
        .pulse { animation: pulse 1.6s ease-in-out infinite; }
        .step-dot  { transition: all 0.3s ease; }
        .step-line { transition: background 0.3s ease; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '110px 20px 70px' }}>

        <button onClick={() => navigate('/my-orders')}
          style={{ background: 'transparent', border: 'none', color: GOLD_HOVER, cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          ← Back to My Orders
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b5c45' }}>
            <span className="spin" style={{ fontSize: 36 }}>⏳</span>
            <p style={{ marginTop: 14, fontSize: 15 }}>Loading order details…</p>
          </div>
        ) : error ? (
          <div style={{ ...card, background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', textAlign: 'center' }}>⚠ {error}</div>
        ) : !orderId ? (
          <div style={{ ...card, textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 54, marginBottom: 14 }}>🔍</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: '#1f1a14', marginBottom: 8 }}>No Order Selected</h2>
            <p style={{ color: '#6b5c45', fontSize: 14, marginBottom: 20 }}>Go to My Orders and click Track on an active order.</p>
            <button onClick={() => navigate('/my-orders?tab=current')}
              style={{ padding: '12px 28px', borderRadius: 999, fontSize: 14, fontWeight: 700, border: 'none', background: `linear-gradient(135deg,${GOLD},${GOLD_HOVER})`, color: '#111', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
              Go to Active Orders
            </button>
          </div>
        ) : !order ? null : (
          <>
            {/* ── Order header ────────────────────────────────────────────── */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: '#1f1a14', marginBottom: 4 }}>
                    Order #{order.order_id}
                  </h1>
                  <div style={{ color: '#6b5c45', fontSize: 13 }}>{fmtDate(order.order_date)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: GOLD_HOVER }}>
                    LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b5c45', marginTop: 2 }}>Total Amount</div>
                </div>
              </div>
            </div>

            {/* ── Status tracker ──────────────────────────────────────────── */}
            {!isCancelled ? (
              <div style={card}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: '#1f1a14', marginBottom: 22 }}>Order Status</h2>

                {ACTIVE.includes(order.order_status) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20, fontSize: 13, color: '#065f46', background: '#d1fae5', padding: '8px 14px', borderRadius: 999, width: 'fit-content', border: '1px solid #6ee7b7' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block', flexShrink: 0 }} className="pulse" />
                    Live · Auto-refreshes every 30s
                  </div>
                )}

                <div>
                  {STEPS.map((step, idx) => {
                    const done    = idx < currentStep;
                    const active  = idx === currentStep;
                    const pending = idx > currentStep;
                    return (
                      <div key={step.status} style={{ display: 'flex', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div className="step-dot" style={{
                            width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: active ? 20 : 16, zIndex: 1,
                            background:  done   ? `linear-gradient(135deg,${GOLD},${GOLD_HOVER})` : active ? `linear-gradient(135deg,${GOLD},${GOLD_HOVER})` : '#f3f0e8',
                            border:      active ? `3px solid ${GOLD}` : done ? '3px solid transparent' : '3px solid rgba(212,175,55,0.25)',
                            boxShadow:   active ? `0 0 0 5px rgba(212,175,55,0.18)` : done ? '0 2px 8px rgba(212,175,55,0.25)' : 'none',
                            color:       done || active ? '#111' : '#9ca3af',
                          }}>
                            {done ? '✓' : step.icon}
                          </div>
                          {idx < STEPS.length - 1 && (
                            <div className="step-line" style={{ width: 3, flex: 1, minHeight: 32, background: done ? `linear-gradient(${GOLD},${GOLD_HOVER})` : 'rgba(212,175,55,0.18)', margin: '3px 0' }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: idx < STEPS.length - 1 ? 22 : 0, paddingTop: 8 }}>
                          <div style={{ fontSize: 15, fontWeight: active ? 800 : 600, color: done || active ? '#1f1a14' : '#9ca3af', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {step.label}
                            {active && (
                              <span style={{ fontSize: 11, fontWeight: 800, background: `rgba(212,175,55,0.15)`, color: GOLD_HOVER, padding: '2px 10px', borderRadius: 999, border: `1px solid rgba(212,175,55,0.35)` }}>
                                Current
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: done || active ? '#6b5c45' : '#c4bdb0' }}>{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ ...card, border: '1px solid #fca5a5', textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>✖</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: '#991b1b', marginBottom: 6 }}>Order Cancelled</h2>
                <p style={{ color: '#6b5c45', fontSize: 14 }}>This order was cancelled and will not be delivered.</p>
              </div>
            )}

            {/* ── Delivery address ────────────────────────────────────────── */}
            {order.formatted_address && (
              <div style={card}>
                <div style={{ fontSize: 11, color: '#6b5c45', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Delivery Address</div>
                <div style={{ color: '#1f1a14', fontSize: 14, display: 'flex', gap: 7 }}>
                  <span>📍</span><span>{order.formatted_address}</span>
                </div>
              </div>
            )}

            {/* ── Order items ─────────────────────────────────────────────── */}
            {order.items?.length > 0 && (
              <div style={card}>
                <div style={{ fontSize: 11, color: '#6b5c45', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>
                  Order Items ({order.items.length})
                </div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(234,223,203,0.7)' : 'none' }}>
                    <div>
                      <div style={{ color: '#1f1a14', fontSize: 14, fontWeight: 600 }}>{item.item_name || item.itemName}</div>
                      <div style={{ color: '#6b5c45', fontSize: 12, marginTop: 2 }}>Qty: {item.quantity} × LKR {(item.unit_price || item.unitPrice || 0).toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: GOLD_HOVER, fontSize: 14 }}>
                      LKR {((item.unit_price || item.unitPrice || 0) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 4, borderTop: '1.5px solid rgba(212,175,55,0.25)' }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 800, color: '#1f1a14' }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: GOLD_HOVER }}>
                    LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* ── Payment ─────────────────────────────────────────────────── */}
            {order.payment_method && (
              <div style={{ ...card, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b5c45', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Payment Method</div>
                  <div style={{ color: '#1f1a14', fontWeight: 700, fontSize: 14 }}>{order.payment_method}</div>
                </div>
                {order.payment_status && (
                  <div>
                    <div style={{ fontSize: 11, color: '#6b5c45', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Payment Status</div>
                    <div style={{ color: '#065f46', fontWeight: 700, fontSize: 14 }}>{order.payment_status}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── CTA buttons ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              <button onClick={() => navigate('/my-orders')}
                style={{ flex: 1, minWidth: 150, padding: '14px 0', borderRadius: 999, fontSize: 14, fontWeight: 700, border: `1.5px solid rgba(212,175,55,0.45)`, background: 'rgba(255,255,255,0.9)', color: '#1f1a14', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fffdf0'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}>
                ← All Orders
              </button>
              <button onClick={() => navigate('/menu')}
                style={{ flex: 1, minWidth: 150, padding: '14px 0', borderRadius: 999, fontSize: 14, fontWeight: 700, border: 'none', background: `linear-gradient(135deg,${GOLD},${GOLD_HOVER})`, color: '#111', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
                Order Again
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
