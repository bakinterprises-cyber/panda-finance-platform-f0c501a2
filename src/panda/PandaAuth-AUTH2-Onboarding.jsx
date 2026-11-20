import { useState } from "react";

// ============================================================
// 🧱 AUTH-2 — ONBOARDING
// 🏗️  Part of: Panda Finance Auth (built last)
// 🧭  Navigation hooks marked with: // 🧭 NAVIGATE
// 📦  Assembly: export Onboarding from this file
//     Props: { onComplete, onSkip }
// ============================================================

const T = {
  navy:      "#0B1F4B",
  navyMid:   "#1A3A6E",
};

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" {...s}/><polyline points="12 5 19 12 12 19" {...s}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

const SLIDES = [
  {
    emoji:"🐼", color:"#0B1F4B", colorMid:"#1A3A6E",
    title:"Welcome to Panda Finance",
    text:"Tanzania's first all-in-one AI financial operating system — wallet, marketplace, business tools, credit, and investments in one app.",
  },
  {
    emoji:"💰", color:"#0A7B4B", colorMid:"#0A5C3A",
    title:"Save, Send & Shop",
    text:"Manage your Panda Wallet, send money instantly, and shop safely on Panda Marketplace with built-in escrow protection.",
  },
  {
    emoji:"📈", color:"#6D28D9", colorMid:"#4C1D95",
    title:"Grow Your Business",
    text:"Panda Vision AI scans your products and manages inventory automatically. Bookkeeping, invoicing, and cash flow — all in your pocket.",
  },
  {
    emoji:"🏆", color:"#C9960A", colorMid:"#A07008",
    title:"Build Your Panda Score",
    text:"Every good habit — saving, paying on time, trading fairly — builds your Panda Score, unlocking loans and investment opportunities.",
  },
];

// ============================================================
// 🧱 MAIN COMPONENT — Onboarding
// ============================================================
export default function App({
  // 🧭 NAVIGATE
  onComplete = () => {},   // → AUTH-4 Register
  onSkip     = () => {},   // → AUTH-3 Login (existing user)
}) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  const next = () => {
    if (isLast) onComplete();
    else setSlide(s => s + 1);
  };

  return (
    <div style={{
      background:`linear-gradient(160deg,${current.color} 0%,${current.colorMid} 100%)`,
      minHeight:"100vh", maxWidth:430, margin:"0 auto",
      display:"flex", flexDirection:"column",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      position:"relative", overflow:"hidden", transition:"background 0.4s ease",
    }}>
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>

      <div style={{ position:"absolute", inset:0, opacity:0.07,
        backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
        backgroundSize:"20px 20px" }}/>

      {/* Skip button */}
      <div style={{ display:"flex", justifyContent:"flex-end",
        padding:"52px 20px 0", position:"relative" }}>
        <button onClick={onSkip} style={{
          background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
          borderRadius:12, padding:"8px 16px", color:"#fff",
          fontSize:12, fontWeight:700 }}>
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div key={slide} style={{ flex:1, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:"0 32px",
        position:"relative", animation:"fadeSlide 0.4s ease" }}>
        <div style={{ fontSize:90, marginBottom:32,
          animation:"float 3s ease-in-out infinite" }}>{current.emoji}</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#fff",
          textAlign:"center", letterSpacing:-0.5, marginBottom:14,
          lineHeight:1.3 }}>{current.title}</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.8)",
          textAlign:"center", lineHeight:1.7, maxWidth:300 }}>{current.text}</div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding:"20px 28px 44px", position:"relative" }}>
        {/* Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:8,
          marginBottom:28 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{
              width:i===slide ? 24 : 7, height:7, borderRadius:99,
              background:i===slide ? "#fff" : "rgba(255,255,255,0.35)",
              cursor:"pointer", transition:"all 0.3s" }}/>
          ))}
        </div>

        <button onClick={next} style={{
          width:"100%", padding:"16px 0", borderRadius:18,
          background:"#fff", border:"none",
          color:current.color, fontSize:14, fontWeight:900,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:"0 8px 24px rgba(0,0,0,0.15)" }}>
          {isLast ? "Get Started" : "Next"}
          <Icon name="arrowRight" size={16} color={current.color}/>
        </button>
      </div>
    </div>
  );
}
