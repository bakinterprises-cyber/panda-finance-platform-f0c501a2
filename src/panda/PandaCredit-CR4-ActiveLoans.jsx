import { useState } from "react";

// ============================================================
// 🧱 CR-4 — ACTIVE LOANS
// 🏗️  Part of: Panda Credit (Module 4)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export ActiveLoans from this file
//     Props: { currentUser, onBack, onNavigate }
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
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="7 10 12 15 17 10" {...s}/><line x1="12" y1="15" x2="12" y2="3" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Credit) ─────────────────────────────────
function BottomNav({ active = "loans" }) {
  const items = [
    { id:"home",   icon:"home",       label:"Home"    },
    { id:"loans",  icon:"package",    label:"Loans"   },
    { id:"score",  icon:"creditCard", label:"Score"   },
    { id:"apply",  icon:"fileText",   label:"Apply"   },
    { id:"profile",icon:"user",       label:"Profile" },
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
// 🔌 BACKEND SWAP POINT #1 — ACTIVE & PAST LOANS
// Replace with: supabase.from('loans')
//   .select('*,lender(*),repayment_schedule(*)')
//   .eq('borrower_id', currentUser.id)
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_LOANS = [
  {
    id:"LOAN-2201", lender:"Panda Capital", lenderInitials:"PC", color:T.navy,
    principal:500000, interestRate:8.5, termMonths:6,
    status:"active", disbursedDate:"May 2, 2026",
    totalRepayment:521250, paidSoFar:173750, monthlyPayment:86875,
    nextDueDate:"Jul 2, 2026", nextDueAmount:86875, daysUntilDue:-3, // negative = overdue
    schedule:[
      { month:1, dueDate:"May 2", amount:86875, status:"paid" },
      { month:2, dueDate:"Jun 2", amount:86875, status:"paid" },
      { month:3, dueDate:"Jul 2", amount:86875, status:"overdue" },
      { month:4, dueDate:"Aug 2", amount:86875, status:"upcoming" },
      { month:5, dueDate:"Sep 2", amount:86875, status:"upcoming" },
      { month:6, dueDate:"Oct 2", amount:86875, status:"upcoming" },
    ],
  },
  {
    id:"LOAN-2154", lender:"Panda Agri Fund", lenderInitials:"PA", color:"#0D9488",
    principal:200000, interestRate:6.0, termMonths:3,
    status:"active", disbursedDate:"Jun 10, 2026",
    totalRepayment:203000, paidSoFar:67667, monthlyPayment:67667,
    nextDueDate:"Aug 10, 2026", nextDueAmount:67667, daysUntilDue:36,
    schedule:[
      { month:1, dueDate:"Jul 10", amount:67667, status:"paid" },
      { month:2, dueDate:"Aug 10", amount:67667, status:"upcoming" },
      { month:3, dueDate:"Sep 10", amount:67667, status:"upcoming" },
    ],
  },
  {
    id:"LOAN-1987", lender:"Vikoba Community Fund", lenderInitials:"VK", color:T.purple,
    principal:100000, interestRate:5.0, termMonths:3,
    status:"completed", disbursedDate:"Jan 15, 2026",
    totalRepayment:102500, paidSoFar:102500, monthlyPayment:34167,
    completedDate:"Apr 15, 2026",
    schedule:[
      { month:1, dueDate:"Feb 15", amount:34167, status:"paid" },
      { month:2, dueDate:"Mar 15", amount:34167, status:"paid" },
      { month:3, dueDate:"Apr 15", amount:34167, status:"paid" },
    ],
  },
];

const STATUS_CONFIG = {
  active:    { label:"Active",    color:T.blue,  bg:T.blueBg  },
  completed: { label:"Completed", color:T.green, bg:T.greenBg },
  overdue:   { label:"Overdue",   color:T.red,   bg:T.redBg   },
};

const SCHEDULE_STATUS = {
  paid:     { label:"Paid",     color:T.green, icon:"check"       },
  overdue:  { label:"Overdue",  color:T.red,   icon:"alertCircle" },
  upcoming: { label:"Upcoming", color:T.textMute, icon:"clock"    },
};

// ============================================================
// 🧱 MAIN COMPONENT — ActiveLoans
// ============================================================
export default function App({
  loans = MOCK_LOANS,

  // 🧭 NAVIGATE
  onBack       = () => {},   // → Panda Credit Home
  onPayNow     = () => {},   // → payment confirmation (💰 WALLET)
  onNavigate   = () => {},   // → central navigate(screen), e.g. browse loans
}) {
  const [expandLoan, setExpandLoan] = useState(loans.find(l=>l.status==="active")?.id || null);
  const [payModal,   setPayModal]   = useState(null);
  const [toast,       setToast]      = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const activeLoans    = loans.filter(l => l.status === "active");
  const completedLoans = loans.filter(l => l.status === "completed");
  const totalOwed       = activeLoans.reduce((s,l) => s + (l.totalRepayment - l.paidSoFar), 0);
  const hasOverdue      = activeLoans.some(l => l.daysUntilDue < 0);

  // 🔌 BACKEND — process repayment
  // 💰 WALLET — PandaWallet.pay({ amount, loan_id, memo:'Loan repayment' })
  // supabase.from('loan_payments').insert({ loan_id, amount, paid_at: now() })
  const confirmPayment = (loan) => {
    setPayModal(null);
    showToast(`Payment of ${fmt(loan.nextDueAmount)} sent to ${loan.lender}!`, T.green);
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

      {/* ── PAY NOW MODAL ── */}
      {payModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setPayModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", textAlign:"center",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ width:64, height:64, borderRadius:"50%",
              background:T.goldLight, border:`3px solid ${T.gold}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 16px" }}>
              <Icon name="wallet" size={28} color={T.gold}/>
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:6 }}>Confirm Payment</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              To {payModal.lender}
            </div>
            <div style={{ fontSize:30, fontWeight:900, color:T.navy,
              fontFamily:"monospace", marginBottom:20 }}>
              {fmt(payModal.nextDueAmount)}
            </div>
            <div style={{ background:T.navyLight, borderRadius:14,
              padding:"12px 16px", marginBottom:20,
              display:"flex", alignItems:"center", gap:10, textAlign:"left" }}>
              <Icon name="wallet" size={16} color={T.navy}/>
              <div>
                <div style={{ fontSize:11, color:T.textMute, fontWeight:700 }}>
                  Paying from
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                  Panda Wallet
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setPayModal(null)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid,
              }}>Cancel</button>
              <button onClick={() => confirmPayment(payModal)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900,
                boxShadow:`0 6px 20px ${T.green}44`,
              }}>Confirm Pay</button>
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
              letterSpacing:-0.3 }}>My Loans</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{activeLoans.length} active · {completedLoans.length} completed</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Total owed */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"16px 18px", position:"relative" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:4 }}>TOTAL OUTSTANDING</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff",
            fontFamily:"monospace" }}>{fmt(totalOwed)}</div>
          {hasOverdue && (
            <div style={{ marginTop:10, display:"inline-flex", alignItems:"center",
              gap:6, background:"rgba(192,57,43,0.3)", borderRadius:8,
              padding:"4px 10px" }}>
              <Icon name="alertCircle" size={11} color="#FCA5A5"/>
              <span style={{ fontSize:10, fontWeight:800, color:"#FCA5A5" }}>
                Payment overdue
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── BROWSE MORE LOANS CTA ── */}
        <div onClick={() => onNavigate("loan-marketplace")} style={{
          background:T.goldLight, border:`1px solid ${T.gold}33`,
          borderRadius:18, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}>
          <Icon name="award" size={20} color={T.gold}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
              Need more capital?
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              Browse loan offers matched to your Panda Score
            </div>
          </div>
        </div>

        {/* ── ACTIVE LOANS ── */}
        {activeLoans.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:12 }}>Active Loans</div>
            {activeLoans.map(loan => {
              const isOverdue    = loan.daysUntilDue < 0;
              const isExpanded   = expandLoan === loan.id;
              const progressPct  = Math.round((loan.paidSoFar/loan.totalRepayment)*100);
              return (
                <div key={loan.id} style={{
                  background:T.card, borderRadius:22, marginBottom:14,
                  border:`1.5px solid ${isOverdue ? T.red+"44" : T.border}`,
                  boxShadow:isOverdue ? `0 0 0 3px ${T.red}12` : T.shadow,
                  overflow:"hidden", animation:"fadeUp 0.25s ease" }}>

                  <div onClick={() => setExpandLoan(isExpanded?null:loan.id)}
                    style={{ padding:"16px 18px", cursor:"pointer" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center",
                      marginBottom:14 }}>
                      <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                        background:`linear-gradient(135deg,${loan.color}22,${loan.color}44)`,
                        border:`2px solid ${loan.color}33`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14, fontWeight:900, color:loan.color }}>
                        {loan.lenderInitials}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                          {loan.lender}
                        </div>
                        <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                          {loan.id} · {fmt(loan.principal)} principal
                        </div>
                      </div>
                      <div style={{ background:isOverdue?T.redBg:T.blueBg,
                        borderRadius:8, padding:"3px 9px" }}>
                        <span style={{ fontSize:10, fontWeight:800,
                          color:isOverdue?T.red:T.blue }}>
                          {isOverdue?"Overdue":"Active"}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        marginBottom:5 }}>
                        <span style={{ fontSize:11, color:T.textMute }}>
                          Repaid {fmt(loan.paidSoFar)} of {fmt(loan.totalRepayment)}
                        </span>
                        <span style={{ fontSize:11, fontWeight:800, color:T.green }}>
                          {progressPct}%
                        </span>
                      </div>
                      <div style={{ height:8, background:T.border, borderRadius:99,
                        overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${progressPct}%`,
                          background:`linear-gradient(90deg,${T.green},${T.green}99)`,
                          borderRadius:99, transition:"width 0.6s ease" }}/>
                      </div>
                    </div>

                    {/* Next payment due */}
                    <div style={{ background:isOverdue?T.redBg:T.navyLight,
                      borderRadius:14, padding:"12px 14px",
                      display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:isOverdue?T.red:T.textMute,
                          fontWeight:700 }}>
                          {isOverdue ? "OVERDUE SINCE" : "NEXT PAYMENT DUE"}
                        </div>
                        <div style={{ fontSize:13, fontWeight:800,
                          color:isOverdue?T.red:T.textMain, marginTop:2 }}>
                          {loan.nextDueDate}
                        </div>
                      </div>
                      <div style={{ fontSize:16, fontWeight:900,
                        color:isOverdue?T.red:T.navy, fontFamily:"monospace" }}>
                        {fmt(loan.nextDueAmount)}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop:`1px solid ${T.border}`,
                      animation:"fadeUp 0.2s ease" }}>
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                          textTransform:"uppercase", letterSpacing:0.6, marginBottom:12 }}>
                          Repayment Schedule
                        </div>
                        {loan.schedule.map((s,i) => {
                          const sc = SCHEDULE_STATUS[s.status];
                          return (
                            <div key={s.month} style={{ display:"flex", gap:10,
                              alignItems:"center", padding:"8px 0",
                              borderBottom:i<loan.schedule.length-1?`1px solid ${T.border}`:"none" }}>
                              <div style={{ width:26, height:26, borderRadius:8, flexShrink:0,
                                background:sc.color+"14",
                                display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <span style={{ fontSize:10, fontWeight:900,
                                  color:sc.color }}>{s.month}</span>
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:12, fontWeight:700, color:T.textMain }}>
                                  {s.dueDate}
                                </div>
                              </div>
                              <span style={{ fontSize:12, fontWeight:800, color:T.textMain,
                                fontFamily:"monospace" }}>{fmt(s.amount)}</span>
                              <div style={{ display:"flex", alignItems:"center", gap:4,
                                background:sc.color+"14", borderRadius:7,
                                padding:"3px 8px", minWidth:70, justifyContent:"center" }}>
                                <Icon name={sc.icon} size={10} color={sc.color}/>
                                <span style={{ fontSize:9, fontWeight:800,
                                  color:sc.color }}>{sc.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ padding:"0 18px 16px" }}>
                        <button onClick={() => setPayModal(loan)} style={{
                          width:"100%", padding:"14px 0", borderRadius:16,
                          background:`linear-gradient(135deg,${T.gold},#A07008)`,
                          border:"none", color:"#fff", fontSize:13, fontWeight:900,
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                          boxShadow:`0 6px 20px ${T.gold}44` }}>
                          <Icon name="wallet" size={15} color="#fff"/>
                          Pay {fmt(loan.nextDueAmount)} Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── COMPLETED LOANS ── */}
        {completedLoans.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.textMain,
              marginBottom:12 }}>Completed Loans</div>
            <div style={{ background:T.card, borderRadius:22,
              border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
              {completedLoans.map((loan,i) => (
                <div key={loan.id} style={{ display:"flex", gap:12,
                  alignItems:"center", padding:"14px 16px",
                  borderBottom:i<completedLoans.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                    background:T.greenBg,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="check" size={17} color={T.green}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                      {loan.lender}
                    </div>
                    <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                      Completed {loan.completedDate}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(loan.totalRepayment)}</div>
                    <button onClick={() => showToast("Downloading statement...", T.navy)}
                      style={{ display:"flex", alignItems:"center", gap:3,
                        background:"none", border:"none", marginTop:2 }}>
                      <Icon name="download" size={10} color={T.blue}/>
                      <span style={{ fontSize:9, fontWeight:700,
                        color:T.blue }}>Statement</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loans.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>💳</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No loans yet</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
              Browse the Loan Marketplace to get started
            </div>
            <button onClick={() => onNavigate("loan-marketplace")} style={{
              padding:"12px 24px", borderRadius:14,
              background:T.navy, border:"none", color:"#fff",
              fontSize:12, fontWeight:800 }}>
              Browse Loans
            </button>
          </div>
        )}

      </div>

      <BottomNav active="loans"/>
    </div>
  );
}
