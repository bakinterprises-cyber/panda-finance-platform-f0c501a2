import { useState } from "react";

// ============================================================
// 🧱 COMING SOON — INSURANCE HUB
// 🏗️  Part of: Panda Finance (Module 8 — teaser only)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 📦  Assembly: export InsuranceHubComingSoon from this file
//     Props: { onBack, onNotifyMe }
// ============================================================

const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
  navyLight: "#EEF2FF",
  gold:      "#C9960A",
  goldMid:   "#F5C842",
  white:     "#FFFFFF",
  bg:        "#F4F6FF",
  card:      "#FFFFFF",
  border:    "#DDE3F5",
  textMain:  "#0B1F4B",
  textMid:   "#3D5A8A",
  textMute:  "#8A9BC0",
  blue:      "#1D4ED8",
  blueBg:    "#EFF6FF",
  blueMid:   "#1E40AF",
  shadow:    "0 2px 16px rgba(11,31,75,0.07)",
  shadowMd:  "0 8px 32px rgba(11,31,75,0.11)",
  shadowLg:  "0 20px 60px rgba(11,31,75,0.16)",
};

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    check:     <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    heart:     <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    leaf:      <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    zap:       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    sparkle:   <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

const UPCOMING_FEATURES = [
  { icon:"heart",      title:"Health Insurance",     desc:"Affordable micro-health cover for you and your family, paid monthly via Panda Wallet" },
  { icon:"leaf",        title:"Crop Insurance",       desc:"Protect your harvest against drought, flood, and pest damage" },
  { icon:"briefcase",  title:"Business Insurance",   desc:"Cover your shop, inventory, and equipment against loss or damage" },
  { icon:"users",       title:"Livestock Insurance",  desc:"Protect your cattle, goats, and poultry — a first for Tanzanian smallholders" },
  { icon:"zap",         title:"Instant Claims via AI", desc:"Photo your claim, let Panda AI assess it, and get paid faster" },
];

// ============================================================
// 🔌 BACKEND SWAP POINT — WAITLIST SIGNUP
// Replace with: supabase.from('module_waitlist').insert({
//   user_id: currentUser.id, module: 'insurance_hub'
// })
// ============================================================
export default function App({
  onBack     = () => {},
  onNotifyMe = () => {},
}) {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    onNotifyMe();
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background:`linear-gradient(160deg,${T.blueMid} 0%,${T.blue} 55%,#153A9E 100%)`,
        padding:"52px 20px 40px", position:"relative", overflow:"hidden",
        borderRadius:"0 0 32px 32px",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.08,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"18px 18px" }}/>
        <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140,
          borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>

        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12,
          background:"rgba(255,255,255,0.15)",
          border:"1px solid rgba(255,255,255,0.25)",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:24, position:"relative" }}>
          <Icon name="arrowLeft" size={18} color="#fff"/>
        </button>

        <div style={{ textAlign:"center", position:"relative" }}>
          <div style={{ fontSize:64, marginBottom:16, animation:"pulse 2.5s ease-in-out infinite",
            display:"inline-block" }}>🛡️</div>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,0.2)",
            border:"1px solid rgba(255,255,255,0.3)", borderRadius:10,
            padding:"5px 14px", marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:900, color:"#fff",
              letterSpacing:0.5 }}>COMING SOON</span>
          </div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff",
            letterSpacing:-0.6, marginBottom:10 }}>Insurance Hub</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.85)",
            lineHeight:1.6, maxWidth:300, margin:"0 auto" }}>
            Protection for what matters — health, harvest, business, and family, all in one place.
          </div>
        </div>
      </div>

      <div style={{ padding:"28px 20px 40px" }}>

        {/* ── WHAT'S COMING ── */}
        <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
          marginBottom:16, textAlign:"center" }}>What's coming</div>

        {UPCOMING_FEATURES.map((f,i) => (
          <div key={f.title} style={{ background:T.card, borderRadius:20,
            padding:"16px 18px", marginBottom:12, border:`1px solid ${T.border}`,
            boxShadow:T.shadow, display:"flex", gap:14, alignItems:"center",
            animation:`fadeUp 0.25s ease ${i*0.07}s both` }}>
            <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
              background:T.blueBg,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name={f.icon} size={21} color={T.blue}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5 }}>
                {f.desc}
              </div>
            </div>
          </div>
        ))}

        {/* ── NOTIFY ME ── */}
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          borderRadius:24, padding:"24px", marginTop:20, textAlign:"center",
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ fontSize:36, marginBottom:10, position:"relative",
            animation:"float 2.5s ease-in-out infinite", display:"inline-block" }}>🐼</div>
          <div style={{ fontSize:15, fontWeight:900, color:"#fff",
            marginBottom:6, position:"relative" }}>
            Be first to know
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)",
            marginBottom:18, lineHeight:1.6, position:"relative" }}>
            Get notified the moment Insurance Hub launches
          </div>
          <button onClick={handleNotify} disabled={notified} style={{
            width:"100%", padding:"14px 0", borderRadius:16, position:"relative",
            background:notified ? "rgba(255,255,255,0.15)" : `linear-gradient(135deg,${T.gold},#A07008)`,
            border:notified ? "1px solid rgba(255,255,255,0.25)" : "none",
            color:"#fff", fontSize:13, fontWeight:900,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:notified ? "none" : `0 6px 20px ${T.gold}44` }}>
            {notified ? (
              <><Icon name="check" size={16} color="#fff"/> You're on the list!</>
            ) : (
              <><Icon name="bell" size={16} color="#fff"/> Notify Me at Launch</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
