import { useState } from "react";

// ============================================================
// 🧱 BRICK 14 — PANDA ESCROW SYSTEM
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export EscrowSystem from this file
//     Props: { currentUser, onBack, onChatParty, onTrackOrder }
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
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    unlock:       <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 9.9-2" {...s}/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    upload:       <><polyline points="16 16 12 12 8 16" {...s}/><line x1="12" y1="12" x2="12" y2="21" {...s}/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" {...s}/></>,
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    rotate:       <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    scale:        <><path d="M16 11c0 5.5-4 8-4 8s-4-2.5-4-8a4 4 0 0 1 8 0z" {...s}/><line x1="12" y1="2" x2="12" y2="5" {...s}/><line x1="2" y1="11" x2="22" y2="11" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "wallet" }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages" },
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"profile",  icon:"user",    label:"Profile"  },
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
        const isCenter = item.id === "create";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.navy}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}`,
          }}>
            <Icon name="plus" size={22} color="#fff"/>
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
// 🔌 BACKEND SWAP POINT #1 — ESCROW PAYMENTS
// Replace with: supabase.from('escrow_payments')
//   .select('*,order(*),buyer(*),seller(*))')
//   .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
//   .order('created_at', { ascending: false })
// Real-time: supabase.channel('escrow_updates')
//   .on('postgres_changes', { event:'UPDATE', table:'escrow_payments',
//        filter:`buyer_id=eq.${currentUser.id}` }, updateEscrow)
//   .subscribe()
// ============================================================
const MOCK_ESCROWS = [
  {
    id:"ESC-882134", orderId:"ORD-882134",
    role:"buyer",
    counterparty:"Tech Master Store", counterpartyInitials:"TM", counterpartyColor:"#1D4ED8",
    product:"iPhone 15 Pro Max 256GB", amount:1650000,
    status:"held", createdAt:"Today, 10:15 AM",
    timeline:[
      { label:"Payment Held",       done:true,  time:"10:15 AM" },
      { label:"Seller Confirmed",   done:true,  time:"10:22 AM" },
      { label:"Order Shipped",      done:true,  time:"11:35 AM" },
      { label:"Awaiting Delivery",  done:false, time:null       },
      { label:"Payment Released",   done:false, time:null       },
    ],
  },
  {
    id:"ESC-881209", orderId:"ORD-881209",
    role:"buyer",
    counterparty:"Fashion Hub", counterpartyInitials:"FH", counterpartyColor:"#6D28D9",
    product:"Designer Handbag Collection", amount:180000,
    status:"released", createdAt:"3 days ago", releasedAt:"2 days ago",
    timeline:[
      { label:"Payment Held",       done:true, time:"Mon 9:00 AM"  },
      { label:"Seller Confirmed",   done:true, time:"Mon 9:30 AM"  },
      { label:"Order Shipped",      done:true, time:"Mon 2:00 PM"  },
      { label:"Delivered",          done:true, time:"Tue 11:00 AM" },
      { label:"Payment Released",   done:true, time:"Tue 11:05 AM" },
    ],
  },
  {
    id:"ESC-880445", orderId:"ORD-880445",
    role:"seller",
    counterparty:"Hassan Kimaro", counterpartyInitials:"HK", counterpartyColor:"#0A7B4B",
    product:"Samsung 65\" 4K TV", amount:1200000,
    status:"held", createdAt:"Yesterday",
    timeline:[
      { label:"Payment Held",       done:true,  time:"Yesterday 3:00 PM" },
      { label:"You Confirmed",      done:true,  time:"Yesterday 3:15 PM" },
      { label:"Order Shipped",      done:true,  time:"Yesterday 5:00 PM" },
      { label:"Awaiting Delivery",  done:false, time:null                },
      { label:"Payment Release",    done:false, time:null                },
    ],
  },
  {
    id:"ESC-879012", orderId:"ORD-879012",
    role:"buyer",
    counterparty:"Home Essentials", counterpartyInitials:"HE", counterpartyColor:"#C9960A",
    product:"Premium Sofa Set 5-Seater", amount:850000,
    status:"disputed", createdAt:"5 days ago",
    disputeReason:"Item arrived damaged — torn fabric on armrest",
    timeline:[
      { label:"Payment Held",       done:true, time:"5 days ago" },
      { label:"Seller Confirmed",   done:true, time:"5 days ago" },
      { label:"Delivered",          done:true, time:"3 days ago" },
      { label:"Dispute Raised",     done:true, time:"2 days ago" },
      { label:"Under Review",       done:false, time:null        },
    ],
  },
  {
    id:"ESC-877654", orderId:"ORD-877654",
    role:"buyer",
    counterparty:"Car Empire", counterpartyInitials:"CE", counterpartyColor:"#C0392B",
    product:"Toyota Harrier 2020 — Deposit", amount:5000000,
    status:"refunded", createdAt:"2 weeks ago", refundedAt:"10 days ago",
    timeline:[
      { label:"Payment Held",   done:true, time:"2 weeks ago" },
      { label:"Buyer Cancelled",done:true, time:"10 days ago" },
      { label:"Refund Approved",done:true, time:"10 days ago" },
      { label:"Refunded",       done:true, time:"10 days ago" },
    ],
  },
];

const STATUS_CONFIG = {
  held:      { label:"Funds Held",   color:T.gold,   bg:T.goldLight, icon:"lock"        },
  released:  { label:"Released",      color:T.green,  bg:T.greenBg,   icon:"unlock"      },
  disputed:  { label:"Disputed",      color:T.red,    bg:T.redBg,     icon:"alertCircle" },
  refunded:  { label:"Refunded",      color:T.textMute,bg:T.navyLight,icon:"rotate"      },
};

const STATUS_TABS = [
  { id:"all",       label:"All"       },
  { id:"held",      label:"Active"    },
  { id:"disputed",  label:"Disputes"  },
  { id:"released",  label:"Completed" },
  { id:"refunded",  label:"Refunded"  },
];

// ============================================================
// 🧱 MAIN COMPONENT — EscrowSystem
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser    = { id:"user-001", name:"BAK" },
  escrows        = MOCK_ESCROWS,

  // 🧭 NAVIGATE
  onBack         = () => {},   // → Brick 16 Wallet Integration / Brick 5
  onChatParty    = () => {},   // → Brick 6 Marketplace Chat
  onTrackOrder   = () => {},   // → Brick 8 Logistics
}) {
  const [activeTab,     setActiveTab]     = useState("all");
  const [expandEscrow,  setExpandEscrow]  = useState(null);
  const [disputeModal,  setDisputeModal]  = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [confirmModal,  setConfirmModal]  = useState(null);
  const [toast,         setToast]         = useState(null);
  const [localEscrows,  setLocalEscrows]  = useState(escrows);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = localEscrows.filter(e =>
    activeTab === "all" || e.status === activeTab
  );

  const totalHeld    = localEscrows.filter(e => e.status==="held").reduce((s,e)=>s+e.amount,0);
  const totalDisputed= localEscrows.filter(e => e.status==="disputed").length;
  const totalReleased= localEscrows.filter(e => e.status==="released").reduce((s,e)=>s+e.amount,0);

  // 🔌 BACKEND — confirm delivery, release escrow
  // 💰 WALLET — PandaWallet.releaseEscrow({ escrow_id })
  const confirmReceived = (escrowId) => {
    setLocalEscrows(es => es.map(e =>
      e.id === escrowId ? { ...e, status:"released" } : e
    ));
    setConfirmModal(null);
    showToast("Delivery confirmed! Payment released to seller.", T.green);
  };

  // 🔌 BACKEND — file dispute
  // supabase.from('escrow_disputes').insert({
  //   escrow_id, raised_by: currentUser.id, reason: disputeReason
  // })
  const submitDispute = () => {
    if (!disputeReason.trim()) { showToast("Please describe the issue", T.red); return; }
    setLocalEscrows(es => es.map(e =>
      e.id === disputeModal.id ? { ...e, status:"disputed", disputeReason } : e
    ));
    setDisputeModal(null);
    setDisputeReason("");
    showToast("Dispute filed. Panda team will review within 24 hours.", T.amber);
  };

  // ── DISPUTE MODAL ──────────────────────────────────────────────
  const DisputeModal = () => (
    <div style={{ position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={() => setDisputeModal(null)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 24px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <Icon name="scale" size={20} color={T.red}/>
          <span style={{ fontSize:18, fontWeight:900, color:T.textMain }}>
            Raise a Dispute
          </span>
        </div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          {disputeModal.product} · {fmt(disputeModal.amount)}
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
            marginBottom:8 }}>What went wrong? *</div>
          <textarea value={disputeReason}
            onChange={e => setDisputeReason(e.target.value)}
            placeholder="Describe the issue — item not received, damaged, not as described, etc."
            rows={4} style={{ width:"100%", background:T.navyLight,
              border:`1.5px solid ${T.border}`, borderRadius:14,
              padding:"12px 16px", color:T.textMain,
              fontSize:13, outline:"none", resize:"none",
              lineHeight:1.6, boxSizing:"border-box" }}/>
        </div>

        {/* Evidence upload */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
            marginBottom:8 }}>Upload Evidence (optional)</div>
          <button onClick={() => showToast("Photo upload coming soon!", T.navy)} style={{
            width:"100%", border:`2px dashed ${T.border}`, borderRadius:16,
            padding:"20px", background:T.navyLight,
            display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          }}>
            <Icon name="camera" size={22} color={T.textMute}/>
            <span style={{ fontSize:12, fontWeight:700, color:T.textMute }}>
              Add photos of the issue
            </span>
          </button>
        </div>

        <div style={{ background:T.amberBg, border:`1px solid ${T.amber}22`,
          borderRadius:14, padding:"12px 16px", marginBottom:20,
          display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="info" size={15} color={T.amber}/>
          <div style={{ fontSize:11, color:T.amber, lineHeight:1.6, fontWeight:600 }}>
            Funds remain safely held in escrow while Panda reviews your dispute. Most disputes are resolved within 24–48 hours.
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setDisputeModal(null)} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:13, fontWeight:800, color:T.textMid,
          }}>Cancel</button>
          <button onClick={submitDispute} style={{
            flex:2, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.red},#8E2A1E)`,
            border:"none", color:"#fff", fontSize:14, fontWeight:900,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.red}44`,
          }}>
            <Icon name="alertCircle" size={16} color="#fff"/>
            Submit Dispute
          </button>
        </div>
      </div>
    </div>
  );

  // ── CONFIRM RECEIVED MODAL ──────────────────────────────────────
  const ConfirmModal = () => (
    <div style={{ position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={() => setConfirmModal(null)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", textAlign:"center",
      }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 24px" }}/>
        <div style={{ width:72, height:72, borderRadius:"50%",
          background:T.greenBg, border:`3px solid ${T.green}33`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 16px" }}>
          <Icon name="unlock" size={32} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
          marginBottom:8 }}>Confirm You Received It?</div>
        <div style={{ fontSize:13, color:T.textMute, lineHeight:1.7, marginBottom:24 }}>
          This will release {fmt(confirmModal.amount)} to {confirmModal.counterparty}. This action cannot be undone.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setConfirmModal(null)} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:13, fontWeight:800, color:T.textMid,
          }}>Cancel</button>
          <button onClick={() => confirmReceived(confirmModal.id)} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            boxShadow:`0 6px 20px ${T.green}44`,
          }}>Yes, Release</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        textarea { font-family:inherit; }
        textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {disputeModal && <DisputeModal/>}
      {confirmModal && <ConfirmModal/>}

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

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
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
              letterSpacing:-0.3 }}>Panda Escrow</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>Every transaction protected</div>
          </div>
          <div style={{ width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield" size={18} color={T.goldMid}/>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          gap:8, position:"relative" }}>
          {[
            { label:"Held",      value:fmt(totalHeld).replace("TSh ",""),     icon:"lock",        color:T.goldMid },
            { label:"Disputes",  value:totalDisputed,                          icon:"alertCircle", color:"#FCA5A5" },
            { label:"Released",  value:fmt(totalReleased).replace("TSh ",""), icon:"unlock",       color:"#4ADE80" },
          ].map(stat => (
            <div key={stat.label} style={{ background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"12px 8px", textAlign:"center" }}>
              <Icon name={stat.icon} size={15} color={stat.color}/>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff",
                fontFamily:"monospace", marginTop:6 }}>{stat.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
                fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.3, marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── HOW ESCROW WORKS (collapsible) ── */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:20, padding:"16px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="shield" size={22} color={T.gold}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:3 }}>
              How Panda Escrow Works
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.5 }}>
              Buyer pays → Panda holds funds → Seller delivers → Buyer confirms → Seller gets paid
            </div>
          </div>
        </div>

        {/* ── STATUS TABS ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto",
          marginBottom:16, paddingBottom:2 }}>
          {STATUS_TABS.map(tab => {
            const count = tab.id === "all"
              ? localEscrows.length
              : localEscrows.filter(e => e.status === tab.id).length;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"7px 14px", borderRadius:99, flexShrink:0,
                background:activeTab===tab.id ? T.navy : T.card,
                border:activeTab===tab.id ? "none" : `1px solid ${T.border}`,
                color:activeTab===tab.id ? "#fff" : T.textMid,
                fontSize:11, fontWeight:700,
                boxShadow:activeTab===tab.id ? `0 4px 12px ${T.navy}33` : T.shadow,
              }}>
                {tab.label}
                {count > 0 && (
                  <div style={{ minWidth:16, height:16, borderRadius:99,
                    background:activeTab===tab.id ? "rgba(255,255,255,0.25)" : T.navyLight,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 4px" }}>
                    <span style={{ fontSize:9, fontWeight:900,
                      color:activeTab===tab.id ? "#fff" : T.textMute }}>{count}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── ESCROW LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>🛡️</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No escrows here</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Transactions will appear here automatically
            </div>
          </div>
        ) : filtered.map(escrow => {
          const sc         = STATUS_CONFIG[escrow.status];
          const isExpanded = expandEscrow === escrow.id;
          return (
            <div key={escrow.id} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${escrow.status==="disputed" ? T.red+"33" : T.border}`,
              boxShadow:T.shadow, overflow:"hidden",
              animation:"fadeUp 0.25s ease",
            }}>
              {/* Header */}
              <div onClick={() => setExpandEscrow(isExpanded?null:escrow.id)}
                style={{ padding:"16px 18px", cursor:"pointer",
                  display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                  background:`linear-gradient(135deg,${escrow.counterpartyColor}22,${escrow.counterpartyColor}44)`,
                  border:`2px solid ${escrow.counterpartyColor}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, fontWeight:900, color:escrow.counterpartyColor }}>
                  {escrow.counterpartyInitials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                        {escrow.counterparty}
                      </span>
                      <div style={{ background:T.navyLight, borderRadius:6,
                        padding:"1px 6px", fontSize:9, fontWeight:800,
                        color:T.textMute, textTransform:"uppercase" }}>
                        {escrow.role === "buyer" ? "Buying" : "Selling"}
                      </div>
                    </div>
                    <span style={{ fontSize:11, color:T.textMute }}>
                      {escrow.createdAt}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:T.textMute,
                    marginBottom:6, overflow:"hidden", textOverflow:"ellipsis",
                    whiteSpace:"nowrap" }}>{escrow.product}</div>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center" }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:sc.bg, borderRadius:8, padding:"3px 8px" }}>
                      <Icon name={sc.icon} size={10} color={sc.color}/>
                      <span style={{ fontSize:10, fontWeight:800,
                        color:sc.color }}>{sc.label}</span>
                    </div>
                    <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(escrow.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  animation:"fadeUp 0.2s ease" }}>

                  {/* Dispute reason (if disputed) */}
                  {escrow.status === "disputed" && escrow.disputeReason && (
                    <div style={{ padding:"14px 18px",
                      borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ background:T.redBg, border:`1px solid ${T.red}22`,
                        borderRadius:14, padding:"12px 16px",
                        display:"flex", gap:10, alignItems:"flex-start" }}>
                        <Icon name="alertCircle" size={15} color={T.red}/>
                        <div>
                          <div style={{ fontSize:11, fontWeight:800, color:T.red,
                            textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
                            Dispute Reason
                          </div>
                          <div style={{ fontSize:12, color:T.red, lineHeight:1.6 }}>
                            {escrow.disputeReason}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div style={{ padding:"16px 18px",
                    borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                      textTransform:"uppercase", letterSpacing:0.6, marginBottom:14 }}>
                      Escrow Timeline
                    </div>
                    {escrow.timeline.map((step, i) => (
                      <div key={step.label} style={{ display:"flex", gap:12,
                        marginBottom:i<escrow.timeline.length-1?14:0 }}>
                        <div style={{ display:"flex", flexDirection:"column",
                          alignItems:"center" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%",
                            flexShrink:0,
                            background: step.done ? T.green : T.navyLight,
                            border:`2px solid ${step.done ? T.green : T.border}`,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {step.done && <Icon name="check" size={12} color="#fff"/>}
                          </div>
                          {i<escrow.timeline.length-1 && (
                            <div style={{ width:2, height:18, marginTop:3,
                              background:step.done ? T.green+"44" : T.border }}/>
                          )}
                        </div>
                        <div style={{ paddingTop:3 }}>
                          <div style={{ fontSize:12, fontWeight:step.done?800:600,
                            color:step.done ? T.textMain : T.textMute }}>
                            {step.label}
                          </div>
                          {step.time && (
                            <div style={{ fontSize:10, color:T.textMute,
                              marginTop:1 }}>{step.time}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ padding:"14px 18px", display:"flex", gap:8 }}>
                    <button onClick={() => onChatParty(escrow.id)} style={{
                      width:42, height:42, borderRadius:12, flexShrink:0,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {/* 🧭 NAVIGATE → Brick 6 Chat */}
                      <Icon name="message" size={17} color={T.navy}/>
                    </button>

                    {escrow.status === "held" && escrow.role === "buyer" && (
                      <>
                        <button onClick={() => setDisputeModal(escrow)} style={{
                          flex:1, height:42, borderRadius:12,
                          background:T.redBg, border:`1px solid ${T.red}22`,
                          fontSize:12, fontWeight:800, color:T.red,
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                        }}>
                          <Icon name="scale" size={14} color={T.red}/>
                          Raise Dispute
                        </button>
                        <button onClick={() => setConfirmModal(escrow)} style={{
                          flex:2, height:42, borderRadius:12,
                          background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                          border:"none", fontSize:12, fontWeight:900, color:"#fff",
                          display:"flex", alignItems:"center",
                          justifyContent:"center", gap:6,
                          boxShadow:`0 4px 14px ${T.green}44`,
                        }}>
                          <Icon name="unlock" size={14} color="#fff"/>
                          Confirm Received
                        </button>
                      </>
                    )}

                    {escrow.status === "held" && escrow.role === "seller" && (
                      <button onClick={() => onTrackOrder(escrow.orderId)} style={{
                        flex:1, height:42, borderRadius:12,
                        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                        border:"none", fontSize:12, fontWeight:900, color:"#fff",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6,
                        boxShadow:`0 4px 14px ${T.navy}44`,
                      }}>
                        {/* 🧭 NAVIGATE → Brick 8 Logistics */}
                        <Icon name="truck" size={14} color="#fff"/>
                        Track Shipment
                      </button>
                    )}

                    {escrow.status === "disputed" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.amberBg, border:`1px solid ${T.amber}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="clock" size={14} color={T.amber}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.amber }}>Panda Reviewing</span>
                      </div>
                    )}

                    {escrow.status === "released" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.greenBg, border:`1px solid ${T.green}22`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="check" size={14} color={T.green}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.green }}>Transaction Complete</span>
                      </div>
                    )}

                    {escrow.status === "refunded" && (
                      <div style={{ flex:1, height:42, borderRadius:12,
                        background:T.navyLight, border:`1px solid ${T.border}`,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="rotate" size={14} color={T.textMute}/>
                        <span style={{ fontSize:12, fontWeight:800,
                          color:T.textMute }}>Fully Refunded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── ZERO FEE NOTICE ── */}
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
          borderRadius:18, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="zap" size={20} color={T.green}/>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:T.green }}>
              Panda-to-Panda Escrow is FREE
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              No fees for buyers or sellers on Panda Wallet transactions
            </div>
          </div>
        </div>

      </div>

      <BottomNav active="wallet"/>
    </div>
  );
}
