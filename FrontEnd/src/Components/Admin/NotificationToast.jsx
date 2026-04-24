// src/Components/Admin/NotificationToast.jsx
export default function NotificationToast({ toast, onDismiss }) {
  if (!toast) return null;

  const isOrder   = toast.type === "ORDER";
  const accent    = isOrder ? "#C9A84C" : "#4299E1";
  const icon      = isOrder ? "🛒" : "🛏️";

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(-50%) translateY(-70px) scale(0.95); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0)     scale(1);    opacity: 1; }
        }
        @keyframes progressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .admin-toast-wrap {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: 370px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
          border-left: 4px solid ${accent};
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px 18px;
          animation: toastIn 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          overflow: hidden;
        }
        .admin-toast-wrap:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.22); }
        .toast-icon  { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
        .toast-body  { flex: 1; min-width: 0; }
        .toast-title { font-size: 13px; font-weight: 800; color: #111827; margin-bottom: 3px; }
        .toast-msg   { font-size: 12px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .toast-x     { background: none; border: none; cursor: pointer; color: #9CA3AF; font-size: 16px; padding: 0; line-height:1; flex-shrink:0; }
        .toast-x:hover { color: #EF4444; }
        .toast-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          background: ${accent};
          opacity: 0.5;
          border-radius: 0 0 0 14px;
          animation: progressShrink 4.5s linear forwards;
        }
      `}</style>

      <div className="admin-toast-wrap" onClick={onDismiss}>
        <span className="toast-icon">{icon}</span>
        <div className="toast-body">
          <div className="toast-title">{toast.title}</div>
          <div className="toast-msg">{toast.message}</div>
        </div>
        <button className="toast-x" onClick={e => { e.stopPropagation(); onDismiss(); }}>✕</button>
        <div className="toast-bar" />
      </div>
    </>
  );
}
