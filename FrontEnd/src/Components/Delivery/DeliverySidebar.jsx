import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const GOLD = "#C9A84C";
const NAVY = "#1B2A4A";

// Delivery-staff-only navigation — no admin functions here
const navItems = [
  { label: "My Dashboard",       path: "/delivery",              icon: "🏠" },
  { label: "Available Orders",   path: "/delivery/available",    icon: "📦" },
  { label: "My Active Orders",   path: "/delivery/my-orders",    icon: "🚚" },
  { label: "Delivery History",   path: "/delivery/history",      icon: "✅" },
];

export default function DeliverySidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === "/delivery") return location.pathname === "/delivery";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => { logout(); navigate("/signin"); };

  return (
    <div style={{
      width: 230, minHeight: "100vh", background: NAVY,
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🚴</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, lineHeight: 1.2 }}>Golden Stars</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Delivery Portal</div>
          </div>
        </div>
      </div>

      {/* Logged-in rider info */}
      {user && (
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
            {(user.firstName || user.name || "D").charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.firstName || user.name || "Delivery Staff"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 0" }}>
        {navItems.map(({ label, path, icon }) => {
          const active = isActive(path);
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

      {/* Logout */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={handleLogout}
          style={{ width: "100%", padding: "9px 14px", borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.85)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
