import { useState, useEffect } from "react";

// ============================================================
// 🧱 AUTH-1 — SPLASH SCREEN
// 🏗️  Part of: Panda Finance Auth (built last)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 📦  Assembly: export SplashScreen from this file
//     Props: { onReady, logoUrl, brandLogoUrl }
//     onReady receives "returning" | "new" based on session check
//
// 🖼️ LOGO ASSETS — replace these two swap points with real image
// imports/URLs once assembled into your project:
//   1. logoUrl      → the Panda app icon (navy tile, panda + gold arrow)
//   2. brandLogoUrl  → the BAK compass/mountain mark, shown small
//      in the "Powered by" footer
// ============================================================

const T = {
  navy:    "#0B1F4B",
  navyMid: "#1A3A6E",
  gold:    "#C9960A",
  goldMid: "#F5C842",
};

// ============================================================
// 🔌 BACKEND SWAP POINT — SESSION CHECK
// Replace the simulated timeout with:
// const { data: { session } } = await supabase.auth.getSession()
// onReady(session ? "returning" : "new")
// ============================================================
export default function App({
  onReady      = () => {},
  // 🔌 Replace with real hosted asset URLs or local imports at assembly time
  logoUrl      = null,   // Panda app icon (Image 2 you provided)
  brandLogoUrl = null,   // BAK compass mark (Image 1 you provided)
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          // 🔌 BACKEND — replace with real session check result
          setTimeout(() => onReady("new"), 300);
          return 100;
        }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background:`linear-gradient(160deg,${T.navy} 0%,${T.navyMid} 60%,#0B1F4B 100%)`,
      minHeight:"100vh", maxWidth:430, margin:"0 auto",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", position:"relative", overflow:"hidden",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
    }}>
      <style>{`
        @keyframes bounceIn  { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.08);opacity:1} 100%{transform:scale(1)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
      `}</style>

      {/* Background dot pattern */}
      <div style={{ position:"absolute", inset:0, opacity:0.06,
        backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
        backgroundSize:"22px 22px" }}/>
      <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220,
        borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
      <div style={{ position:"absolute", bottom:-80, left:-80, width:260, height:260,
        borderRadius:"50%", background:"rgba(201,150,10,0.06)" }}/>

      {/* App Logo */}
      <div style={{ position:"relative", textAlign:"center" }}>
        <div style={{
          width:110, height:110, borderRadius:32,
          background: logoUrl ? "transparent" : "rgba(255,255,255,0.1)",
          border: logoUrl ? "none" : "1.5px solid rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:52, margin:"0 auto 24px", overflow:"hidden",
          animation:"bounceIn 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow:"0 12px 40px rgba(0,0,0,0.25)",
        }}>
          {logoUrl ? (
            // 🔌 Real Panda app icon (navy tile / panda head / gold arrow)
            <img src={logoUrl} alt="Panda Finance"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          ) : (
            // Fallback while asset isn't wired up yet
            "🐼"
          )}
        </div>

        <div style={{ fontSize:30, fontWeight:900, color:"#fff",
          letterSpacing:-0.8, marginBottom:8,
          animation:"fadeUp 0.5s ease 0.2s both" }}>
          Panda Finance
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)",
          fontWeight:600, letterSpacing:0.4,
          animation:"fadeUp 0.5s ease 0.35s both" }}>
          Tanzania's AI Financial Operating System
        </div>
      </div>

      {/* Loading bar */}
      <div style={{ position:"absolute", bottom:104, left:0, right:0,
        padding:"0 60px", animation:"fadeUp 0.5s ease 0.5s both" }}>
        <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.15)",
          overflow:"hidden", marginBottom:12 }}>
          <div style={{ height:"100%", width:`${progress}%`,
            background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,
            borderRadius:99, transition:"width 0.15s linear" }}/>
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.45)",
          fontWeight:600, animation:"pulse 1.8s infinite" }}>
          Preparing your financial world...
        </div>
      </div>

      {/* ── "Powered by BAK" footer, small brand mark ── */}
      <div style={{ position:"absolute", bottom:28, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        animation:"fadeUp 0.5s ease 0.65s both" }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)",
          fontWeight:600, letterSpacing:0.3 }}>Powered by</span>
        <div style={{ width:18, height:18, borderRadius:"50%",
          overflow:"hidden", display:"flex", alignItems:"center",
          justifyContent:"center", background: brandLogoUrl ? "transparent" : "rgba(255,255,255,0.12)" }}>
          {brandLogoUrl ? (
            // 🔌 Real BAK compass/mountain mark (Image 1 you provided)
            <img src={brandLogoUrl} alt="BAK"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          ) : (
            <span style={{ fontSize:9, fontWeight:900, color:T.goldMid }}>B</span>
          )}
        </div>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)",
          fontWeight:800, letterSpacing:0.3 }}>BAK</span>
      </div>
    </div>
  );
}
