import React, { useState, useEffect } from 'react';
import api from "../../utils/axiosInstance";
import AdminSideBar from '../../Components/Admin/AdminSideBar';

const GOLD = "#C9A84C";

const AdminExperiences = () => {
  const [experiences, setExperiencesData] = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [formData, setFormData]           = useState({ title: '', description: '', imageUrl: '', location: '', price: 0 });
  const [editingId, setEditingId]         = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [search, setSearch]               = useState("");
  const [toast, setToast]                 = useState("");
  const [deleteId, setDeleteId]           = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setLoading(true);
    api.get('/api/experiences')
      .then(res => {
        setExperiencesData(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error("GET /api/experiences failed:", err.message))
      .finally(() => setLoading(false));
  };

  const handleSearch = (value) => {
    setSearch(value);
    setFiltered(experiences.filter(e =>
      e.title.toLowerCase().includes(value.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(value.toLowerCase())
    ));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(""), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) || 0 : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title:       formData.title,
      description: formData.description,
      imageUrl:    formData.imageUrl,
      location:    formData.location,
      price:       formData.price,
    };
    try {
      const method = editingId ? 'put' : 'post';
      const url    = editingId ? `/api/experiences/${editingId}` : '/api/experiences';
      await api[method](url, payload);
      loadData();
      resetForm();
      showToast(editingId ? "Experience updated successfully!" : "Experience created successfully!");
    } catch (err) {
      console.error(err);
      showToast("Save failed — check console", "error");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '', location: '', price: 0 });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (exp) => {
    setFormData({
      title:       exp.title,
      description: exp.description || '',
      imageUrl:    exp.imageUrl,
      location:    exp.location || '',
      price:       exp.price || 0,
    });
    setEditingId(exp.experienceId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/experiences/${deleteId}`);
      loadData();
      showToast("Experience deleted.");
    } catch {
      showToast("Delete failed.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const inp = {
    padding: "9px 12px", borderRadius: 8, fontSize: 13, width: "100%",
    border: "1.5px solid #E5E7EB", background: "#FAFAFA", color: "#111827",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F0F2F5; font-family: 'DM Sans','Segoe UI',sans-serif; }
        .exp-row:hover td { background: #FFFBEB !important; transition: background 0.12s; }
        .exp-edit-btn:hover { background: #FEF3C7 !important; border-color: #FCD34D !important; color: #92400E !important; }
        .exp-del-btn:hover  { background: #FEE2E2 !important; border-color: #FCA5A5 !important; color: #991B1B !important; }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .exp-toast { animation: slideUp 0.25s ease; }
        ::placeholder { color: #C4C9D4; }
        textarea { resize: vertical; }
      `}</style>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, maxWidth:380, width:"90%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🗑️</div>
            <h3 style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:8 }}>Delete Experience?</h3>
            <p style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>This will soft-delete the experience. It won't appear to customers.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex:1, padding:"10px 0", borderRadius:8, fontSize:14, fontWeight:600, border:"1.5px solid #E5E7EB", background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                Cancel
              </button>
              <button onClick={handleDelete}
                style={{ flex:1, padding:"10px 0", borderRadius:8, fontSize:14, fontWeight:700, border:"none", background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, maxWidth:460, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h3 style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:2 }}>
                  {editingId ? "Edit Experience" : "Add New Experience"}
                </h3>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>Fill in the details below</p>
              </div>
              <button onClick={resetForm}
                style={{ width:30, height:30, borderRadius:"50%", border:"1.5px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:14, color:"#6B7280" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Title",       name:"title",    type:"text",   placeholder:"e.g. Sunset Boat Tour"  },
                  { label:"Location",    name:"location", type:"text",   placeholder:"e.g. Galle, Sri Lanka"  },
                  { label:"Image URL",   name:"imageUrl", type:"url",    placeholder:"https://..."            },
                  { label:"Price (LKR)", name:"price",    type:"number", placeholder:"e.g. 5000"              },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>
                      {label} <span style={{ color:"#EF4444" }}>*</span>
                    </label>
                    <input style={inp} name={name} type={type} step={name==="price"?"0.01":undefined}
                      placeholder={placeholder} value={formData[name]} onChange={handleInputChange} required />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>
                    Description <span style={{ color:"#EF4444" }}>*</span>
                  </label>
                  <textarea style={{ ...inp, minHeight:90, paddingTop:9 }} name="description"
                    placeholder="Describe this experience..." value={formData.description}
                    onChange={handleInputChange} required />
                </div>
                {formData.imageUrl && (
                  <div style={{ borderRadius:8, overflow:"hidden", maxHeight:140 }}>
                    <img src={formData.imageUrl} alt="Preview"
                      style={{ width:"100%", height:140, objectFit:"cover" }}
                      onError={e => { e.target.style.display="none"; }} />
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button type="button" onClick={resetForm}
                  style={{ flex:1, padding:"10px 0", borderRadius:8, fontSize:14, fontWeight:600, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex:1, padding:"10px 0", borderRadius:8, fontSize:14, fontWeight:700, border:"none", background:`linear-gradient(135deg,${GOLD},#8B6914)`, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                  {editingId ? "Update Experience" : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIXED: Proper flex layout - sidebar + content side by side */}
      <div style={{ display:"flex", width:"100%", minHeight:"100vh", background:"#F0F2F5", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
        <AdminSideBar />

        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"auto" }}>

          {/* Topbar */}
          <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
              <span style={{ color:"#9CA3AF" }}>Admin</span>
              <span style={{ color:"#D1D5DB" }}>›</span>
              <span style={{ color:"#111827", fontWeight:600 }}>Experiences</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD},#8B6914)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>A</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>Admin</div>
            </div>
          </div>

          <div style={{ padding:"28px 32px", flex:1 }}>

            {/* Page header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", marginBottom:4 }}>Experiences</h1>
                <p style={{ fontSize:14, color:"#6B7280" }}>Manage hotel experiences and activities shown to customers.</p>
              </div>
              <button onClick={() => setShowModal(true)}
                style={{ padding:"10px 20px", borderRadius:10, fontSize:14, fontWeight:700, border:"none", background:`linear-gradient(135deg,${GOLD},#8B6914)`, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 2px 8px rgba(201,168,76,0.3)", fontFamily:"inherit" }}>
                + Add Experience
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
              {[
                { label:"Total Experiences", value:experiences.length, border:GOLD },
                { label:"Active",            value:experiences.filter(e=>e.isActive!==false).length, border:"#10B981" },
                { label:"Avg Price (LKR)",   value:experiences.length ? "LKR " + Math.round(experiences.reduce((a,e)=>a+(e.price||0),0)/experiences.length).toLocaleString() : "—", border:"#6366F1" },
              ].map(s => (
                <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)", borderLeft:`4px solid ${s.border}` }}>
                  <div style={{ fontSize:11, color:"#6B7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:"#111827" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{ background:"#fff", borderRadius:16, boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", overflow:"hidden" }}>
              <div style={{ padding:"18px 28px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:GOLD }} />
                <span style={{ fontSize:15, fontWeight:700, color:"#111827" }}>All Experiences</span>
                <span style={{ background:"#F3F4F6", color:"#6B7280", fontSize:12, fontWeight:600, padding:"2px 8px", borderRadius:10, marginLeft:4 }}>{filtered.length}</span>
                <div style={{ marginLeft:"auto", position:"relative" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    style={{ paddingLeft:32, paddingRight:14, paddingTop:7, paddingBottom:7, borderRadius:8, border:"1.5px solid #E5E7EB", background:"#FAFAFA", fontSize:13, width:220, color:"#111827", fontFamily:"inherit", outline:"none" }}
                    placeholder="Search experiences..." value={search} onChange={e => handleSearch(e.target.value)} />
                </div>
              </div>

              {loading ? (
                <div style={{ padding:56, textAlign:"center", color:"#9CA3AF", fontSize:14 }}>Loading experiences...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding:56, textAlign:"center" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🏖️</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#374151", marginBottom:6 }}>No experiences found</div>
                  <div style={{ fontSize:13, color:"#9CA3AF" }}>{search ? "Try a different keyword." : "Add your first experience!"}</div>
                </div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr style={{ background:"#FAFAFA", borderBottom:"1px solid #F3F4F6" }}>
                        {["Image","Title","Location","Price","Description","Actions"].map(h => (
                          <th key={h} style={{ padding:"11px 20px", textAlign:"left", color:"#9CA3AF", fontWeight:700, fontSize:11, letterSpacing:"0.8px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((exp, i) => (
                        <tr key={exp.experienceId} className="exp-row"
                          style={{ background:i%2===0?"#fff":"#FAFAFA", borderBottom:"1px solid #F9FAFB" }}>
                          <td style={{ padding:"12px 20px" }}>
                            <img src={exp.imageUrl} alt={exp.title}
                              style={{ width:72, height:50, objectFit:"cover", borderRadius:8, border:"1px solid #E5E7EB" }}
                              onError={e => { e.target.src="https://via.placeholder.com/72x50?text=No+Image"; }} />
                          </td>
                          <td style={{ padding:"12px 20px", fontWeight:600, color:"#111827", maxWidth:180 }}>{exp.title}</td>
                          <td style={{ padding:"12px 20px", color:"#6B7280" }}>📍 {exp.location || "—"}</td>
                          <td style={{ padding:"12px 20px", fontWeight:700, color:GOLD }}>LKR {(exp.price||0).toLocaleString()}</td>
                          <td style={{ padding:"12px 20px", color:"#6B7280", maxWidth:260, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                            title={exp.description}>{exp.description || "—"}</td>
                          <td style={{ padding:"12px 20px", whiteSpace:"nowrap" }}>
                            <button className="exp-edit-btn" onClick={() => handleEdit(exp)}
                              style={{ fontSize:12, padding:"5px 12px", borderRadius:6, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", cursor:"pointer", marginRight:6, fontFamily:"inherit", fontWeight:500, transition:"all 0.12s" }}>
                              Edit
                            </button>
                            <button className="exp-del-btn" onClick={() => setDeleteId(exp.experienceId)}
                              style={{ fontSize:12, padding:"5px 12px", borderRadius:6, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit", fontWeight:500, transition:"all 0.12s" }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="exp-toast" style={{
          position:"fixed", bottom:28, right:28, zIndex:999, padding:"14px 20px", borderRadius:12,
          fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 8px 24px rgba(0,0,0,0.1)",
          background: toast.type==="error" ? "#FEE2E2" : "#D1FAE5",
          color:       toast.type==="error" ? "#991B1B" : "#065F46",
          border:      `1px solid ${toast.type==="error" ? "#FCA5A5" : "#6EE7B7"}`,
        }}>
          {toast.type==="error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}
    </>
  );
};

export default AdminExperiences;
