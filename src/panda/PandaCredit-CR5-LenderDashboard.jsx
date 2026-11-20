import { useState } from "react";

// ============================================================
// 🧱 CR-5 — LENDER DASHBOARD
// 🏗️  Part of: Panda Credit (Module 4)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🤖  AI hooks marked with:            // 🤖 AI
// 📦  Assembly: export LenderDashboard from this file
//     Props: { lenderId, currentUser, onBack, onNavigate }
//     For Panda Capital (isPandaDirect=true), eligible applications
//     can auto-approve — this dashboard still shows them for
//     transparency/audit, but the Approve/Decline buttons are
//     replaced with an "Auto-Approved" status.
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
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Lender) ────────────────────────────────────────
function BottomNav({ active = "queue" }) {
  const items = [
    { id:"home",    icon:"home",       label:"Overview"  },
    { id:"queue",   icon:"fileText",   label:"Applications" },
    { id:"loans",   icon:"package",    label:"Loan Book" },
    { id:"stats",   icon:"barChart",   label:"Analytics" },
    { id:"profile", icon:"user",       label:"Profile"   },
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
        const isActive = item.id === active;
        return (
          <div key={item.id} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, cursor:"pointer", minWidth:44, padding:"4px 0",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize:9.5, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — LENDER PROFILE
// Replace with: supabase.from('lenders').select('*').eq('id', lenderId).single()
// isPandaDirect flags Panda Capital, which auto-approves eligible applications
// ============================================================
const MOCK_LENDER_PANDA = {
  id:"LND-001", name:"Panda Capital", initials:"PC", color:T.navy,
  isPandaDirect:true, walletBalance:48000000,
};
const MOCK_LENDER_BANK = {
  id:"LND-002", name:"CRDB SME Fund", initials:"CR", color:T.green,
  isPandaDirect:false, walletBalance:0,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — INCOMING APPLICATIONS
// Replace with: supabase.from('loan_applications')
//   .select('*,borrower(*),panda_score(*))')
//   .eq('offer_lender_id', lenderId)
//   .order('created_at', { ascending: false })
// 🤖 AI — for Panda Capital: auto-decision logic runs in an Edge
// Function immediately on submission (see calculate-trust-score
// pattern) — applications shown here as already-decided for audit.
// ============================================================
const MOCK_APPLICATIONS = [
  {
    id:"APP-3301", borrower:"Hassan Kimaro", borrowerInitials:"HK", color:T.blue,
    pandaScore:742, tier:"good", amount:500000, purpose:"Inventory Restock",
    termMonths:6, submittedAt:"2 hours ago", status:"auto_approved",
    repaymentHistory:"88% on-time (12 prior loans)",
  },
  {
    id:"APP-3298", borrower:"Amina Tanzani", borrowerInitials:"AT", color:T.purple,
    pandaScore:810, tier:"very_good", amount:1500000, purpose:"Business Expansion",
    termMonths:12, submittedAt:"5 hours ago", status:"pending",
    repaymentHistory:"100% on-time (6 prior loans)",
  },
  {
    id:"APP-3290", borrower:"Peter Mwangi", borrowerInitials:"PM", color:T.green,
    pandaScore:695, tier:"good", amount:800000, purpose:"Equipment Purchase",
    termMonths:12, submittedAt:"Yesterday", status:"pending",
    repaymentHistory:"75% on-time (4 prior loans) — 1 late payment",
  },
  {
    id:"APP-3287", borrower:"Zawadi Salum", borrowerInitials:"ZS", color:T.amber,
    pandaScore:588, tier:"fair", amount:300000, purpose:"Working Capital",
    termMonths:6, submittedAt:"2 days ago", status:"declined",
    repaymentHistory:"60% on-time (3 prior loans) — 2 late payments",
    declineReason:"Score below internal risk threshold for this amount",
  },
];

const STATUS_CONFIG = {
  pending:       { label:"Pending Review", color:T.amber, bg:T.amberBg },
  auto_approved: { label:"Auto-Approved",   color:T.green, bg:T.greenBg },
  approved:      { label:"Approved",        color:T.green, bg:T.greenBg },
  declined:      { label:"Declined",        color:T.red,   bg:T.redBg   },
};

const TIER_COLORS = {
  fair:"#B45309", good:"#1D4ED8", very_good:"#0A7B4B", excellent:"#6D28D9",
};

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — LOAN BOOK / ANALYTICS
// Replace with: supabase.from('loans').select('*').eq('lender_id', lenderId)
// ============================================================
const MOCK_LOAN_BOOK = {
  totalDisbursed: 24500000,
  totalOutstanding: 8200000,
  activeLoans: 34,
  defaultRate: 2.1,
  avgInterestEarned: 9.2,
};

// ============================================================
// 🧱 MAIN COMPONENT — LenderDashboard
// ============================================================
export default function App({
  // 👤 AUTH — swap to real logged-in lender
  lender        = MOCK_LENDER_BANK,
  applications  = MOCK_APPLICATIONS,
  loanBook      = MOCK_LOAN_BOOK,

  // 🧭 NAVIGATE
  onBack        = () => {},
  onMessageBorrower = () => {},   // → chat with borrower for clarification
}) {
  const [filter,       setFilter]       = useState("pending");
  const [expandApp,    setExpandApp]    = useState(null);
  const [toast,        setToast]        = useState(null);
  const [localApps,    setLocalApps]    = useState(applications);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = localApps.filter(a =>
    filter === "all" ||
    (filter === "pending" && a.status === "pending") ||
    (filter === "decided" && a.status !== "pending")
  );

  const pendingCount = localApps.filter(a => a.status === "pending").length;

  // 🔌 BACKEND — supabase.from('loan_applications').update({ status:'approved' }).eq('id', id)
  // Then: supabase.from('loans').insert({...}) to create the active loan
  // 💰 WALLET — PandaWallet.disburse({ amount, borrower_id })
  const approveApplication = (id) => {
    setLocalApps(apps => apps.map(a => a.id===id ? { ...a, status:"approved" } : a));
    showToast("Application approved — funds disbursing to borrower", T.green);
  };

  const declineApplication = (id, reason) => {
    setLocalApps(apps => apps.map(a => a.id===id ? { ...a, status:"declined", declineReason: reason || "Did not meet lending criteria" } : a));
    showToast("Application declined", T.red);
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
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
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
              letterSpacing:-0.3 }}>Lender Dashboard</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{lender.name}</div>
          </div>
          <div style={{ width:40, height:40, borderRadius:12,
            background:`linear-gradient(135deg,${lender.color}44,${lender.color}88)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:900, color:"#fff" }}>
            {lender.initials}
          </div>
        </div>

        {lender.isPandaDirect && (
          <div style={{ background:"rgba(201,150,10,0.2)",
            border:"1px solid rgba(201,150,10,0.4)", borderRadius:14,
            padding:"10px 14px", marginBottom:14, position:"relative",
            display:"flex", gap:8, alignItems:"center" }}>
            <Icon name="zap" size={14} color={T.goldMid}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.goldMid }}>
              Panda Direct — eligible applications auto-approve instantly
            </span>
          </div>
        )}

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          gap:8, position:"relative" }}>
          {[
            { label:"Pending",     value:pendingCount,                          color:T.amber   },
            { label:"Active Loans",value:loanBook.activeLoans,                  color:T.blue    },
            { label:"Default Rate",value:loanBook.defaultRate+"%",              color:T.green   },
          ].map(stat => (
            <div key={stat.label} style={{ background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{stat.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)",
                fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.3, marginTop:3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── LOAN BOOK SUMMARY ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:12, marginBottom:16 }}>
          <div style={{ background:T.card, borderRadius:20, padding:"16px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
            <Icon name="dollarSign" size={16} color={T.green}/>
            <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
              textTransform:"uppercase", marginTop:8, marginBottom:4 }}>
              Total Disbursed
            </div>
            <div style={{ fontSize:15, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(loanBook.totalDisbursed)}</div>
          </div>
          <div style={{ background:T.card, borderRadius:20, padding:"16px",
            border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
            <Icon name="trendingUp" size={16} color={T.blue}/>
            <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
              textTransform:"uppercase", marginTop:8, marginBottom:4 }}>
              Outstanding
            </div>
            <div style={{ fontSize:15, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(loanBook.totalOutstanding)}</div>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {[
            { id:"pending", label:"Pending" },
            { id:"decided", label:"Decided" },
            { id:"all",     label:"All"     },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex:1, padding:"9px 0", borderRadius:12,
              background:filter===f.id ? T.navy : T.card,
              border:filter===f.id ? "none" : `1px solid ${T.border}`,
              color:filter===f.id ? "#fff" : T.textMid,
              fontSize:12, fontWeight:800,
              boxShadow:filter===f.id ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{f.label}</button>
          ))}
        </div>

        {/* ── APPLICATIONS LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>📋</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No applications here</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              New applications will appear here automatically
            </div>
          </div>
        ) : filtered.map((app, i) => {
          const sc         = STATUS_CONFIG[app.status];
          const tierColor  = TIER_COLORS[app.tier] || T.textMute;
          const isExpanded = expandApp === app.id;
          const isPending  = app.status === "pending";
          return (
            <div key={app.id} style={{
              background:T.card, borderRadius:22, marginBottom:14,
              border:`1.5px solid ${isPending ? T.amber+"33" : T.border}`,
              boxShadow:T.shadow, overflow:"hidden",
              animation:`fadeUp 0.25s ease ${i*0.05}s both` }}>

              <div onClick={() => setExpandApp(isExpanded?null:app.id)}
                style={{ padding:"16px 18px", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center",
                  marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                    background:`linear-gradient(135deg,${app.color}22,${app.color}44)`,
                    border:`2px solid ${app.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:app.color }}>
                    {app.borrowerInitials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                      {app.borrower}
                    </div>
                    <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                      {app.id} · {app.submittedAt}
                    </div>
                  </div>
                  <div style={{ background:sc.bg, borderRadius:8, padding:"3px 9px" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8 }}>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="award" size={11} color={tierColor}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{app.pandaScore}</div>
                    <div style={{ fontSize:8, color:T.textMute }}>score</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="dollarSign" size={11} color={T.green}/>
                    <div style={{ fontSize:11, fontWeight:900, color:T.textMain,
                      marginTop:4, fontFamily:"monospace" }}>{fmt(app.amount).replace("TSh ","")}</div>
                    <div style={{ fontSize:8, color:T.textMute }}>requested</div>
                  </div>
                  <div style={{ background:T.bg, borderRadius:10, padding:"8px 10px" }}>
                    <Icon name="clock" size={11} color={T.blue}/>
                    <div style={{ fontSize:12, fontWeight:900, color:T.textMain,
                      marginTop:4 }}>{app.termMonths}mo</div>
                    <div style={{ fontSize:8, color:T.textMute }}>term</div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  animation:"fadeUp 0.2s ease" }}>
                  <div style={{ padding:"14px 18px",
                    borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      padding:"6px 0" }}>
                      <span style={{ fontSize:11, color:T.textMute }}>Purpose</span>
                      <span style={{ fontSize:11, fontWeight:700, color:T.textMain }}>
                        {app.purpose}
                      </span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      padding:"6px 0" }}>
                      <span style={{ fontSize:11, color:T.textMute }}>Repayment History</span>
                      <span style={{ fontSize:11, fontWeight:700, color:T.textMain,
                        textAlign:"right", maxWidth:180 }}>
                        {app.repaymentHistory}
                      </span>
                    </div>
                  </div>

                  {app.status === "declined" && app.declineReason && (
                    <div style={{ padding:"14px 18px",
                      borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ background:T.redBg, border:`1px solid ${T.red}22`,
                        borderRadius:12, padding:"10px 14px",
                        display:"flex", gap:8, alignItems:"flex-start" }}>
                        <Icon name="alertCircle" size={14} color={T.red}/>
                        <span style={{ fontSize:11, color:T.red, lineHeight:1.5 }}>
                          {app.declineReason}
                        </span>
                      </div>
                    </div>
                  )}

                  {app.status === "auto_approved" && (
                    <div style={{ padding:"14px 18px",
                      borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
                        borderRadius:12, padding:"10px 14px",
                        display:"flex", gap:8, alignItems:"center" }}>
                        <Icon name="zap" size={14} color={T.green}/>
                        <span style={{ fontSize:11, color:T.green, fontWeight:700 }}>
                          Auto-approved by Panda AI — score exceeded {app.pandaScore>700?"670":"580"} threshold
                        </span>
                      </div>
                    </div>
                  )}

                  {isPending && (
                    <div style={{ padding:"14px 18px", display:"flex", gap:8 }}>
                      <button onClick={() => onMessageBorrower(app.id)} style={{
                        width:42, height:42, borderRadius:12, flexShrink:0,
                        background:T.navyLight, border:`1px solid ${T.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="message" size={17} color={T.navy}/>
                      </button>
                      <button onClick={() => declineApplication(app.id)} style={{
                        flex:1, height:42, borderRadius:12,
                        background:T.redBg, border:`1px solid ${T.red}22`,
                        fontSize:12, fontWeight:800, color:T.red,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="x" size={14} color={T.red}/>
                        Decline
                      </button>
                      <button onClick={() => approveApplication(app.id)} style={{
                        flex:2, height:42, borderRadius:12,
                        background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                        border:"none", fontSize:12, fontWeight:900, color:"#fff",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6,
                        boxShadow:`0 4px 14px ${T.green}44` }}>
                        <Icon name="check" size={14} color="#fff"/>
                        Approve & Disburse
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

      </div>

      <BottomNav active="queue"/>
    </div>
  );
}
