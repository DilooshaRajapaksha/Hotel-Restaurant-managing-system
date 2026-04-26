import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../Context/NotificationContext";
import NotificationDrawer from "./NotificationDrawer";
import NotificationToast from "./NotificationToast";

const NAV_ITEMS = [
  { label: "Room Management", path: "/admin/rooms" },
  { label: "Menu Management", path: "/admin/menu" },
  { label: "Orders",          path: "/admin/orders" },
  { label: "Bookings",        path: "/admin/bookings" },
  { label: "Reports",         path: "/admin/reports/summary" },
];

export default function AdminTopBar({ pageTitle, breadcrumb }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { notifications, unread, toast, dismissToast, markAllRead, clearAll } = useNotifications();

  const openDrawer = () => { setDrawerOpen(true); markAllRead(); };

  return (
    <>
      <style>{`
        .atb-bar {
          background: #fff;
          border-bottom: 1px solid #E5E7EB;
          padding: 0 16px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans','Segoe UI',sans-serif;
          gap: 8px;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .atb-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          width: 34px; height: 34px;
          padding: 6px;
          background: none;
          border: 1.5px solid #E5E7EB;
          border-radius: 8px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .atb-burger span { display: block; height: 2px; background: #374151; border-radius: 2px; width: 100%; }
        .atb-burger:hover { background: #F9FAFB; border-color: #C9A84C; }
        .atb-breadcrumb {
          display: flex; align-items: center;
          gap: 4px; font-size: 13px;
          flex: 1; min-width: 0; overflow: hidden;
        }
        .atb-breadcrumb span { white-space: nowrap; }
        .atb-page-title { color: #111827; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .atb-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .atb-bell {
          position: relative; width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #E5E7EB; background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          padding: 0; font-size: 16px; transition: all 0.18s; flex-shrink: 0;
        }
        .atb-bell:hover { background: #FFFBEB; border-color: #C9A84C; }
        .atb-badge {
          position: absolute; top: -3px; right: -3px;
          min-width: 16px; height: 16px; border-radius: 999px;
          background: #EF4444; color: #fff; font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff; padding: 0 2px;
          animation: atbPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes atbPop { from{transform:scale(0)} to{transform:scale(1)} }
        .atb-divider { width: 1px; height: 28px; background: #E5E7EB; flex-shrink: 0; }
        .atb-profile {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 8px; border-radius: 10px;
          border: 1.5px solid #E5E7EB; background: #FAFAFA; flex-shrink: 0;
        }
        .atb-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .atb-name { font-size: 12px; font-weight: 600; color: #111827; line-height: 1.2; white-space: nowrap; }
        .atb-role { font-size: 10px; color: #9CA3AF; line-height: 1.2; white-space: nowrap; }
        .atb-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 999; }
        .atb-mobile-nav {
          position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
          background: #0F1923; z-index: 1000; padding: 24px 16px;
          display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
          animation: atbSlide 0.22s ease; box-shadow: 4px 0 24px rgba(0,0,0,0.3);
        }
        @keyframes atbSlide { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .atb-brand { font-size: 17px; font-weight: 800; color: #C9A84C; margin-bottom: 20px; padding: 0 8px; }
        .atb-nav-item {
          padding: 12px 14px; border-radius: 8px; color: rgba(255,255,255,0.6);
          font-size: 14px; cursor: pointer; transition: all 0.15s;
          border: 1px solid transparent; font-family: 'DM Sans','Segoe UI',sans-serif;
        }
        .atb-nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
        .atb-nav-item.atb-active { color: #C9A84C; background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.25); font-weight: 600; }
        .atb-signout {
          margin-top: auto; padding: 12px 14px; color: rgba(255,255,255,0.4);
          font-size: 14px; cursor: pointer; background: none; border: none;
          text-align: left; font-family: 'DM Sans','Segoe UI',sans-serif;
          transition: color 0.15s; border-radius: 8px;
        }
        .atb-signout:hover { color: #EF4444; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .atb-burger       { display: flex; }
          .atb-profile-text { display: none; }
          .atb-divider      { display: none; }
          .atb-profile      { padding: 3px; border: none; background: transparent; }
        }
        @media (max-width: 480px) {
          .atb-bar        { padding: 0 10px; height: 52px; }
          .atb-breadcrumb { font-size: 12px; }
        }
      `}</style>

      <NotificationToast toast={toast} onDismiss={dismissToast} />
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} notifications={notifications} onClearAll={clearAll} />

      {mobileOpen && (
        <>
          <div className="atb-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="atb-mobile-nav">
            <div className="atb-brand">★ Golden Stars</div>
            {NAV_ITEMS.map(item => (
              <div key={item.path}
                className={`atb-nav-item${location.pathname.startsWith(item.path) ? " atb-active" : ""}`}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                {item.label}
              </div>
            ))}
            <button className="atb-signout"
              onClick={() => { localStorage.removeItem("adminToken"); navigate("/signin"); }}>
              Sign Out
            </button>
          </div>
        </>
      )}

      <div className="atb-bar">
        <button className="atb-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>

        <div className="atb-breadcrumb">
          <span style={{ color: "#9CA3AF" }}>Admin</span>
          {breadcrumb && (<><span style={{ color: "#D1D5DB" }}>›</span><span style={{ color: "#9CA3AF" }}>{breadcrumb}</span></>)}
          {pageTitle  && (<><span style={{ color: "#D1D5DB" }}>›</span><span className="atb-page-title">{pageTitle}</span></>)}
        </div>

        <div className="atb-right">
          <button className="atb-bell" onClick={openDrawer} title="Notifications">
            🔔
            {unread > 0 && <span className="atb-badge">{unread > 99 ? "99+" : unread}</span>}
          </button>

          <div className="atb-divider" />

          {/* Profile avatar always visible, text hidden on mobile */}
          <div className="atb-profile">
            <div className="atb-avatar">A</div>
            <div className="atb-profile-text">
              <div className="atb-name">Admin</div>
              <div className="atb-role">administrator@goldenstar.lk</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}