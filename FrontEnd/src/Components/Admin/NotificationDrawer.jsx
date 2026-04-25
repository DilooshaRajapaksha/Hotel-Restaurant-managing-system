import { useNavigate } from "react-router-dom";

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationDrawer({ open, onClose, notifications, onClearAll }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleClick = (n) => {
    onClose();
    if (n.type === "ORDER")   navigate(`/admin/orders/${n.refId}`);
    if (n.type === "BOOKING") navigate("/admin/bookings");
  };

  return (
    <>
      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .notif-drawer {
          position: fixed; top: 0; right: 0;
          width: 360px; height: 100vh;
          background: #fff;
          box-shadow: -6px 0 36px rgba(0,0,0,0.13);
          z-index: 3000;
          display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          animation: drawerIn 0.26s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .nd-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #F3F4F6;
          background: #FAFAFA;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nd-title { font-size: 15px; font-weight: 800; color: #111827; }
        .nd-count { font-size: 12px; color: #9CA3AF; margin-left: 6px; font-weight: 500; }
        .nd-actions { display: flex; align-items: center; gap: 8px; }
        .nd-clear {
          font-size: 12px; font-weight: 600; color: #9CA3AF;
          background: none; border: none; cursor: pointer;
          padding: 4px 8px; border-radius: 6px; font-family: inherit;
          transition: all 0.15s;
        }
        .nd-clear:hover { color: #EF4444; background: #FEF2F2; }
        .nd-close {
          width: 28px; height: 28px; border-radius: 7px;
          background: none; border: none; cursor: pointer;
          color: #6B7280; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .nd-close:hover { background: #F3F4F6; color: #111; }
        .nd-list { flex: 1; overflow-y: auto; padding: 8px 10px; }
        .nd-list::-webkit-scrollbar { width: 4px; }
        .nd-list::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .nd-item {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 12px 10px; border-radius: 10px; margin-bottom: 4px;
          cursor: pointer; border: 1px solid transparent;
          transition: all 0.15s;
        }
        .nd-item:hover { background: #F9FAFB; border-color: #E5E7EB; transform: translateX(-2px); }
        .nd-item.unread { background: rgba(201,168,76,0.05); }
        .nd-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .nd-body { flex: 1; min-width: 0; }
        .nd-item-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .nd-item-msg { font-size: 12px; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nd-item-time { font-size: 11px; color: #9CA3AF; margin-top: 3px; }
        .nd-badge {
          font-size: 10px; font-weight: 700; letter-spacing: 0.4px;
          padding: 2px 7px; border-radius: 999px; flex-shrink: 0; align-self: flex-start; margin-top: 2px;
        }
        .nd-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: #9CA3AF; font-size: 13px; gap: 8px; padding: 40px 20px; text-align: center;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.16)", zIndex: 2999, backdropFilter: "blur(2px)" }}
      />

      <div className="notif-drawer">
        <div className="nd-header">
          <div className="nd-title">
            🔔 Notifications
            {notifications.length > 0 && <span className="nd-count">{notifications.length}</span>}
          </div>
          <div className="nd-actions">
            {notifications.length > 0 && <button className="nd-clear" onClick={onClearAll}>Clear all</button>}
            <button className="nd-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="nd-empty">
            <span style={{ fontSize: 34, opacity: 0.4 }}>🔕</span>
            <div style={{ fontWeight: 600 }}>No notifications yet</div>
            <div style={{ fontSize: 12 }}>New orders and bookings will appear here in real time.</div>
          </div>
        ) : (
          <div className="nd-list">
            {notifications.map((n) => {
              const isOrder = n.type === "ORDER";
              const dot     = isOrder ? "#C9A84C" : "#4299E1";
              const badgeBg = isOrder ? "rgba(201,168,76,0.12)" : "rgba(66,153,225,0.12)";
              const badgeBd = isOrder ? "rgba(201,168,76,0.3)"  : "rgba(66,153,225,0.3)";
              return (
                <div key={n.id} className={`nd-item${!n.read ? " unread" : ""}`} onClick={() => handleClick(n)}>
                  <div className="nd-dot" style={{ background: dot }} />
                  <div className="nd-body">
                    <div className="nd-item-title">{n.title}</div>
                    <div className="nd-item-msg">{n.message}</div>
                    <div className="nd-item-time">{timeAgo(n.timestamp)}</div>
                  </div>
                  <span
                    className="nd-badge"
                    style={{ background: badgeBg, border: `1px solid ${badgeBd}`, color: dot }}
                  >
                    {isOrder ? "Order" : "Booking"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}