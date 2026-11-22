import { useState } from "react";

// ============================================================
// 🧱 BH-4 — INVOICE & PAYMENTS
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export InvoicePayments from this file
//     Props: { businessId, currentUser, onBack, onNavigate }
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
  goldLight: "#FFF8E1",
  white:     "#FFFFFF",
  bg:        "#F4F6FF",
  card:      "#FFFFFF",
  border:    "#DDE3F5",
  textMain:  "#0B1F4B",
  textMid:   "#3D5A8A",
  textMute:  "#8A9BC0",
  green:     "#0A7B4B",
  greenBg:   "#E8F7F0",
  red:       "#C0392B",
  redBg:     "#FDECEA",
  purple:    "#6D28D9",
  purpleBg:  "#F5F3FF",
  blue:      "#1D4ED8",
  blueBg:    "#EFF6FF",
  amber:     "#B45309",
  amberBg:   "#FEF3C7",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" {...s}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...s}/></>,
    trash:        <><polyline points="3 6 5 6 21 6" {...s}/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Business Hub) ─────────────────────────────────
function BottomNav({ active = "home" }) {
  const items = [
    { id:"home",      icon:"home",      label:"Dashboard" },
    { id:"inventory", icon:"grid",      label:"Inventory" },
    { id:"scan",      icon:"camera",    label:""          },
    { id:"reports",   icon:"barChart",  label:"Reports"   },
    { id:"profile",   icon:"user",      label:"Profile"   },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:T.white, borderTop:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-around",
      padding:"8px 0 20px", zIndex:200,
      boxShadow:"0 -4px 24px rgba(11,31,75,0.08)",
    }}>
      {items.map(item => {
        const isCenter = item.id === "scan";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}66`, cursor:"pointer",
            marginTop:-22, border:`3px solid ${T.white}`,
          }}>
            <Icon name="camera" size={22} color="#fff"/>
          </div>
        );
        return (
          <div key={item.id} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, cursor:"pointer", minWidth:44, padding:"4px 0",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize:10, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — INVOICES
// Replace with: supabase.from('invoices')
//   .select('*,client(*)').eq('business_id', businessId)
//   .order('created_at', { ascending: false })
// 🤖 AI — Panda Vision AI can pre-fill invoices from scanned items
// ============================================================
const MOCK_INVOICES = [
  { id:"INV-0044", client:"Zawadi Restaurant Supplies", clientInitials:"ZR", color:"#1D4ED8", amount:520000,  status:"paid",     issuedDate:"2 days ago",  dueDate:"Jul 10", paidDate:"1 day ago" },
  { id:"INV-0043", client:"Morogoro Traders Co.",        clientInitials:"MT", color:"#6D28D9", amount:340000,  status:"overdue",  issuedDate:"12 days ago", dueDate:"Jun 28", paidDate:null         },
  { id:"INV-0042", client:"Kimaro Enterprises",          clientInitials:"KE", color:"#0A7B4B", amount:250000,  status:"pending",  issuedDate:"3 hours ago", dueDate:"Jul 17", paidDate:null         },
  { id:"INV-0041", client:"Fatuma Hardware Ltd",         clientInitials:"FH", color:"#C9960A", amount:1200000, status:"paid",     issuedDate:"5 days ago",  dueDate:"Jul 5",  paidDate:"3 days ago" },
  { id:"INV-0040", client:"Peter Mwangi",                clientInitials:"PM", color:"#C0392B", amount:90000,   status:"overdue",  issuedDate:"15 days ago", dueDate:"Jun 25", paidDate:null         },
];

const STATUS_CONFIG = {
  paid:    { label:"Paid",    color:T.green, bg:T.greenBg, icon:"check"       },
  pending: { label:"Pending", color:T.amber, bg:T.amberBg, icon:"clock"       },
  overdue: { label:"Overdue", color:T.red,   bg:T.redBg,   icon:"alertCircle" },
};

const STATUS_TABS = ["All", "Paid", "Pending", "Overdue"];

// ============================================================
// 🧱 MAIN COMPONENT — InvoicePayments
// ============================================================
export default function App({
  invoices = MOCK_INVOICES,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → BH-1 Dashboard
  onScanCreate  = () => {},   // → Panda Vision AI (pre-fill from scan)
  onNavigate    = () => {},   // → central navigate(screen)
}) {
  const [activeTab,    setActiveTab]    = useState("All");
  const [searchText,   setSearchText]   = useState("");
  const [createModal,  setCreateModal]  = useState(false);
  const [expandInvoice,setExpandInvoice]= useState(null);
  const [toast,        setToast]        = useState(null);
  const [localInvoices,setLocalInvoices]= useState(invoices);

  // New invoice form state
  const [newClient, setNewClient]   = useState("");
  const [newAmount, setNewAmount]   = useState("");
  const [newDueDate,setNewDueDate]  = useState("");
  const [newNote,   setNewNote]     = useState("");

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = localInvoices
    .filter(inv => activeTab === "All" || inv.status === activeTab.toLowerCase())
    .filter(inv => !searchText ||
      inv.client.toLowerCase().includes(searchText.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchText.toLowerCase()));

  const totalPaid    = localInvoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const totalPending = localInvoices.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);
  const totalOverdue = localInvoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);

  // 🔌 BACKEND — create invoice
  // supabase.from('invoices').insert({
  //   business_id, client_name: newClient, amount: newAmount,
  //   due_date: newDueDate, note: newNote, status: 'pending'
  // })
  const createInvoice = () => {
    if (!newClient.trim() || !newAmount) {
      showToast("Please fill in client and amount", T.red);
      return;
    }
    const invoice = {
      id: `INV-00${45+localInvoices.length}`,
      client: newClient, clientInitials: newClient.slice(0,2).toUpperCase(),
      color: T.blue, amount: parseInt(newAmount), status:"pending",
      issuedDate:"Just now", dueDate: newDueDate || "Not set", paidDate:null,
    };
    setLocalInvoices(inv => [invoice, ...inv]);
    setCreateModal(false);
    setNewClient(""); setNewAmount(""); setNewDueDate(""); setNewNote("");
    showToast("Invoice created and ready to send!", T.green);
  };

  // 🔌 BACKEND — send invoice link to client
  // supabase.functions.invoke('send-invoice', { body: { invoice_id, method:'sms'|'whatsapp' } })
  // 💰 WALLET — client pays via link: PandaWallet.requestPayment({ amount, invoice_id })
  const sendInvoice = (invoice) => {
    showToast(`Invoice sent to ${invoice.client}!`, T.blue);
  };

  const markPaid = (id) => {
    // 🔌 BACKEND — supabase.from('invoices').update({ status:'paid', paid_date: now() }).eq('id', id)
    setLocalInvoices(inv => inv.map(i =>
      i.id === id ? { ...i, status:"paid", paidDate:"Just now" } : i
    ));
    showToast("Marked as paid!", T.green);
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── CREATE INVOICE MODAL ── */}
      {createModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setCreateModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
            maxHeight:"85vh", overflowY:"auto",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:20 }}>New Invoice</div>

            {/* Scan shortcut */}
            <div onClick={() => { setCreateModal(false); onScanCreate(); }} style={{
              background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
              borderRadius:16, padding:"12px 16px", marginBottom:20,
              display:"flex", gap:10, alignItems:"center", cursor:"pointer" }}>
              <Icon name="camera" size={18} color="#fff"/>
              <span style={{ fontSize:12, fontWeight:800, color:"#fff", flex:1 }}>
                Or scan items with Panda Vision AI
              </span>
              <Icon name="chevronRight" size={14} color="rgba(255,255,255,0.7)"/>
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Client Name *</div>
              <input value={newClient} onChange={e => setNewClient(e.target.value)}
                placeholder="e.g. Zawadi Restaurant Supplies"
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:14,
                  outline:"none", boxSizing:"border-box" }}/>
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Amount (TSh) *</div>
              <input value={newAmount} onChange={e => setNewAmount(e.target.value.replace(/\D/g,""))}
                placeholder="0"
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:14,
                  fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}/>
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Due Date</div>
              <input value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                placeholder="e.g. Jul 20"
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:14,
                  outline:"none", boxSizing:"border-box" }}/>
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Note (optional)</div>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                rows={3} placeholder="Payment terms, item description..."
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:13,
                  outline:"none", resize:"none", lineHeight:1.6,
                  boxSizing:"border-box" }}/>
            </div>

            <button onClick={createInvoice} style={{
              width:"100%", padding:"15px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.navy}44` }}>
              <Icon name="fileText" size={17} color="#fff"/>
              Create Invoice
            </button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 22px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:18, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Invoices</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{localInvoices.length} total invoices</div>
          </div>
          <button onClick={() => setCreateModal(true)} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="plus" size={18} color="#fff"/>
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          gap:8, position:"relative" }}>
          {[
            { label:"Paid",    value:fmt(totalPaid).replace("TSh ",""),    color:"#4ADE80" },
            { label:"Pending", value:fmt(totalPending).replace("TSh ",""), color:T.goldMid },
            { label:"Overdue", value:fmt(totalOverdue).replace("TSh ",""),color:"#FCA5A5" },
          ].map(stat => (
            <div key={stat.label} style={{ background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:900, color:stat.color,
                fontFamily:"monospace" }}>{stat.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
                fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.3, marginTop:3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── SEARCH ── */}
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:14,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search invoices, clients..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
        </div>

        {/* ── STATUS TABS ── */}
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding:"7px 16px", borderRadius:99,
              background:activeTab===tab ? T.navy : T.card,
              border:activeTab===tab ? "none" : `1px solid ${T.border}`,
              color:activeTab===tab ? "#fff" : T.textMid,
              fontSize:11, fontWeight:700,
              boxShadow:activeTab===tab ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{tab}</button>
          ))}
        </div>

        {/* ── INVOICE LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>🧾</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No invoices found</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Create your first invoice to get started
            </div>
          </div>
        ) : filtered.map(inv => {
          const sc         = STATUS_CONFIG[inv.status];
          const isExpanded = expandInvoice === inv.id;
          return (
            <div key={inv.id} style={{
              background:T.card, borderRadius:20, marginBottom:12,
              border:`1.5px solid ${inv.status==="overdue" ? T.red+"33" : T.border}`,
              boxShadow:T.shadow, overflow:"hidden",
              animation:"fadeUp 0.25s ease",
            }}>
              <div onClick={() => setExpandInvoice(isExpanded?null:inv.id)}
                style={{ padding:"14px 16px", cursor:"pointer",
                  display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:42, height:42, borderRadius:13, flexShrink:0,
                  background:`linear-gradient(135deg,${inv.color}22,${inv.color}44)`,
                  border:`2px solid ${inv.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:900, color:inv.color }}>
                  {inv.clientInitials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{inv.client}</span>
                    <span style={{ fontSize:10, color:T.textMute,
                      flexShrink:0, marginLeft:8 }}>{inv.id}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center" }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:sc.bg, borderRadius:8, padding:"3px 8px" }}>
                      <Icon name={sc.icon} size={10} color={sc.color}/>
                      <span style={{ fontSize:10, fontWeight:800,
                        color:sc.color }}>{sc.label}</span>
                    </div>
                    <span style={{ fontSize:13, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(inv.amount)}</span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  padding:"14px 16px", animation:"fadeUp 0.2s ease" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                    gap:10, marginBottom:14 }}>
                    <div style={{ background:T.bg, borderRadius:12, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        ISSUED
                      </div>
                      <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                        {inv.issuedDate}
                      </div>
                    </div>
                    <div style={{ background:T.bg, borderRadius:12, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        DUE DATE
                      </div>
                      <div style={{ fontSize:12, fontWeight:800,
                        color:inv.status==="overdue"?T.red:T.textMain }}>
                        {inv.dueDate}
                      </div>
                    </div>
                  </div>

                  {inv.status === "paid" && (
                    <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                      borderRadius:12, padding:"10px 14px", marginBottom:14,
                      display:"flex", gap:8, alignItems:"center" }}>
                      <Icon name="check" size={14} color={T.green}/>
                      <span style={{ fontSize:11, fontWeight:700, color:T.green }}>
                        Paid {inv.paidDate} via Panda Wallet
                      </span>
                    </div>
                  )}

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => showToast("Invoice link copied!", T.navy)} style={{
                      width:42, height:42, borderRadius:12, flexShrink:0,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="copy" size={16} color={T.navy}/>
                    </button>
                    {inv.status !== "paid" && (
                      <>
                        <button onClick={() => sendInvoice(inv)} style={{
                          flex:1, height:42, borderRadius:12,
                          background:T.blueBg, border:`1px solid ${T.blue}22`,
                          fontSize:12, fontWeight:800, color:T.blue,
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6 }}>
                          <Icon name="send" size={13} color={T.blue}/>
                          Send
                        </button>
                        <button onClick={() => markPaid(inv.id)} style={{
                          flex:1, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.green}44` }}>
                          <Icon name="check" size={13} color="#fff"/>
                          Mark Paid
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── ESCROW NOTE ── */}
        <div style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
          borderRadius:18, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="shield" size={20} color={T.gold}/>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Clients pay directly via Panda Wallet
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              Instant payment confirmation, no bank delays
            </div>
          </div>
        </div>

      </div>

      <BottomNav active="home"/>
    </div>
  );
}
