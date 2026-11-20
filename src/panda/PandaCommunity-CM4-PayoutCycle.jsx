import { useState } from "react";

// ============================================================
// 🧱 CM-4 — ROTATING LOAN / PAYOUT CYCLE
// 🏗️  Part of: Panda Community / Vikoba (Module 7)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export PayoutCycle from this file
//     Props: { group, currentUser, onBack, onNavigate }
//     Renders one of two views based on group.model:
//       "round_robin"  → fixed turn order timeline
//       "request_vote" → loan requests + group voting
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
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    thumbsUp:     <><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" {...s}/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" {...s}/></>,
    thumbsDown:   <><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z" {...s}/><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ============================================================
// 🔌 DEFAULT GROUP — normally passed from CM-3
// ============================================================
const MOCK_GROUP = {
  id:"GRP-001", name:"Umoja Women's Circle", model:"round_robin",
  contributionAmount:200000, potBalance:2400000,
  currentRound:7, totalRounds:12,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — ROUND-ROBIN TURN ORDER
// Replace with: supabase.from('vikoba_members')
//   .select('*,user(*)').eq('group_id', group.id).order('turn_position')
// ============================================================
const MOCK_TURN_ORDER = [
  { position:1, name:"Fatuma Hassan",  initials:"FH", color:T.purple, status:"completed", round:1, receivedDate:"Jan 2026" },
  { position:2, name:"Amina Juma",     initials:"AJ", color:T.green,  status:"completed", round:2, receivedDate:"Feb 2026" },
  { position:3, name:"Zawadi Mnyonge", initials:"ZM", color:T.amber,  status:"completed", round:3, receivedDate:"Mar 2026" },
  { position:4, name:"BAK (You)",      initials:"B",  color:T.blue,   status:"upcoming",  round:7, receivedDate:null },
  { position:5, name:"Grace Nkya",     initials:"GN", color:T.red,    status:"waiting",   round:8, receivedDate:null },
  { position:6, name:"Peter Mwangi",   initials:"PM", color:T.green,  status:"waiting",   round:9, receivedDate:null },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — LOAN REQUESTS (request_vote model)
// Replace with: supabase.from('vikoba_requests')
//   .select('*,requester(*),votes(*)').eq('group_id', group.id)
//   .eq('status', 'pending').order('created_at', { ascending: false })
// ============================================================
const MOCK_REQUESTS = [
  {
    id:"REQ-001", requester:"Amina Juma", initials:"AJ", color:T.green,
    amount:400000, reason:"Restocking my shop for the festive season",
    requestedAt:"2 days ago", votesFor:5, votesAgainst:1, totalMembers:8,
    myVote:null, deadline:"2 days left",
  },
  {
    id:"REQ-002", requester:"Zawadi Mnyonge", initials:"ZM", color:T.amber,
    amount:250000, reason:"Medical emergency for my child",
    requestedAt:"5 hours ago", votesFor:6, votesAgainst:0, totalMembers:8,
    myVote:null, deadline:"6 days left",
  },
];

// ============================================================
// 🧱 MAIN COMPONENT — PayoutCycle
// ============================================================
export default function App({
  group    = MOCK_GROUP,
  turnOrder= MOCK_TURN_ORDER,
  requests = MOCK_REQUESTS,
  // 👤 AUTH
  currentUser = { name:"BAK" },

  // 🧭 NAVIGATE
  onBack        = () => {},   // → CM-3 Group Detail
  onNewRequest  = () => {},   // → new loan request form (request_vote model)
}) {
  const [localRequests, setLocalRequests] = useState(requests);
  const [toast,          setToast]         = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔌 BACKEND — cast vote
  // supabase.from('vikoba_votes').insert({ request_id, user_id: currentUser.id, vote })
  const castVote = (reqId, vote) => {
    setLocalRequests(reqs => reqs.map(r => {
      if (r.id !== reqId) return r;
      return {
        ...r, myVote: vote,
        votesFor: vote === "for" ? r.votesFor+1 : r.votesFor,
        votesAgainst: vote === "against" ? r.votesAgainst+1 : r.votesAgainst,
      };
    }));
    showToast(vote === "for" ? "Vote recorded: Approve" : "Vote recorded: Decline", vote==="for"?T.green:T.red);
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
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:30, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
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
          alignItems:"center", marginBottom:8, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:17, fontWeight:900, color:"#fff" }}>
              {group.model === "round_robin" ? "Payout Cycle" : "Loan Requests"}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:2 }}>
              {group.name}
            </div>
          </div>
          <div style={{ width:40 }}/>
        </div>
      </div>

      <div style={{ padding:"20px 20px 0" }}>

        {/* ══ ROUND-ROBIN VIEW ══ */}
        {group.model === "round_robin" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.goldLight, border:`1px solid ${T.gold}33`,
              borderRadius:18, padding:"16px 18px", marginBottom:20,
              textAlign:"center" }}>
              <div style={{ fontSize:11, color:T.textMute, fontWeight:700,
                marginBottom:6 }}>ROUND {group.currentRound} OF {group.totalRounds}</div>
              <div style={{ fontSize:24, fontWeight:900, color:T.gold,
                fontFamily:"monospace" }}>{fmt(group.potBalance)}</div>
              <div style={{ fontSize:11, color:T.textMute, marginTop:4 }}>
                Pot ready for this round's recipient
              </div>
            </div>

            <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
              marginBottom:16 }}>Turn Order</div>

            <div style={{ position:"relative" }}>
              {/* Vertical connector line */}
              <div style={{ position:"absolute", left:19, top:20, bottom:20,
                width:2, background:T.border }}/>

              {turnOrder.map((t, i) => {
                const isCurrent = t.status === "upcoming";
                return (
                  <div key={t.position} style={{ display:"flex", gap:14,
                    marginBottom:i<turnOrder.length-1?18:0, position:"relative" }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", flexShrink:0,
                      background:t.status==="completed" ? T.greenBg :
                        isCurrent ? T.gold : T.navyLight,
                      border:`3px solid ${t.status==="completed" ? T.green :
                        isCurrent ? T.gold : T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      zIndex:1, boxShadow:isCurrent?`0 0 0 4px ${T.gold}22`:"none" }}>
                      {t.status === "completed" ? (
                        <Icon name="check" size={16} color={T.green}/>
                      ) : (
                        <span style={{ fontSize:14, fontWeight:900,
                          color:isCurrent?"#fff":T.textMute }}>{t.position}</span>
                      )}
                    </div>
                    <div style={{ flex:1, background:isCurrent?T.card:"transparent",
                      borderRadius:16, padding:isCurrent?"12px 16px":"6px 0",
                      border:isCurrent?`1.5px solid ${T.gold}33`:"none",
                      boxShadow:isCurrent?T.shadow:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:isCurrent?800:600,
                            color:t.status==="waiting"?T.textMute:T.textMain }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                            {t.status==="completed" ? `Received ${t.receivedDate}` :
                             isCurrent ? "Receiving this round" :
                             `Round ${t.round}`}
                          </div>
                        </div>
                        {isCurrent && (
                          <div style={{ background:T.gold, borderRadius:8,
                            padding:"3px 10px" }}>
                            <span style={{ fontSize:9, fontWeight:900,
                              color:"#fff" }}>YOUR TURN</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {turnOrder.find(t=>t.status==="upcoming")?.name.includes("You") && (
              <button onClick={() => showToast("Payout request sent to treasurer!", T.gold)} style={{
                width:"100%", padding:"16px 0", borderRadius:18, marginTop:24,
                background:`linear-gradient(135deg,${T.gold},#A07008)`,
                border:"none", color:"#fff", fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:`0 6px 20px ${T.gold}44` }}>
                <Icon name="wallet" size={17} color="#fff"/>
                Request My Payout — {fmt(group.potBalance)}
              </button>
            )}
          </div>
        )}

        {/* ══ REQUEST & VOTE VIEW ══ */}
        {group.model === "request_vote" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <button onClick={onNewRequest} style={{
              width:"100%", padding:"15px 0", borderRadius:18, marginBottom:20,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:13, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.gold}44` }}>
              <Icon name="plus" size={16} color="#fff"/>
              Request to Borrow
            </button>

            <div style={{ fontSize:14, fontWeight:900, color:T.textMain,
              marginBottom:14 }}>Pending Requests</div>

            {localRequests.length === 0 ? (
              <div style={{ textAlign:"center", padding:"50px 0" }}>
                <div style={{ fontSize:"40px", marginBottom:10 }}>🗳️</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.textMute }}>
                  No pending requests
                </div>
              </div>
            ) : localRequests.map((r,i) => {
              const totalVotes = r.votesFor + r.votesAgainst;
              const approvalPct = totalVotes > 0 ? Math.round((r.votesFor/totalVotes)*100) : 0;
              const quorumPct     = Math.round((totalVotes/r.totalMembers)*100);
              return (
                <div key={r.id} style={{ background:T.card, borderRadius:22,
                  padding:"18px", marginBottom:14, border:`1px solid ${T.border}`,
                  boxShadow:T.shadow, animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>

                  <div style={{ display:"flex", gap:12, alignItems:"center",
                    marginBottom:12 }}>
                    <div style={{ width:42, height:42, borderRadius:13, flexShrink:0,
                      background:`linear-gradient(135deg,${r.color}22,${r.color}44)`,
                      border:`2px solid ${r.color}33`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:13, fontWeight:900, color:r.color }}>
                      {r.initials}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                        {r.requester}
                      </div>
                      <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>
                        {r.requestedAt} · {r.deadline}
                      </div>
                    </div>
                    <div style={{ fontSize:15, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(r.amount)}</div>
                  </div>

                  <div style={{ background:T.navyLight, borderRadius:12,
                    padding:"10px 14px", marginBottom:14, display:"flex",
                    gap:8, alignItems:"flex-start" }}>
                    <Icon name="fileText" size={13} color={T.textMid}/>
                    <span style={{ fontSize:11, color:T.textMid, lineHeight:1.5 }}>
                      {r.reason}
                    </span>
                  </div>

                  {/* Voting progress */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      marginBottom:6 }}>
                      <span style={{ fontSize:10, color:T.textMute }}>
                        {r.votesFor} for · {r.votesAgainst} against
                      </span>
                      <span style={{ fontSize:10, fontWeight:800, color:T.green }}>
                        {approvalPct}% approval
                      </span>
                    </div>
                    <div style={{ height:7, background:T.redBg, borderRadius:99,
                      overflow:"hidden", display:"flex" }}>
                      <div style={{ height:"100%", width:`${approvalPct}%`,
                        background:`linear-gradient(90deg,${T.green},${T.green}88)` }}/>
                    </div>
                    <div style={{ fontSize:9, color:T.textMute, marginTop:5 }}>
                      {totalVotes}/{r.totalMembers} members voted ({quorumPct}% quorum)
                    </div>
                  </div>

                  {r.myVote ? (
                    <div style={{ background:r.myVote==="for"?T.greenBg:T.redBg,
                      borderRadius:12, padding:"10px 0", textAlign:"center" }}>
                      <span style={{ fontSize:11, fontWeight:800,
                        color:r.myVote==="for"?T.green:T.red }}>
                        You voted to {r.myVote==="for"?"Approve":"Decline"}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => castVote(r.id, "against")} style={{
                        flex:1, padding:"11px 0", borderRadius:14,
                        background:T.redBg, border:`1px solid ${T.red}22`,
                        fontSize:12, fontWeight:800, color:T.red,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                        <Icon name="thumbsDown" size={13} color={T.red}/>
                        Decline
                      </button>
                      <button onClick={() => castVote(r.id, "for")} style={{
                        flex:1, padding:"11px 0", borderRadius:14,
                        background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
                        border:"none", fontSize:12, fontWeight:900, color:"#fff",
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6,
                        boxShadow:`0 4px 14px ${T.green}44` }}>
                        <Icon name="thumbsUp" size={13} color="#fff"/>
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
