import { useNavigate, useLocation } from "react-router-dom";

const Icons = {
  rooms: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  menu: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2"/><path d="M18 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/>
    </svg>
  ),
  bookings: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  reports: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  logout: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: "rooms",    label: "Room Management", path: "/admin/rooms",    Icon: Icons.rooms },
  { id: "menu",     label: "Menu Management", path: "/admin/menu",     Icon: Icons.menu },
  { id: "bookings", label: "Bookings",         path: "/admin/bookings", Icon: Icons.bookings },
  { id: "reports",  label: "Reports",          path: "/admin/reports",  Icon: Icons.reports },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 8px; margin-bottom: 4px;
          cursor: pointer; transition: all 0.18s;
          font-size: 14px; font-weight: 400;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(255,255,255,0.5);
        }
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.85) !important;
        }
        .sidebar-nav-item.active {
          background: rgba(201,168,76,0.15) !important;
          color: #C9A84C !important;
          font-weight: 600;
          border-color: rgba(201,168,76,0.25) !important;
        }
        .sidebar-logout-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 8px;
          cursor: pointer; font-size: 14px;
          color: rgba(255,255,255,0.4);
          background: transparent; border: none;
          width: 100%; transition: color 0.18s;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }
        .sidebar-logout-btn:hover { color: #EF4444 !important; }
        .active-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C9A84C; margin-left: auto; flex-shrink: 0;
        }
      `}</style>

      <aside style={{
        width: 240, minHeight: "100vh", background: "#0F1923",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, flexShrink: 0,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#C9A84C", letterSpacing: "-0.5px" }}>★ Golden Stars</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, letterSpacing: "1px", textTransform: "uppercase" }}>Admin Portal</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Admin</div>
            <div style={{ fontSize: 11, color: "#C9A84C", marginTop: 1 }}>Administrator</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_ITEMS.map(({ id, label, path, Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <div key={id} className={`sidebar-nav-item${isActive ? " active" : ""}`} onClick={() => navigate(path)}>
                <Icon />
                {label}
                {isActive && <span className="active-dot" />}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <Icons.logout />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}