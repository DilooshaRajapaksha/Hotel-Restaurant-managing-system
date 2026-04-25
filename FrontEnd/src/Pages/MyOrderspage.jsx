import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/NavBar/NavBar';
import Footer from '../Components/Footer';
import { AuthContext } from '../Context/AuthContext';
import api from '../utils/axiosInstance';

const GOLD       = '#d4af37';
const GOLD_HOVER = '#b8972e';

const STATUS_META = {
  PENDING:          { label: 'Pending',         color: '#b45309', bg: '#fef3c7', icon: '⏳' },
  CONFIRMED:        { label: 'Confirmed',        color: '#1d4ed8', bg: '#dbeafe', icon: '✅' },
  PREPARING:        { label: 'Preparing',        color: '#6d28d9', bg: '#ede9fe', icon: '🍳' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: '#c2410c', bg: '#ffedd5', icon: '🚚' },
  DELIVERED:        { label: 'Delivered',        color: '#065f46', bg: '#d1fae5', icon: '✔️' },
  CANCELLED:        { label: 'Cancelled',        color: '#991b1b', bg: '#fee2e2', icon: '✖'  },
};

const ACTIVE = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'];

function OrderCard({ order }) {
  const navigate = useNavigate();
  const meta     = STATUS_META[order.order_status] || { label: order.order_status, color: '#374151', bg: '#f3f4f6', icon: '📋' };
  const isActive = ACTIVE.includes(order.order_status);

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div
      style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(234,223,203,0.95)', borderRadius: 20, padding: '20px 24px', marginBottom: 14, boxShadow: '0 8px 24px rgba(83,62,12,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(83,62,12,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 8px 24px rgba(83,62,12,0.06)'; }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 800, color: '#1f1a14', marginBottom: 2 }}>Order #{order.order_id}</div>
          <div style={{ fontSize: 12, color: '#6b5c45' }}>{fmtDate(order.order_date)}</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 13px', borderRadius: 999, color: meta.color, background: meta.bg, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${meta.color}30` }}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {order.items?.length > 0 && (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(234,223,203,0.7)' }}>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151', padding: '3px 0' }}>
              <span>• {item.item_name || item.itemName} × {item.quantity}</span>
              <span style={{ color: '#6b5c45' }}>LKR {((item.unit_price || item.unitPrice || 0) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {order.formatted_address && (
        <div style={{ fontSize: 13, color: '#6b5c45', marginBottom: 12, display: 'flex', gap: 5 }}>
          <span>📍</span><span>{order.formatted_address}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 17, color: '#1f1a14' }}>
          LKR {parseFloat(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isActive && (
            <button onClick={() => navigate(`/order-tracking?orderId=${order.order_id}`)}
              style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: 'none', background: `linear-gradient(135deg,${GOLD},${GOLD_HOVER})`, color: '#111', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>
              🚚 Track
            </button>
          )}
          <button onClick={() => navigate(`/order-tracking?orderId=${order.order_id}`)}
            style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: `1.5px solid rgba(212,175,55,0.5)`, background: 'transparent', color: GOLD_HOVER, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#111'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = GOLD_HOVER; }}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { user }   = useContext(AuthContext);
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultTab = searchParams.get('tab') === 'current'  ? 'current'
                   : searchParams.get('tab') === 'previous' ? 'previous' : 'all';

  const [tab,     setTab]     = useState(defaultTab);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    api.get('/api/customer/orders/my')
      .then(res => setOrders(res.data || []))
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  const currentOrders  = orders.filter(o =>  ACTIVE.includes(o.order_status));
  const previousOrders = orders.filter(o => !ACTIVE.includes(o.order_status));
  const displayed      = tab === 'current' ? currentOrders : tab === 'previous' ? previousOrders : orders;

  const tabStyle = (active) => ({
    padding: '9px 20px', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.18s',
    background: active ? `linear-gradient(135deg,${GOLD},${GOLD_HOVER})` : 'rgba(255,255,255,0.8)',
    color:      active ? '#111' : '#6b5c45',
    boxShadow:  active ? '0 4px 12px rgba(212,175,55,0.28)' : 'none',
    border:     active ? 'none' : `1.5px solid rgba(212,175,55,0.35)`,
  });

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right,rgba(201,168,76,0.10),transparent 18%),linear-gradient(180deg,#fffdf8 0%,#fffaf0 100%)', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700;800&display=swap'); *,*::before,*::after{box-sizing:border-box;} @keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 0.9s linear infinite;display:inline-block;}`}</style>
      <Navbar />

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '110px 20px 70px' }}>

        <button onClick={() => navigate('/profile')}
          style={{ background: 'transparent', border: 'none', color: GOLD_HOVER, cursor: 'pointer', fontSize: 13, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          ← Back to Profile
        </button>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, color: '#1f1a14', marginBottom: 4 }}>My Orders</h1>
        <p style={{ color: '#6b5c45', fontSize: 15, marginBottom: 28 }}>{orders.length} total · {currentOrders.length} active</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 26, flexWrap: 'wrap' }}>
          <button style={tabStyle(tab==='all')}      onClick={() => setTab('all')}>📋 All ({orders.length})</button>
          <button style={tabStyle(tab==='current')}  onClick={() => setTab('current')}>🔄 Active ({currentOrders.length})</button>
          <button style={tabStyle(tab==='previous')} onClick={() => setTab('previous')}>✅ History ({previousOrders.length})</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b5c45' }}>
            <span className="spin" style={{ fontSize: 32 }}>⏳</span>
            <p style={{ marginTop: 14, fontSize: 15 }}>Loading your orders…</p>
          </div>
        ) : error ? (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: 20, borderRadius: 14, textAlign: 'center', fontSize: 14, border: '1px solid #fca5a5' }}>
            ⚠ {error}
            <button onClick={() => window.location.reload()} style={{ marginLeft: 12, background: 'transparent', border: '1px solid #f87171', color: '#dc2626', padding: '4px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 700 }}>Retry</button>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.85)', borderRadius: 24, border: '1px solid rgba(234,223,203,0.95)', boxShadow: '0 8px 24px rgba(83,62,12,0.06)' }}>
            <div style={{ fontSize: 54, marginBottom: 14 }}>{tab==='current' ? '🍽️' : tab==='previous' ? '📦' : '🛒'}</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: '#1f1a14', marginBottom: 8 }}>
              {tab==='current' ? 'No active orders' : tab==='previous' ? 'No past orders' : 'No orders yet'}
            </h3>
            <p style={{ color: '#6b5c45', fontSize: 14, marginBottom: 22 }}>
              {tab==='current' ? 'Place an order to see it here.' : 'Your order history will appear here.'}
            </p>
            <button onClick={() => navigate('/menu')}
              style={{ padding: '12px 32px', borderRadius: 999, fontSize: 15, fontWeight: 700, border: 'none', background: `linear-gradient(135deg,${GOLD},${GOLD_HOVER})`, color: '#111', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
              Browse Menu
            </button>
          </div>
        ) : (
          displayed.map(order => <OrderCard key={order.order_id} order={order} />)
        )}
      </div>

      <Footer />
    </div>
  );
}
