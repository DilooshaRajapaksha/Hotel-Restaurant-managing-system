import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "../../Components/Delivery/DeliverySidebar";
import axios from "axios";

const BASE_URL = "http://localhost:8081";

const GOLD  = "#C9A84C";
const NAVY  = "#1B2A4A";
function AddStaffModal({ onSave, onClose }) {
  const [form,   setForm]   = useState({ sName: "", email: "", contactNumber: "", passwardHash: "", roleId: 2 });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSave = async () => {
    if (!form.sName.trim())         { setError("Name is required.");         return; }
    if (!form.email.trim())         { setError("Email is required.");        return; }
    if (!form.contactNumber.trim()) { setError("Contact number is required."); return; }
    if (!form.passwardHash.trim())  { setError("Password is required.");     return; }
    setSaving(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/delivery/staff`, form);
      onSave(res.data);
    } catch (e) {
      setError(e.response?.data || "Failed to add staff.");
    } finally { setSaving(false); }
  };

  const inp = { padding: "9px 12px", borderRadius: 8, fontSize: 13, width: "100%", border: "1.5px solid #E5E7EB", background: "#FAFAFA", color: "#111827", fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 2 }}>Add Delivery Staff</h3>
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>New member saved to DELIVERY_STAFF table</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 14, color: "#6B7280" }}>✕</button>
        </div>

        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 14, color: "#991B1B", fontSize: 13 }}>⚠ {error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Full Name <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={inp} placeholder="e.g. Kamal Perera" value={form.sName} onChange={e => { setForm(p => ({...p, sName: e.target.value})); setError(""); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={inp} type="email" placeholder="e.g. kamal@goldenstar.lk" value={form.email} onChange={e => { setForm(p => ({...p, email: e.target.value})); setError(""); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Contact Number <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={inp} placeholder="e.g. 0771234567" value={form.contactNumber} onChange={e => { setForm(p => ({...p, contactNumber: e.target.value})); setError(""); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={inp} type="password" placeholder="Set initial password" value={form.passwardHash} onChange={e => { setForm(p => ({...p, passwardHash: e.target.value})); setError(""); }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: saving ? "#9CA3AF" : `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {saving ? "Adding..." : "Add Staff"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function DeliveryStaffPage() {
  const navigate = useNavigate();
  const [staff,      setStaff]      = useState([]);
  const [counts,     setCounts]     = useState({});   
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [search,     setSearch]     = useState("");
  const [toast,      setToast]      = useState("");
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery/staff`);
      const list = res.data || [];
      setStaff(list);
      const countMap = {};
      await Promise.all(list.map(async s => {
        try {
          const cr = await axios.get(`${BASE_URL}/api/delivery/staff/${s.staffId}/assignments/count`);
          countMap[s.staffId] = cr.data;
        } catch { countMap[s.staffId] = 0; }
      }));
      setCounts(countMap);
    } catch { /* handle silently */ }
    finally { setLoading(false); }
  };

  const handleStaffAdded = (newStaff) => {
    setStaff(prev => [...prev, newStaff]);
    setCounts(prev => ({ ...prev, [newStaff.staffId]: 0 }));
    setShowModal(false);
    showToast(`${newStaff.sName} added successfully!`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/delivery/staff/${deleteId}`);
      setStaff(prev => prev.filter(s => s.staffId !== deleteId));
      setCounts(prev => { const n = {...prev}; delete n[deleteId]; return n; });
      showToast("Staff member removed.");
    } catch (e) {
      showToast(e.response?.data || "Failed to delete staff.");
    } finally { setDeleting(false); setDeleteId(null); }
  };

  const filtered = staff.filter(s =>
    s.sName?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    String(s.staffId).includes(search)
  );

  const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .sr:hover td { background: #FFFBEB !important; transition: background 0.12s; }
        .del-btn:hover { background: #FEE2E2 !important; border-color: #FCA5A5 !important; color: #991B1B !important; }
        .assign-btn:hover { background: linear-gradient(135deg,${GOLD},#8B6914) !important; color: #fff !important; border-color: transparent !important; }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .toast { animation: slideUp 0.25s ease; }
        ::placeholder { color: #C4C9D4; }
      `}</style>

      {showModal && <AddStaffModal onSave={handleStaffAdded} onClose={() => setShowModal(false)} />}

      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Remove Staff Member?</h3>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>All their order assignments will be cleared.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", background: deleting ? "#FCA5A5" : "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                {deleting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <DeliverySidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto" }}>

          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#9CA3AF" }}>Delivery Portal</span>
              <span style={{ color: "#D1D5DB" }}>›</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>Staff Overview</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admin</div>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Delivery Staff</h1>
                <p style={{ fontSize: 14, color: "#6B7280" }}>Manage delivery team members and their assignments.</p>
              </div>
              <button onClick={() => setShowModal(true)}
                style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: `linear-gradient(135deg,${GOLD},#8B6914)`, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(201,168,76,0.3)", fontFamily: "inherit" }}>
                + Add Staff Member
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Staff", value: staff.length,    border: GOLD },
                { label: "Active (Has Orders)", value: Object.values(counts).filter(c => c > 0).length, border: "#10B981" },
                { label: "Available (No Orders)", value: Object.values(counts).filter(c => c === 0).length, border: "#6366F1" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              <div style={{ padding: "18px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>All Staff Members</span>
                <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10, marginLeft: 4 }}>{staff.length}</span>

                <div style={{ marginLeft: "auto", position: "relative" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 7, paddingBottom: 7, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", fontSize: 13, width: 220, color: "#111827", fontFamily: "inherit", outline: "none" }}
                    placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 56, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading staff...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: 56, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No staff found</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>{search ? "Try a different keyword." : "Add your first delivery staff member!"}</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                        {["Staff ID","Name","Email","Contact","Joined","Active Orders","Action"].map(h => (
                          <th key={h} style={{ padding: "11px 20px", textAlign: "left", color: "#9CA3AF", fontWeight: 700, fontSize: 11, letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => {
                        const assignCount = counts[s.staffId] ?? 0;
                        return (
                          <tr key={s.staffId} className="sr" style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F9FAFB" }}>
                            <td style={{ padding: "14px 20px", fontWeight: 700, color: GOLD }}>{s.staffId}</td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                  {(s.sName || "?").charAt(0).toUpperCase()}
                                </div>
                                <span onClick={() => navigate(`/delivery/staff/${s.staffId}`)}
                                  style={{ fontWeight: 600, color: "#111827", cursor: "pointer", textDecoration: "underline", textDecorationColor: GOLD }}>
                                  {s.sName}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 20px", color: "#6B7280" }}>{s.email}</td>
                            <td style={{ padding: "14px 20px", color: "#374151" }}>{s.contactNumber}</td>
                            <td style={{ padding: "14px 20px", color: "#6B7280", whiteSpace: "nowrap" }}>{fmtDate(s.joinTime)}</td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                background: assignCount > 0 ? "#D1FAE5" : "#F3F4F6",
                                color: assignCount > 0 ? "#065F46" : "#6B7280",
                                fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                              }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: assignCount > 0 ? "#10B981" : "#D1D5DB" }} />
                                {assignCount} order{assignCount !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                              <button className="assign-btn"
                                onClick={() => navigate(`/delivery/staff/${s.staffId}`)}
                                style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", marginRight: 6, fontFamily: "inherit", fontWeight: 500, transition: "all 0.12s" }}>
                                View Profile
                              </button>
                              <button className="del-btn"
                                onClick={() => setDeleteId(s.staffId)}
                                style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.12s" }}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, padding: "14px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7" }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
