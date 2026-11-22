import { useState } from "react";

// ============================================================
// 🧱 CM-5 — GROUP CHAT & GOVERNANCE
// 🏗️  Part of: Panda Community / Vikoba (Module 7)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export GroupChatGovernance from this file
//     Props: { group, currentUser, onBack }
//     Two tabs: Chat (real-time discussion) and Governance
//     (admin-only settings — visible read-only to members)
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

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft:    <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    userMinus:    <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="8.5" cy="7" r="4" {...s}/><line x1="23" y1="11" x2="17" y2="11" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
    fileText:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    logOut:       <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...s}/><polyline points="16 17 21 12 16 7" {...s}/><line x1="21" y1="12" x2="9" y2="12" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
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
  id:"GRP-001", name:"Umoja Women's Circle", initials:"UW", color:T.purple,
  myRole:"treasurer", contributionAmount:200000, frequency:"Monthly",
  model:"round_robin", latePenalty:5000, minMembers:5, maxMembers:15,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #1 — CHAT MESSAGES (Realtime)
// Replace with: supabase.from('vikoba_messages')
//   .select('*,sender(*)').eq('group_id', group.id).order('created_at')
// supabase.channel(`vikoba_chat:${group.id}`)
//   .on('postgres_changes', { event:'INSERT', table:'vikoba_messages',
//        filter:`group_id=eq.${group.id}` }, addMessage)
//   .subscribe()
// ============================================================
const MOCK_MESSAGES = [
  { id:1, sender:"Fatuma Hassan", initials:"FH", color:T.purple, isAdmin:true,
    text:"Habari everyone! Reminder that contributions for this round are due Jul 15.", time:"9:02 AM", isMe:false },
  { id:2, sender:"Amina Juma", initials:"AJ", color:T.green, isAdmin:false,
    text:"Nimeshalipa! Paid mine yesterday ✅", time:"9:15 AM", isMe:false },
  { id:3, sender:"BAK (You)", initials:"B", color:T.blue, isAdmin:false,
    text:"Same here, paid this morning via Panda Wallet", time:"10:30 AM", isMe:true },
  { id:4, sender:"Zawadi Mnyonge", initials:"ZM", color:T.amber, isAdmin:false,
    text:"Will pay by tomorrow, apologies for the delay 🙏", time:"11:45 AM", isMe:false },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — GROUP RULES / GOVERNANCE SETTINGS
// Replace with: supabase.from('vikoba_groups')
//   .select('rules,late_penalty,min_members,max_members').eq('id', group.id).single()
// ============================================================
const GROUP_RULES = [
  "Contributions are due on the 1st of each cycle period",
  "Late payments incur a penalty added to the group pot",
  "Payout order follows the agreed turn sequence and cannot be reordered without unanimous vote",
  "Members who miss 2 consecutive contributions may be removed by admin vote",
];

// ============================================================
// 🧱 MAIN COMPONENT — GroupChatGovernance
// ============================================================
export default function App({
  group      = MOCK_GROUP,
  messages   = MOCK_MESSAGES,
  rules      = GROUP_RULES,
  // 👤 AUTH
  currentUser= { name:"BAK", initials:"B" },

  // 🧭 NAVIGATE
  onBack       = () => {},   // → CM-3 Group Detail
  onLeaveGroup = () => {},   // → confirm + leave (non-admin only)
}) {
  const [tab,          setTab]          = useState("chat"); // chat | governance
  const [input,        setInput]        = useState("");
  const [localMessages,setLocalMessages]= useState(messages);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [toast,          setToast]          = useState(null);

  const isAdmin = group.myRole === "admin";

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔌 BACKEND — send message
  // supabase.from('vikoba_messages').insert({
  //   group_id: group.id, sender_id: currentUser.id, text: input
  // })
  const sendMessage = () => {
    if (!input.trim()) return;
    setLocalMessages(m => [...m, {
      id: Date.now(), sender: currentUser.name, initials: currentUser.initials,
      color: T.blue, isAdmin:false, text: input, time:"Now", isMe:true,
    }]);
    setInput("");
  };

  const confirmLeave = () => {
    setShowLeaveModal(false);
    onLeaveGroup();
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column",
      height:"100vh",
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── LEAVE GROUP MODAL ── */}
      {showLeaveModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowLeaveModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)", textAlign:"center" }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ width:64, height:64, borderRadius:"50%",
              background:T.redBg, border:`3px solid ${T.red}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 16px" }}>
              <Icon name="alertTriangle" size={28} color={T.red}/>
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:8 }}>Leave {group.name}?</div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:24, lineHeight:1.7 }}>
              You'll lose your position in the payout rotation. Any funds
              already contributed remain in the group pot.
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowLeaveModal(false)} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:T.navyLight, border:`1px solid ${T.border}`,
                fontSize:13, fontWeight:800, color:T.textMid }}>Cancel</button>
              <button onClick={confirmLeave} style={{
                flex:1, padding:"14px 0", borderRadius:16,
                background:`linear-gradient(135deg,${T.red},#8E2A1E)`,
                border:"none", color:"#fff", fontSize:13, fontWeight:900 }}>
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 16px", position:"relative", overflow:"hidden",
        flexShrink:0,
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
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:`linear-gradient(135deg,${group.color}33,${group.color}66)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:900, color:"#fff" }}>
              {group.initials}
            </div>
            <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>
              {group.name}
            </div>
          </div>
          <div style={{ width:40 }}/>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:6, position:"relative" }}>
          {[
            { id:"chat",       label:"Chat"       },
            { id:"governance", label:"Governance" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"8px 0", borderRadius:11, fontSize:12, fontWeight:800,
              background: tab===t.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
              border: tab===t.id ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.12)",
              color:"#fff",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ══ CHAT TAB ══ */}
      {tab === "chat" && (
        <>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
            {localMessages.map((msg,i) => (
              <div key={msg.id} style={{ display:"flex",
                justifyContent:msg.isMe ? "flex-end" : "flex-start",
                marginBottom:14, animation:"fadeUp 0.2s ease" }}>
                {!msg.isMe && (
                  <div style={{ width:28, height:28, borderRadius:9, flexShrink:0,
                    background:`linear-gradient(135deg,${msg.color}22,${msg.color}44)`,
                    marginRight:8, alignSelf:"flex-end",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:900, color:msg.color }}>
                    {msg.initials}
                  </div>
                )}
                <div style={{ maxWidth:"75%" }}>
                  {!msg.isMe && (
                    <div style={{ display:"flex", alignItems:"center", gap:5,
                      marginBottom:3, marginLeft:2 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:T.textMid }}>
                        {msg.sender}
                      </span>
                      {msg.isAdmin && (
                        <div style={{ background:T.goldLight, borderRadius:5,
                          padding:"0px 5px" }}>
                          <span style={{ fontSize:8, fontWeight:900, color:T.gold }}>
                            ADMIN
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{
                    padding:"10px 14px",
                    borderRadius:msg.isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    background:msg.isMe
                      ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
                      : T.card,
                    color:msg.isMe ? "#fff" : T.textMain,
                    fontSize:13, lineHeight:1.6,
                    border:msg.isMe ? "none" : `1px solid ${T.border}`,
                    boxShadow:T.shadow,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize:9, color:T.textMute, marginTop:3,
                    textAlign:msg.isMe?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div style={{ padding:"12px 20px 20px", borderTop:`1px solid ${T.border}`,
            background:T.white, flexShrink:0,
            display:"flex", gap:10, alignItems:"center" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{ flex:1, background:T.navyLight, border:`1px solid ${T.border}`,
                borderRadius:14, padding:"12px 16px", fontSize:13,
                color:T.textMain, outline:"none" }}/>
            <button onClick={sendMessage} style={{
              width:44, height:44, borderRadius:14, flexShrink:0,
              background:input.trim() ? T.navy : T.navyLight,
              border:input.trim() ? "none" : `1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:input.trim() ? `0 4px 14px ${T.navy}44` : "none" }}>
              <Icon name="send" size={17} color={input.trim() ? "#fff" : T.textMute}/>
            </button>
          </div>
        </>
      )}

      {/* ══ GOVERNANCE TAB ══ */}
      {tab === "governance" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>

          {/* Role badge */}
          <div style={{ background:isAdmin?T.goldLight:T.navyLight,
            border:`1px solid ${isAdmin?T.gold:T.border}33`,
            borderRadius:16, padding:"12px 16px", marginBottom:16,
            display:"flex", gap:10, alignItems:"center" }}>
            <Icon name="shield" size={16} color={isAdmin?T.gold:T.textMute}/>
            <span style={{ fontSize:12, fontWeight:700,
              color:isAdmin?T.gold:T.textMid }}>
              Your role: {group.myRole.charAt(0).toUpperCase()+group.myRole.slice(1)}
              {!isAdmin && " — settings are read-only"}
            </span>
          </div>

          {/* Group settings */}
          <div style={{ background:T.card, borderRadius:20, padding:"18px",
            boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                Group Settings
              </span>
              {isAdmin && (
                <button onClick={() => showToast("Settings editor coming soon", T.navy)}
                  style={{ display:"flex", alignItems:"center", gap:4,
                    background:"none", border:"none" }}>
                  <Icon name="edit" size={13} color={T.navy}/>
                  <span style={{ fontSize:11, fontWeight:700, color:T.navy }}>Edit</span>
                </button>
              )}
            </div>
            {[
              { label:"Contribution",    value:`${new Intl.NumberFormat().format(group.contributionAmount)} TSh` },
              { label:"Frequency",        value:group.frequency },
              { label:"Late Penalty",     value:`${new Intl.NumberFormat().format(group.latePenalty)} TSh` },
              { label:"Member Limit",     value:`${group.minMembers}–${group.maxMembers}` },
              { label:"Payout Model",     value:group.model==="round_robin"?"Round-Robin":"Request & Vote" },
            ].map((row,i,arr) => (
              <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Group rules */}
          <div style={{ background:T.card, borderRadius:20, padding:"18px",
            boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <Icon name="fileText" size={15} color={T.purple}/>
              <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                Group Rules
              </span>
            </div>
            {rules.map((rule,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
                marginBottom:i<rules.length-1?12:0 }}>
                <div style={{ width:20, height:20, borderRadius:6, flexShrink:0,
                  background:T.purpleBg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:900, color:T.purple, marginTop:1 }}>
                  {i+1}
                </div>
                <span style={{ fontSize:11.5, color:T.textMid, lineHeight:1.6 }}>
                  {rule}
                </span>
              </div>
            ))}
          </div>

          {/* Admin-only management actions */}
          {isAdmin && (
            <div style={{ background:T.card, borderRadius:20, padding:"18px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                marginBottom:14 }}>Admin Actions</div>
              {[
                { icon:"userMinus", label:"Manage Members", desc:"Add, remove, or reassign roles" },
                { icon:"award",     label:"Adjust Trust Standing", desc:"Flag members for missed contributions" },
              ].map(action => (
                <div key={action.label} onClick={() => showToast(`${action.label} coming soon`, T.navy)}
                  style={{ display:"flex", gap:12, alignItems:"center",
                    padding:"12px 0", cursor:"pointer" }}>
                  <div style={{ width:36, height:36, borderRadius:11,
                    background:T.navyLight,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={action.icon} size={16} color={T.navy}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain }}>
                      {action.label}
                    </div>
                    <div style={{ fontSize:10, color:T.textMute, marginTop:1 }}>
                      {action.desc}
                    </div>
                  </div>
                  <Icon name="chevronRight" size={14} color={T.textMute}/>
                </div>
              ))}
            </div>
          )}

          {/* Leave group */}
          {!isAdmin && (
            <button onClick={() => setShowLeaveModal(true)} style={{
              width:"100%", padding:"14px 0", borderRadius:16,
              background:T.redBg, border:`1px solid ${T.red}22`,
              fontSize:12, fontWeight:800, color:T.red,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              marginBottom:16 }}>
              <Icon name="logOut" size={15} color={T.red}/>
              Leave Group
            </button>
          )}

        </div>
      )}

    </div>
  );
}
