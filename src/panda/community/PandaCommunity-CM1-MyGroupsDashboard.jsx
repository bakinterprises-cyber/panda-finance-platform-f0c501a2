import { useState } from "react";

// ============================================================
// 🧱 CM-1 — MY GROUPS DASHBOARD
// 🏗️  Part of: Panda Community / Vikoba (Module 7)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export MyGroupsDashboard from this file
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
  teal:      "#0D9488",
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
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" {...s}/><line x1="16" y1="2" x2="16" y2="6" {...s}/><line x1="8" y1="2" x2="8" y2="6" {...s}/><line x1="3" y1="10" x2="21" y2="10" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    alertCircle:  <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Panda Community) ───────────────────────────────
function BottomNav({ active = "groups" }) {
  const items = [
    { id:"home",    icon:"home",   label:"Home"    },
    { id:"groups",  icon:"users",  label:"Groups"   },
    { id:"create",  icon:"plus",   label:""         },
    { id:"score",   icon:"award",  label:"Score"    },
    { id:"profile", icon:"user",   label:"Profile"  },
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
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}` }}>
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
// 🔌 BACKEND SWAP POINT #1 — USER'S VIKOBA GROUPS
// Replace with: supabase.from('vikoba_members')
//   .select('*,group(*))').eq('user_id', currentUser.id)
//   .order('joined_at', { ascending: false })
// ============================================================
const MOCK_GROUPS = [
  {
    id:"GRP-001", name:"Umoja Women's Circle", initials:"UW", color:T.purple,
    members:12, myRole:"treasurer", model:"round_robin",
    potBalance:2400000, myContribution:200000, contributionAmount:200000,
    frequency:"Monthly", nextDueDate:"Jul 15, 2026", nextDueDays:9,
    myTurnPosition:4, totalRounds:12, currentRound:7,
    contributionStatus:"paid",
  },
  {
    id:"GRP-002", name:"Morogoro Traders Sacco", initials:"MT", color:T.teal,
    members:8, myRole:"member", model:"request_vote",
    potBalance:1600000, myContribution:150000, contributionAmount:150000,
    frequency:"Bi-weekly", nextDueDate:"Jul 10, 2026", nextDueDays:4,
    pendingRequests:2,
    contributionStatus:"pending",
  },
  {
    id:"GRP-003", name:"Familia Vikoba Group", initials:"FV", color:T.green,
    members:6, myRole:"admin", model:"round_robin",
    potBalance:900000, myContribution:100000, contributionAmount:100000,
    frequency:"Monthly", nextDueDate:"Jun 28, 2026", nextDueDays:-8,
    myTurnPosition:2, totalRounds:6, currentRound:3,
    contributionStatus:"overdue",
  },
];

const ROLE_CONFIG = {
  admin:     { label:"Admin (Mwenyekiti)", color:T.gold  },
  treasurer: { label:"Treasurer (Mtunza Hela)", color:T.blue  },
  member:    { label:"Member", color:T.textMute },
};

const STATUS_CONFIG = {
  paid:     { label:"Paid",     color:T.green, bg:T.greenBg },
  pending:  { label:"Due Soon", color:T.amber, bg:T.amberBg },
  overdue:  { label:"Overdue",  color:T.red,   bg:T.redBg   },
};

// ============================================================
// 🧱 MAIN COMPONENT — MyGroupsDashboard
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user + groups from Supabase
  currentUser = { name:"BAK", initials:"B" },
  groups      = MOCK_GROUPS,

  // 🧭 NAVIGATE
  onBack        = () => {},   // → Panda Finance Home
  onGroupTap    = () => {},   // → CM-3 Group Detail
  onCreateGroup = () => {},   // → CM-2 Create/Join Group
}) {
  const totalSaved   = groups.reduce((s,g) => s + g.myContribution, 0);
  const totalPot       = groups.reduce((s,g) => s + g.potBalance, 0);
  const overdueCount    = groups.filter(g => g.contributionStatus === "overdue").length;

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.9)} 60%{transform:scale(1.02)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

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
              letterSpacing:-0.3 }}>Panda Community</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{groups.length} Vikoba groups</div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Summary */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"16px 18px", position:"relative" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:4 }}>MY TOTAL CONTRIBUTIONS</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff",
            fontFamily:"monospace", marginBottom:14,
            animation:"bounceIn 0.4s ease" }}>{fmt(totalSaved)}</div>
          <div style={{ display:"flex", gap:16 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>Combined Group Pots</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff",
                fontFamily:"monospace" }}>{fmt(totalPot)}</div>
            </div>
            {overdueCount > 0 && (
              <div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>Overdue</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#FCA5A5" }}>
                  {overdueCount} group{overdueCount>1?"s":""}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── CREATE / JOIN CTA ── */}
        <button onClick={onCreateGroup} style={{
          width:"100%", padding:"16px 0", borderRadius:18, marginBottom:16,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:`0 6px 20px ${T.gold}44` }}>
          <Icon name="plus" size={17} color="#fff"/>
          Create or Join a Group
        </button>

        {/* ── VIKOBA EXPLAINER ── */}
        <div style={{ background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:22, padding:"18px 20px", marginBottom:16,
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ display:"flex", gap:12, alignItems:"center", position:"relative" }}>
            <div style={{ width:44, height:44, borderRadius:14,
              background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="users" size={20} color="#fff"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff", marginBottom:3 }}>
                Digital Vikoba, made simple
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>
                Save together, borrow together — tracked automatically via Panda Wallet
              </div>
            </div>
          </div>
        </div>

        {/* ── MY GROUPS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            letterSpacing:-0.3, marginBottom:12 }}>My Groups</div>

          {groups.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:"48px", marginBottom:12 }}>👥</div>
              <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>No groups yet</div>
              <div style={{ fontSize:13, color:T.textMute }}>
                Create your first Vikoba group or join one with an invite code
              </div>
            </div>
          ) : groups.map((g,i) => {
            const role   = ROLE_CONFIG[g.myRole];
            const status = STATUS_CONFIG[g.contributionStatus];
            const isOverdue = g.contributionStatus === "overdue";
            return (
              <div key={g.id} onClick={() => onGroupTap(g)} style={{
                background:T.card, borderRadius:22, marginBottom:14,
                border:`1.5px solid ${isOverdue ? T.red+"44" : T.border}`,
                boxShadow:isOverdue ? `0 0 0 3px ${T.red}12` : T.shadow,
                overflow:"hidden", cursor:"pointer",
                animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>

                <div style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center",
                    marginBottom:14 }}>
                    <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                      background:`linear-gradient(135deg,${g.color}22,${g.color}44)`,
                      border:`2px solid ${g.color}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, fontWeight:900, color:g.color }}>
                      {g.initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {g.name}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                        <Icon name="users" size={10} color={T.textMute}/>
                        <span style={{ fontSize:10, color:T.textMute }}>
                          {g.members} members
                        </span>
                        <div style={{ width:3, height:3, borderRadius:"50%", background:T.border }}/>
                        <span style={{ fontSize:10, fontWeight:700, color:role.color }}>
                          {role.label}
                        </span>
                      </div>
                    </div>
                    <div style={{ background:status.bg, borderRadius:8, padding:"3px 9px" }}>
                      <span style={{ fontSize:10, fontWeight:800, color:status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Pot balance */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        GROUP POT
                      </div>
                      <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                        fontFamily:"monospace" }}>{fmt(g.potBalance)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        MODEL
                      </div>
                      <div style={{ fontSize:11, fontWeight:700, color:T.textMid,
                        marginTop:3 }}>
                        {g.model === "round_robin" ? "Round-Robin" : "Request & Vote"}
                      </div>
                    </div>
                  </div>

                  {/* Round-robin progress */}
                  {g.model === "round_robin" && (
                    <div style={{ background:T.navyLight, borderRadius:14,
                      padding:"10px 14px", display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:10, color:T.textMute, fontWeight:700 }}>
                          ROUND {g.currentRound} OF {g.totalRounds}
                        </div>
                        <div style={{ fontSize:11, fontWeight:800, color:T.textMain, marginTop:2 }}>
                          Your turn: position #{g.myTurnPosition}
                        </div>
                      </div>
                      <Icon name="calendar" size={16} color={T.navy}/>
                    </div>
                  )}

                  {/* Request & vote pending */}
                  {g.model === "request_vote" && g.pendingRequests > 0 && (
                    <div style={{ background:T.amberBg, borderRadius:14,
                      padding:"10px 14px", display:"flex", gap:8, alignItems:"center" }}>
                      <Icon name="alertCircle" size={14} color={T.amber}/>
                      <span style={{ fontSize:11, fontWeight:700, color:T.amber }}>
                        {g.pendingRequests} loan request{g.pendingRequests>1?"s":""} awaiting your vote
                      </span>
                    </div>
                  )}

                  {/* Next due */}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginTop:12, paddingTop:12,
                    borderTop:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:11, color:isOverdue?T.red:T.textMute,
                      fontWeight:isOverdue?800:500 }}>
                      {isOverdue
                        ? `Overdue by ${Math.abs(g.nextDueDays)} days`
                        : `Next contribution: ${g.nextDueDate}`}
                    </span>
                    <span style={{ fontSize:12, fontWeight:900,
                      color:isOverdue?T.red:T.navy, fontFamily:"monospace" }}>
                      {fmt(g.contributionAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── TRUST NOTE ── */}
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
          borderRadius:16, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:10, alignItems:"center" }}>
          <Icon name="shield" size={16} color={T.green}/>
          <span style={{ fontSize:11, color:T.green, fontWeight:600, lineHeight:1.5 }}>
            Good group repayment history strengthens your Panda Score.
          </span>
        </div>

      </div>

      <BottomNav active="groups"/>
    </div>
  );
}
