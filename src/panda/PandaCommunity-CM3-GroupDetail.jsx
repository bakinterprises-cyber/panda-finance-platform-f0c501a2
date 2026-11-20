import { useState } from "react";

// ============================================================
// 🧱 CM-3 — GROUP DETAIL & CONTRIBUTIONS
// 🏗️  Part of: Panda Community / Vikoba (Module 7)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export GroupDetail from this file
//     Props: { group, currentUser, onBack, onNavigate }
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
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    repeat:       <><polyline points="17 1 21 5 17 9" {...s}/><path d="M3 11V9a4 4 0 0 1 4-4h14" {...s}/><polyline points="7 23 3 19 7 15" {...s}/><path d="M21 13v2a4 4 0 0 1-4 4H3" {...s}/></>,
    vote:         <><path d="M9 11l3 3L22 4" {...s}/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 DEFAULT GROUP — normally passed from CM-1 selection
// ============================================================
const MOCK_GROUP = {
  id:"GRP-001", name:"Umoja Women's Circle", initials:"UW", color:T.purple,
  members:12, myRole:"treasurer", model:"round_robin",
  potBalance:2400000, contributionAmount:200000, frequency:"Monthly",
  nextDueDate:"Jul 15, 2026", nextDueDays:9, currentRound:7, totalRounds:12,
  createdDate:"Jan 2026",
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — MEMBER CONTRIBUTION LIST
// Replace with: supabase.from('vikoba_members')
//   .select('*,user(*),contributions(*)').eq('group_id', group.id)
//   .order('turn_position')
// ============================================================
const MOCK_MEMBERS = [
  { id:1, name:"BAK (You)",      initials:"B",  color:T.blue,   role:"treasurer", turnPosition:4, status:"paid",    trustScore:98 },
  { id:2, name:"Fatuma Hassan",   initials:"FH", color:T.purple, role:"admin",     turnPosition:1, status:"paid",    trustScore:96 },
  { id:3, name:"Amina Juma",      initials:"AJ", color:T.green,  role:"member",    turnPosition:2, status:"paid",    trustScore:91 },
  { id:4, name:"Zawadi Mnyonge",  initials:"ZM", color:T.amber,  role:"member",    turnPosition:3, status:"pending", trustScore:84 },
  { id:5, name:"Grace Nkya",      initials:"GN", color:T.red,    role:"member",    turnPosition:5, status:"pending", trustScore:79 },
  { id:6, name:"Peter Mwangi",    initials:"PM", color:T.teal||T.green, role:"member", turnPosition:6, status:"overdue", trustScore:62 },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — CONTRIBUTION HISTORY (this round)
// Replace with: supabase.from('contributions')
//   .select('*').eq('group_id', group.id).eq('round', group.currentRound)
//   .order('paid_at', { ascending: false })
// ============================================================
const MOCK_HISTORY = [
  { member:"Fatuma Hassan", amount:200000, date:"Jul 1, 2026", method:"Panda Wallet" },
  { member:"Amina Juma",    amount:200000, date:"Jul 2, 2026", method:"Panda Wallet" },
  { member:"BAK (You)",     amount:200000, date:"Jul 3, 2026", method:"Panda Wallet" },
];

const STATUS_CONFIG = {
  paid:     { label:"Paid",     color:T.green, bg:T.greenBg },
  pending:  { label:"Pending",  color:T.amber, bg:T.amberBg },
  overdue:  { label:"Overdue",  color:T.red,   bg:T.redBg   },
};

// ============================================================
// 🧱 MAIN COMPONENT — GroupDetail
// ============================================================
export default function App({
  group    = MOCK_GROUP,
  members  = MOCK_MEMBERS,
  history  = MOCK_HISTORY,
  // 👤 AUTH
  currentUser = { name:"BAK" },

  // 🧭 NAVIGATE
  onBack       = () => {},   // → CM-1 My Groups Dashboard
  onPayNow     = () => {},   // → contribution payment confirmation (💰 WALLET)
  onChat       = () => {},   // → CM-5 Group Chat & Governance
  onCycle      = () => {},   // → CM-4 Rotating Loan/Payout Cycle
  onSettings   = () => {},   // → group settings (admin only)
}) {
  const [tab,          setTab]          = useState("overview"); // overview | members | history
  const [payModal,     setPayModal]     = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const paidCount   = members.filter(m => m.status === "paid").length;
  const collectionPct = Math.round((paidCount/members.length)*100);
  const myStatus       = members.find(m => m.name.includes("You"))?.status;
  const isAdminOrTreasurer = group.myRole === "admin" || group.myRole === "treasurer";

  const confirmPayment = () => {
    setPayModal(false);
    showToast(`${fmt(group.contributionAmount)} contributed to the group pot!`);
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:40,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${T.green}33`, borderLeft:`4px solid ${T.green}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={T.green}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── PAY MODAL ── */}
      {payModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setPayModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", textAlign:"center" }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ width:64, height:64, borderRadius:"50%",
              background:T.goldLight, border:`3px solid ${T.gold}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 16px" }}>
              <Icon name="wallet" size={28} color={T.gold}/>
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Confirm Contribution</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              To {group.name}
            </div>
            <div style={{ fontSize:30, fontWeight:900, color:T.navy,
              fontFamily:"monospace", marginBottom:20 }}>
              {fmt(group.contributionAmount)}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setPayModal(false)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid }}>Cancel</button>
              <button onClick={confirmPayment} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900,
                boxShadow:`0 6px 20px ${T.green}44` }}>Confirm Pay</button>
            </div>
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
          alignItems:"center", marginBottom:16, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onChat} style={{
              width:40, height:40, borderRadius:12,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="message" size={17} color="#fff"/>
            </button>
            {isAdminOrTreasurer && (
              <button onClick={onSettings} style={{
                width:40, height:40, borderRadius:12,
                background:"rgba(255,255,255,0.12)",
                border:"1px solid rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="settings" size={17} color="#fff"/>
              </button>
            )}
          </div>
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"center",
          marginBottom:18, position:"relative" }}>
          <div style={{ width:48, height:48, borderRadius:15, flexShrink:0,
            background:`linear-gradient(135deg,${group.color}33,${group.color}66)`,
            border:"2px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:900, color:"#fff" }}>
            {group.initials}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:900, color:"#fff" }}>
              {group.name}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
              <Icon name="users" size={11} color="rgba(255,255,255,0.6)"/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>
                {group.members} members · {group.model==="round_robin"?"Round-Robin":"Request & Vote"}
              </span>
            </div>
          </div>
        </div>

        {/* Pot balance */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"16px 18px", position:"relative" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:4 }}>GROUP POT BALANCE</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff",
            fontFamily:"monospace", marginBottom:10 }}>{fmt(group.potBalance)}</div>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center" }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>
              This round: {paidCount}/{members.length} paid
            </span>
            <span style={{ fontSize:12, fontWeight:800, color:T.goldMid }}>
              {collectionPct}%
            </span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.15)",
            borderRadius:99, overflow:"hidden", marginTop:6 }}>
            <div style={{ height:"100%", width:`${collectionPct}%`,
              background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,
              borderRadius:99 }}/>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── MY CONTRIBUTION STATUS ── */}
        {myStatus !== "paid" && (
          <div style={{ background:myStatus==="overdue"?T.redBg:T.amberBg,
            border:`1px solid ${myStatus==="overdue"?T.red:T.amber}22`,
            borderRadius:18, padding:"14px 18px", marginBottom:16,
            display:"flex", gap:12, alignItems:"center" }}>
            <Icon name={myStatus==="overdue"?"alertCircle":"clock"} size={20}
              color={myStatus==="overdue"?T.red:T.amber}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:800,
                color:myStatus==="overdue"?T.red:T.amber }}>
                Your contribution is {myStatus==="overdue"?"overdue":"due"}
              </div>
              <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                {fmt(group.contributionAmount)} due — next round starts soon
              </div>
            </div>
            <button onClick={() => setPayModal(true)} style={{
              padding:"9px 16px", borderRadius:12,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:11, fontWeight:800 }}>
              Pay Now
            </button>
          </div>
        )}

        {/* ── ROUND-ROBIN CYCLE CTA ── */}
        <div onClick={onCycle} style={{ background:T.card,
          border:`1px solid ${T.border}`, borderRadius:18,
          padding:"14px 18px", marginBottom:16, cursor:"pointer",
          boxShadow:T.shadow, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:40, height:40, borderRadius:12,
            background:group.model==="round_robin"?T.blueBg:T.purpleBg,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={group.model==="round_robin"?"repeat":"vote"} size={18}
              color={group.model==="round_robin"?T.blue:T.purple}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              {group.model==="round_robin"
                ? `Round ${group.currentRound} of ${group.totalRounds}`
                : "View Loan Requests"}
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              {group.model==="round_robin"
                ? "See whose turn it is to receive the pot"
                : "Review and vote on member requests"}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:T.card, borderRadius:16,
          border:`1px solid ${T.border}`, padding:4, marginBottom:16,
          boxShadow:T.shadow }}>
          {[
            { id:"overview", label:"Overview" },
            { id:"members",  label:"Members"  },
            { id:"history",  label:"History"  },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"9px 0", borderRadius:12, border:"none",
              fontSize:12, fontWeight:tab===t.id?800:600,
              background:tab===t.id ? T.navy : "transparent",
              color:tab===t.id ? "#fff" : T.textMute }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW TAB ══ */}
        {tab === "overview" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:10, marginBottom:16 }}>
              <div style={{ background:T.card, borderRadius:18, padding:"14px",
                border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                <Icon name="wallet" size={15} color={T.green}/>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  marginTop:6, marginBottom:3 }}>PER MEMBER</div>
                <div style={{ fontSize:14, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(group.contributionAmount)}</div>
              </div>
              <div style={{ background:T.card, borderRadius:18, padding:"14px",
                border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                <Icon name="calendar" size={15} color={T.blue}/>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  marginTop:6, marginBottom:3 }}>FREQUENCY</div>
                <div style={{ fontSize:14, fontWeight:900, color:T.navy }}>
                  {group.frequency}
                </div>
              </div>
            </div>

            <div style={{ background:T.card, borderRadius:20, padding:"18px",
              boxShadow:T.shadow, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                marginBottom:14 }}>Group Details</div>
              {[
                { label:"Created",   value:group.createdDate },
                { label:"Next Due",  value:group.nextDueDate },
                { label:"Your Role", value:group.myRole.charAt(0).toUpperCase()+group.myRole.slice(1) },
              ].map((row,i,arr) => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                  <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MEMBERS TAB ══ */}
        {tab === "members" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:22,
              border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
              {members.map((m,i) => {
                const status = STATUS_CONFIG[m.status];
                return (
                  <div key={m.id} style={{ display:"flex", gap:12,
                    alignItems:"center", padding:"13px 16px",
                    borderBottom:i<members.length-1?`1px solid ${T.border}`:"none" }}>
                    <div style={{ width:36, height:36, borderRadius:11, flexShrink:0,
                      background:`linear-gradient(135deg,${m.color}22,${m.color}44)`,
                      border:`2px solid ${m.color}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, fontWeight:900, color:m.color }}>
                      {m.initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                        {m.name}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                        <span style={{ fontSize:10, color:T.textMute,
                          textTransform:"capitalize" }}>{m.role}</span>
                        <div style={{ width:3, height:3, borderRadius:"50%", background:T.border }}/>
                        <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                          <Icon name="star" size={9} color={T.gold}/>
                          <span style={{ fontSize:10, color:T.textMute }}>{m.trustScore}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ background:status.bg, borderRadius:8, padding:"4px 9px" }}>
                      <span style={{ fontSize:10, fontWeight:800, color:status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ HISTORY TAB ══ */}
        {tab === "history" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.textMute,
              textTransform:"uppercase", letterSpacing:0.6, marginBottom:12 }}>
              Round {group.currentRound} Contributions
            </div>
            <div style={{ background:T.card, borderRadius:22,
              border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
              {history.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ fontSize:13, color:T.textMute }}>
                    No contributions recorded yet this round
                  </div>
                </div>
              ) : history.map((h,i) => (
                <div key={i} style={{ display:"flex", gap:12,
                  alignItems:"center", padding:"13px 16px",
                  borderBottom:i<history.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:36, height:36, borderRadius:11, flexShrink:0,
                    background:T.greenBg,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="check" size={16} color={T.green}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                      {h.member}
                    </div>
                    <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                      {h.date} · {h.method}
                    </div>
                  </div>
                  <span style={{ fontSize:12, fontWeight:900, color:T.green,
                    fontFamily:"monospace" }}>{fmt(h.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
