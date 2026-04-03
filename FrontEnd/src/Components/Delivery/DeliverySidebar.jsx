import { useNavigate, useLocation } from "react-router-dom";

const GOLD  = "#C9A84C";
const NAVY  = "#1B2A4A";
const WHITE = "#FFFFFF";

const navItems = [
  { label: "Staff Overview",    path: "/delivery/staff",   icon: "👥" },
  { label: "Assign Orders",     path: "/delivery/orders",  icon: "📦" },
  { label: "My Assignments",    path: "/delivery/assigned",icon: "✅" },
];

export default function DeliverySidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <div style={{
      width: 220, minHeight: "100vh", background: NAVY,
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      flexShrink: 0,
    }}>

      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🚴</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, lineHeight: 1.2 }}>Golden Stars</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Delivery Portal</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(({ label, path, icon }) => {
          const active = location.pathname === path || (path === '/delivery/staff' && location.pathname.startsWith('/delivery/staff/'));
          return (
            <button key={path} onClick={() => navigate(path)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 20px", background: active ? "rgba(201,168,76,0.15)" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
                borderLeft: `3px solid ${active ? GOLD : "transparent"}`,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? GOLD : "rgba(255,255,255,0.75)" }}>
                {label}
              </span>
              {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: GOLD }} />}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => navigate("/admin/rooms")}
          style={{ width: "100%", padding: "9px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
          ← Back to Admin Panel
        </button>
      </div>
    </div>
  );
}
