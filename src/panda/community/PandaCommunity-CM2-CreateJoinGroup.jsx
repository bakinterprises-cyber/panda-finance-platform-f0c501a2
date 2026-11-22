import { useState } from "react";

// ============================================================
// 🧱 CM-2 — CREATE / JOIN GROUP
// 🏗️  Part of: Panda Community / Vikoba (Module 7)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export CreateJoinGroup from this file
//     Props: { currentUser, onBack, onComplete }
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
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    userPlus:     <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="8.5" cy="7" r="4" {...s}/><line x1="20" y1="8" x2="20" y2="14" {...s}/><line x1="23" y1="11" x2="17" y2="11" {...s}/></>,
    repeat:       <><polyline points="17 1 21 5 17 9" {...s}/><path d="M3 11V9a4 4 0 0 1 4-4h14" {...s}/><polyline points="7 23 3 19 7 15" {...s}/><path d="M21 13v2a4 4 0 0 1-4 4H3" {...s}/></>,
    vote:         <><path d="M9 11l3 3L22 4" {...s}/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" {...s}/></>,
    hash:         <><line x1="4" y1="9" x2="20" y2="9" {...s}/><line x1="4" y1="15" x2="20" y2="15" {...s}/><line x1="10" y1="3" x2="8" y2="21" {...s}/><line x1="16" y1="3" x2="14" y2="21" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

const FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly"];

// ============================================================
// 🧱 MAIN COMPONENT — CreateJoinGroup
// ============================================================
export default function App({
  // 👤 AUTH
  currentUser = { name:"BAK" },

  // 🧭 NAVIGATE
  onBack     = () => {},   // → CM-1 My Groups Dashboard
  onComplete = () => {},   // → CM-3 Group Detail (new group) or CM-1 (joined)
}) {
  const [mode,          setMode]          = useState(null); // "create" | "join"
  const [groupName,     setGroupName]     = useState("");
  const [contribution,  setContribution]  = useState(100000);
  const [frequency,     setFrequency]     = useState("Monthly");
  const [maxMembers,    setMaxMembers]    = useState(10);
  const [rotationModel, setRotationModel] = useState("round_robin");
  const [inviteCode,    setInviteCode]    = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [created,        setCreated]       = useState(false);
  const [joinedGroup,    setJoinedGroup]   = useState(null);
  const [toast,          setToast]         = useState(null);

  const showToast = (msg, color = T.red) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔌 BACKEND — create group
  // supabase.from('vikoba_groups').insert({
  //   name: groupName, contribution_amount: contribution, frequency,
  //   max_members: maxMembers, rotation_model: rotationModel,
  //   created_by: currentUser.id, invite_code: generateCode()
  // })
  const createGroup = () => {
    if (!groupName.trim()) { showToast("Please enter a group name"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCreated(true);
    }, 1500);
  };

  // 🔌 BACKEND — join group via invite code
  // supabase.from('vikoba_groups').select('*').eq('invite_code', inviteCode).single()
  // then: supabase.from('vikoba_members').insert({ group_id, user_id: currentUser.id })
  const joinGroup = () => {
    if (!inviteCode.trim() || inviteCode.length < 6) {
      showToast("Please enter a valid invite code");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      // 🔌 Mock resolved group — replace with real Supabase lookup result
      setJoinedGroup({ name:"Umoja Women's Circle", members:12, contribution:200000 });
    }, 1500);
  };

  // ── SUCCESS: GROUP CREATED ──────────────────────────────────────
  if (created) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; } button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.greenBg, border:`3px solid ${T.green}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:40,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Group Created!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24 }}>
          Share this invite code with members to join
        </div>

        <div style={{ background:T.navy, borderRadius:20, padding:"24px",
          marginBottom:20 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
            fontWeight:700, marginBottom:10 }}>INVITE CODE</div>
          <div style={{ fontSize:32, fontWeight:900, color:T.goldMid,
            fontFamily:"monospace", letterSpacing:4 }}>VIK-7X2K</div>
        </div>

        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Group Name",   value:groupName },
            { label:"Contribution", value:`${fmt(contribution)} / ${frequency.toLowerCase()}` },
            { label:"Max Members",  value:maxMembers },
            { label:"Model",         value:rotationModel==="round_robin"?"Round-Robin":"Request & Vote" },
          ].map((row,i,arr) => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
              <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>{row.value}</span>
            </div>
          ))}
        </div>

        <button onClick={onComplete} style={{
          width:"100%", padding:"15px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          boxShadow:`0 6px 20px ${T.navy}44` }}>
          Go to Group
        </button>
      </div>
    </div>
  );

  // ── SUCCESS: JOINED GROUP ──────────────────────────────────────
  if (joinedGroup) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; } button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ width:90, height:90, borderRadius:"50%",
          background:T.blueBg, border:`3px solid ${T.blue}44`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:40,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🤝</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.textMain,
          marginBottom:6 }}>Welcome to the Group!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:24 }}>
          You've joined {joinedGroup.name}
        </div>
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadowMd, marginBottom:20,
          textAlign:"left" }}>
          {[
            { label:"Members",      value:joinedGroup.members },
            { label:"Contribution", value:fmt(joinedGroup.contribution) },
          ].map((row,i,arr) => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
              padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
              <span style={{ fontSize:12, color:T.textMute }}>{row.label}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.textMain }}>{row.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onComplete} style={{
          width:"100%", padding:"15px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          boxShadow:`0 6px 20px ${T.navy}44` }}>
          Go to Group
        </button>
      </div>
    </div>
  );

  // ── MODE SELECTOR ──────────────────────────────────────────────
  if (!mode) return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; } button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>
            Get Started
          </div>
        </div>
      </div>

      <div style={{ padding:"24px 20px" }}>
        <div onClick={() => setMode("create")} style={{
          background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:14,
          display:"flex", gap:14, alignItems:"center", cursor:"pointer",
          animation:"fadeUp 0.25s ease" }}>
          <div style={{ width:52, height:52, borderRadius:16,
            background:T.goldLight,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="users" size={24} color={T.gold}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.textMain,
              marginBottom:3 }}>Create a New Group</div>
            <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5 }}>
              Start your own Vikoba circle and invite members
            </div>
          </div>
        </div>

        <div onClick={() => setMode("join")} style={{
          background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadow,
          display:"flex", gap:14, alignItems:"center", cursor:"pointer",
          animation:"fadeUp 0.3s ease" }}>
          <div style={{ width:52, height:52, borderRadius:16,
            background:T.blueBg,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="userPlus" size={24} color={T.blue}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.textMain,
              marginBottom:3 }}>Join Existing Group</div>
            <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5 }}>
              Enter an invite code from your group admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:40,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", bottom:40, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`, borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px", boxShadow:T.shadowLg,
          whiteSpace:"nowrap", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {submitting && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.9)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
          <div style={{ width:56, height:56, borderRadius:"50%",
            border:`4px solid rgba(255,255,255,0.2)`, borderTopColor:T.gold,
            animation:"spin 1s linear infinite", marginBottom:20 }}/>
          <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
            {mode==="create" ? "Creating your group..." : "Verifying invite code..."}
          </div>
        </div>
      )}

      <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setMode(null)} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>
            {mode === "create" ? "Create Group" : "Join Group"}
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 20px 0" }}>

        {mode === "join" ? (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ background:T.card, borderRadius:24, padding:"24px",
              boxShadow:T.shadow, marginBottom:20, border:`1px solid ${T.border}`,
              textAlign:"center" }}>
              <Icon name="hash" size={32} color={T.blue}/>
              <div style={{ fontSize:13, color:T.textMute, fontWeight:700,
                margin:"14px 0 16px" }}>ENTER INVITE CODE</div>
              <input value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="VIK-XXXX" maxLength={8}
                style={{ width:"100%", textAlign:"center", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"14px 16px", color:T.textMain, fontSize:20,
                  fontWeight:900, fontFamily:"monospace", letterSpacing:3,
                  outline:"none", boxSizing:"border-box" }}/>
            </div>
            <button onClick={joinGroup} style={{
              width:"100%", padding:"16px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.blue},#153A9E)`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.blue}44` }}>
              <Icon name="userPlus" size={17} color="#fff"/>
              Join Group
            </button>
          </div>
        ) : (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                marginBottom:8 }}>Group Name *</div>
              <input value={groupName} onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Umoja Women's Circle"
                style={{ width:"100%", background:T.navyLight,
                  border:`1.5px solid ${T.border}`, borderRadius:14,
                  padding:"12px 16px", color:T.textMain, fontSize:14,
                  outline:"none", boxSizing:"border-box" }}/>
            </div>

            <div style={{ background:T.card, borderRadius:24, padding:"24px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
              textAlign:"center" }}>
              <div style={{ fontSize:12, color:T.textMute, fontWeight:700,
                marginBottom:10 }}>CONTRIBUTION AMOUNT</div>
              <div style={{ fontSize:32, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:16 }}>
                {fmt(contribution)}
              </div>
              <input type="range" min={10000} max={1000000} step={10000}
                value={contribution} onChange={e => setContribution(parseInt(e.target.value))}
                style={{ width:"100%", accentColor:T.gold }}/>
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>Contribution Frequency</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {FREQUENCIES.map(f => (
                <button key={f} onClick={() => setFrequency(f)} style={{
                  flex:1, padding:"11px 0", borderRadius:14,
                  background:frequency===f ? T.navy : T.card,
                  border:frequency===f ? "none" : `1px solid ${T.border}`,
                  color:frequency===f ? "#fff" : T.textMid,
                  fontSize:12, fontWeight:800,
                  boxShadow:frequency===f ? `0 4px 12px ${T.navy}33` : T.shadow,
                }}>{f}</button>
              ))}
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>Maximum Members</div>
            <div style={{ background:T.card, borderRadius:18, padding:"16px",
              boxShadow:T.shadow, marginBottom:16, border:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
              <button onClick={() => setMaxMembers(m => Math.max(3, m-1))} style={{
                width:38, height:38, borderRadius:11, background:T.navyLight,
                border:`1px solid ${T.border}`, fontSize:18, fontWeight:900,
                color:T.red }}>−</button>
              <div style={{ fontSize:22, fontWeight:900, color:T.navy,
                fontFamily:"monospace", minWidth:50, textAlign:"center" }}>
                {maxMembers}
              </div>
              <button onClick={() => setMaxMembers(m => Math.min(30, m+1))} style={{
                width:38, height:38, borderRadius:11, background:T.navyLight,
                border:`1px solid ${T.border}`, fontSize:18, fontWeight:900,
                color:T.green }}>+</button>
            </div>

            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:10 }}>Payout Model</div>
            {[
              { id:"round_robin",  icon:"repeat", label:"Round-Robin",   desc:"Each member takes a fixed turn to receive the pot, in order" },
              { id:"request_vote", icon:"vote",   label:"Request & Vote", desc:"Members request to borrow early; the group votes to approve" },
            ].map(m => (
              <div key={m.id} onClick={() => setRotationModel(m.id)} style={{
                display:"flex", gap:12, alignItems:"center",
                padding:"14px 16px", borderRadius:16, marginBottom:10,
                background:rotationModel===m.id ? T.navyLight : T.card,
                border:`1.5px solid ${rotationModel===m.id ? T.navy+"33" : T.border}`,
                cursor:"pointer", boxShadow:T.shadow }}>
                <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                  background:rotationModel===m.id ? T.navy+"14" : T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={m.icon} size={17}
                    color={rotationModel===m.id ? T.navy : T.textMute}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800,
                    color:rotationModel===m.id?T.navy:T.textMain }}>{m.label}</div>
                  <div style={{ fontSize:10, color:T.textMute, marginTop:2, lineHeight:1.5 }}>
                    {m.desc}
                  </div>
                </div>
                {rotationModel===m.id && <Icon name="check" size={16} color={T.navy}/>}
              </div>
            ))}

            <button onClick={createGroup} style={{
              width:"100%", padding:"16px 0", borderRadius:18, marginTop:8,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.gold}44` }}>
              <Icon name="check" size={17} color="#fff"/>
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
