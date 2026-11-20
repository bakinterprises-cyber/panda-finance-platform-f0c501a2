import { useState } from "react";

// ============================================================
// 🧱 BRICK 16 — WALLET INTEGRATION
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export WalletIntegration from this file
//     Props: { currentUser, onBack, onTopUp, onFullWallet }
//     Also exports: <WalletWidget/> for embedding in other bricks
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
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...s}/><line x1="1" y1="1" x2="23" y2="23" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    arrowUp:      <><line x1="12" y1="19" x2="12" y2="5" {...s}/><polyline points="5 12 12 5 19 12" {...s}/></>,
    arrowDown:    <><line x1="12" y1="5" x2="12" y2="19" {...s}/><polyline points="19 12 12 19 5 12" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    gift:         <><polyline points="20 12 20 22 4 22 4 12" {...s}/><rect x="2" y="7" width="20" height="5" {...s}/><line x1="12" y1="22" x2="12" y2="7" {...s}/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" {...s}/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" {...s}/></>,
    dollarSign:   <><line x1="12" y1="1" x2="12" y2="23" {...s}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "wallet" }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages" },
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"profile",  icon:"user",    label:"Profile"  },
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
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.navy}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}`,
          }}>
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
// 🔌 BACKEND SWAP POINT #1 — WALLET DATA
// Replace with: PandaWallet.getBalance(currentUser.id)
// supabase.from('wallets').select('*').eq('user_id', currentUser.id).single()
// ============================================================
const MOCK_WALLET = {
  balance:      842500,
  pandaPoints:  3420,
  pointsValue:  34200, // 1 point = TSh 10
  escrowHeld:   1650000,
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — MARKETPLACE TRANSACTIONS
// Replace with: supabase.from('transactions')
//   .select('*').eq('wallet_id', wallet.id)
//   .eq('category', 'marketplace')
//   .order('created_at', { ascending: false }).limit(20)
// ============================================================
const MOCK_TRANSACTIONS = [
  { id:1, type:"purchase",  desc:"iPhone 15 Pro Max — Tech Master Store", amount:-1650000, status:"escrow_held", time:"Today, 10:15 AM", points:165 },
  { id:2, type:"refund",    desc:"Refund — Toyota Harrier Deposit",        amount:5000000,  status:"completed",   time:"10 days ago",     points:0   },
  { id:3, type:"earning",   desc:"Sale — AirPods Pro (your store)",        amount:350000,   status:"completed",   time:"Yesterday",       points:0   },
  { id:4, type:"purchase",  desc:"Designer Handbag — Fashion Hub",          amount:-180000,  status:"released",    time:"3 days ago",      points:18  },
  { id:5, type:"points",    desc:"Panda Points Redeemed",                  amount:-50000,   status:"completed",   time:"5 days ago",      points:-500 },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — SELLER EARNINGS (if user is also a seller)
// Replace with: supabase.from('seller_analytics')
//   .select('total_earnings, this_month, pending_payout')
//   .eq('seller_id', sellerId).single()
// ============================================================
const MOCK_EARNINGS = {
  isSeller:       true,
  totalEarnings:  24850000,
  thisMonth:      4200000,
  pendingPayout:  680000,
};

const TX_CONFIG = {
  purchase: { icon:"package",    color:T.red,   label:"Purchase" },
  refund:   { icon:"refresh",    color:T.blue,  label:"Refund"   },
  earning:  { icon:"dollarSign", color:T.green, label:"Earning"  },
  points:   { icon:"gift",       color:T.gold,  label:"Points"   },
};

const STATUS_LABEL = {
  escrow_held: { label:"In Escrow", color:T.gold  },
  completed:   { label:"Completed", color:T.green },
  released:    { label:"Released",  color:T.green },
};

// ============================================================
// 🧱 EMBEDDABLE WALLET WIDGET
// Use this inside Brick 1 (Homepage) header or any marketplace screen
// for a compact wallet balance display
// ============================================================
export function WalletWidget({
  wallet      = MOCK_WALLET,
  onPress     = () => {},
  compact     = true,
}) {
  return (
    <div onClick={onPress} style={{
      display:"flex", alignItems:"center", gap:8,
      background:T.navyLight, border:`1px solid ${T.border}`,
      borderRadius:14, padding:compact?"8px 14px":"12px 18px",
      cursor:"pointer",
    }}>
      <div style={{ width:28, height:28, borderRadius:9,
        background:`linear-gradient(135deg,${T.gold},#A07008)`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="wallet" size={14} color="#fff"/>
      </div>
      <div>
        <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
          PANDA WALLET
        </div>
        <div style={{ fontSize:13, fontWeight:900, color:T.navy,
          fontFamily:"monospace" }}>{fmt(wallet.balance)}</div>
      </div>
      <Icon name="chevronRight" size={14} color={T.textMute}/>
    </div>
  );
}

// ============================================================
// 🧱 MAIN COMPONENT — WalletIntegration
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser    = { id:"user-001", name:"BAK", initials:"B" },
  wallet         = MOCK_WALLET,
  transactions   = MOCK_TRANSACTIONS,
  earnings       = MOCK_EARNINGS,

  // 🧭 NAVIGATE
  onBack         = () => {},   // → previous screen
  onTopUp        = () => {},   // → PandaWallet top-up flow (M-Pesa)
  onFullWallet   = () => {},   // → Full PandaWallet app
  onWithdraw     = () => {},   // → PandaWallet.withdraw()
  onViewEscrow   = () => {},   // → Brick 14 Escrow System
}) {
  const [showBalance, setShowBalance] = useState(true);
  const [redeemModal, setRedeemModal] = useState(false);
  const [redeemAmt,   setRedeemAmt]   = useState(0);
  const [toast,        setToast]      = useState(null);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const maxRedeemable = Math.min(wallet.pandaPoints, 5000);

  const confirmRedeem = () => {
    if (redeemAmt <= 0) { showToast("Select points to redeem", T.red); return; }
    // 🔌 BACKEND — supabase.functions.invoke('redeem-panda-points', {
    //   body: { user_id: currentUser.id, points: redeemAmt }
    // })
    // 💰 WALLET — PandaWallet.redeemPoints({ points: redeemAmt })
    setRedeemModal(false);
    showToast(`Redeemed ${redeemAmt} points = ${fmt(redeemAmt*10)} credit!`, T.gold);
    setRedeemAmt(0);
  };

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          zIndex:9999, background:T.white,
          border:`1px solid ${toast.color}33`,
          borderLeft:`4px solid ${toast.color}`,
          borderRadius:14, padding:"12px 20px",
          boxShadow:T.shadowLg, whiteSpace:"nowrap",
          animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <Icon name="check" size={14} color={toast.color}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.textMain }}>{toast.msg}</span>
        </div>
      )}

      {/* ── REDEEM POINTS MODAL ── */}
      {redeemModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setRedeemModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <Icon name="gift" size={20} color={T.gold}/>
              <span style={{ fontSize:18, fontWeight:900, color:T.textMain }}>
                Redeem Panda Points
              </span>
            </div>
            <div style={{ fontSize:13, color:T.textMute, marginBottom:24 }}>
              You have {wallet.pandaPoints.toLocaleString()} points · 1 point = TSh 10
            </div>

            {/* Slider-style selector */}
            <div style={{ background:T.navyLight, borderRadius:18,
              padding:"20px", marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:4 }}>
                {redeemAmt.toLocaleString()}
              </div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:16 }}>
                = {fmt(redeemAmt * 10)} wallet credit
              </div>
              <input type="range" min={0} max={maxRedeemable} step={100}
                value={redeemAmt} onChange={e => setRedeemAmt(parseInt(e.target.value))}
                style={{ width:"100%", accentColor:T.gold }}/>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginTop:6 }}>
                <span style={{ fontSize:10, color:T.textMute }}>0</span>
                <span style={{ fontSize:10, color:T.textMute }}>{maxRedeemable.toLocaleString()} max</span>
              </div>
            </div>

            {/* Quick select */}
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {[0.25, 0.5, 0.75, 1].map(pct => (
                <button key={pct} onClick={() => setRedeemAmt(Math.round(maxRedeemable*pct/100)*100)}
                  style={{ flex:1, padding:"8px 0", borderRadius:10,
                    background:T.navyLight, border:`1px solid ${T.border}`,
                    fontSize:11, fontWeight:700, color:T.navy }}>
                  {pct === 1 ? "Max" : `${pct*100}%`}
                </button>
              ))}
            </div>

            <button onClick={confirmRedeem} style={{
              width:"100%", padding:"15px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.gold}44`,
            }}>
              <Icon name="check" size={17} color="#fff"/>
              Confirm Redemption
            </button>
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Marketplace Wallet
        </div>
        <button onClick={onFullWallet} style={{
          display:"flex", alignItems:"center", gap:5,
          padding:"8px 14px", borderRadius:10, background:T.navyLight,
          border:`1px solid ${T.border}`, fontSize:12, fontWeight:700, color:T.navy,
        }}>
          Full Wallet
          <Icon name="chevronRight" size={13} color={T.navy}/>
        </button>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── MAIN BALANCE CARD ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
          borderRadius:26, padding:"24px", marginBottom:14,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"18px 18px" }}/>
          <div style={{ position:"absolute", top:-40, right:-40,
            width:160, height:160, borderRadius:"50%",
            background:"rgba(255,255,255,0.04)" }}/>

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:4, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="wallet" size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{ fontSize:11, fontWeight:700,
                color:"rgba(255,255,255,0.7)" }}>Available Balance</span>
            </div>
            <button onClick={() => setShowBalance(s => !s)} style={{
              background:"none", border:"none" }}>
              <Icon name={showBalance ? "eye" : "eyeOff"} size={16}
                color="rgba(255,255,255,0.6)"/>
            </button>
          </div>

          <div style={{ fontSize:34, fontWeight:900, color:"#fff",
            fontFamily:"monospace", letterSpacing:-1, marginBottom:18,
            position:"relative" }}>
            {/* 💰 WALLET — swap with PandaWallet.getBalance() */}
            {showBalance ? fmt(wallet.balance) : "TSh ••••••••"}
          </div>

          {/* Quick actions */}
          <div style={{ display:"flex", gap:10, position:"relative" }}>
            <button onClick={onTopUp} style={{
              flex:1, padding:"12px 0", borderRadius:14,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:12, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              boxShadow:`0 4px 16px ${T.gold}44`,
            }}>
              <Icon name="plus" size={14} color="#fff"/>
              Top Up
            </button>
            <button onClick={onWithdraw} style={{
              flex:1, padding:"12px 0", borderRadius:14,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              color:"#fff", fontSize:12, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              <Icon name="arrowUp" size={14} color="#fff"/>
              Withdraw
            </button>
            <button onClick={onViewEscrow} style={{
              flex:1, padding:"12px 0", borderRadius:14,
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              color:"#fff", fontSize:12, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              <Icon name="shield" size={14} color="#fff"/>
              Escrow
            </button>
          </div>
        </div>

        {/* ── ESCROW + POINTS ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:10, marginBottom:16 }}>
          {/* Escrow held */}
          <div onClick={onViewEscrow} style={{ background:T.card, borderRadius:20,
            padding:"16px", border:`1px solid ${T.border}`, boxShadow:T.shadow,
            cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:T.goldLight,
              display:"flex", alignItems:"center", justifyContent:"center",
              marginBottom:10 }}>
              <Icon name="lock" size={15} color={T.gold}/>
            </div>
            <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
              Escrow Held
            </div>
            <div style={{ fontSize:15, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(wallet.escrowHeld)}</div>
          </div>
          {/* Panda Points */}
          <div onClick={() => setRedeemModal(true)} style={{ background:T.card, borderRadius:20,
            padding:"16px", border:`1px solid ${T.border}`, boxShadow:T.shadow,
            cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:T.purpleBg,
              display:"flex", alignItems:"center", justifyContent:"center",
              marginBottom:10 }}>
              <Icon name="gift" size={15} color={T.purple}/>
            </div>
            <div style={{ fontSize:10, color:T.textMute, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
              Panda Points
            </div>
            <div style={{ fontSize:15, fontWeight:900, color:T.purple,
              fontFamily:"monospace" }}>{wallet.pandaPoints.toLocaleString()}</div>
          </div>
        </div>

        {/* ── SELLER EARNINGS (if seller) ── */}
        {earnings.isSeller && (
          <div style={{ background:`linear-gradient(135deg,${T.green},#0A5C3A)`,
            borderRadius:22, padding:"18px 20px", marginBottom:16,
            position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, opacity:0.06,
              backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
              backgroundSize:"16px 16px" }}/>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:14, position:"relative" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Icon name="award" size={17} color="#fff"/>
                <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>
                  Marketplace Earnings
                </span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:10, position:"relative" }}>
              <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:12,
                padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)",
                  fontWeight:700, marginBottom:3 }}>THIS MONTH</div>
                <div style={{ fontSize:14, fontWeight:900, color:"#fff",
                  fontFamily:"monospace" }}>{fmt(earnings.thisMonth)}</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:12,
                padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)",
                  fontWeight:700, marginBottom:3 }}>PENDING PAYOUT</div>
                <div style={{ fontSize:14, fontWeight:900, color:T.goldMid,
                  fontFamily:"monospace" }}>{fmt(earnings.pendingPayout)}</div>
              </div>
            </div>
            <div style={{ marginTop:12, paddingTop:12,
              borderTop:"1px solid rgba(255,255,255,0.15)",
              display:"flex", justifyContent:"space-between",
              alignItems:"center", position:"relative" }}>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>
                Total Lifetime Earnings
              </span>
              <span style={{ fontSize:14, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{fmt(earnings.totalEarnings)}</span>
            </div>
          </div>
        )}

        {/* ── PANDA-TO-PANDA FREE BANNER ── */}
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
          borderRadius:18, padding:"14px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center" }}>
          <Icon name="zap" size={20} color={T.green}/>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:T.green }}>
              Pay sellers instantly with Panda Wallet
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              Zero fees on Panda-to-Panda escrow payments
            </div>
          </div>
        </div>

        {/* ── MARKETPLACE TRANSACTIONS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:16, fontWeight:900, color:T.textMain,
              letterSpacing:-0.3 }}>Marketplace Activity</span>
            <button onClick={onFullWallet} style={{
              background:"none", border:"none",
              fontSize:12, fontWeight:700, color:T.navy }}>
              See All
            </button>
          </div>
          <div style={{ background:T.card, borderRadius:22,
            border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden" }}>
            {transactions.map((tx, i) => {
              const cfg    = TX_CONFIG[tx.type];
              const status = STATUS_LABEL[tx.status];
              const isCredit = tx.amount > 0;
              return (
                <div key={tx.id} style={{ display:"flex", gap:12,
                  alignItems:"center", padding:"14px 16px",
                  borderBottom:i<transactions.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
                    background:cfg.color+"14",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={cfg.icon} size={18} color={cfg.color}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      marginBottom:3, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{tx.desc}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:10, color:T.textMute }}>{tx.time}</span>
                      <div style={{ width:3, height:3, borderRadius:"50%",
                        background:T.border }}/>
                      <span style={{ fontSize:10, fontWeight:700,
                        color:status.color }}>{status.label}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:900,
                      color:isCredit ? T.green : T.textMain,
                      fontFamily:"monospace" }}>
                      {isCredit?"+":""}{fmt(tx.amount)}
                    </div>
                    {tx.points !== 0 && (
                      <div style={{ fontSize:10, color:T.gold, fontWeight:700,
                        marginTop:2 }}>
                        {tx.points>0?"+":""}{tx.points} pts
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECURITY NOTICE ── */}
        <div style={{ background:`linear-gradient(135deg,${T.blueBg},${T.navyLight})`,
          border:`1px solid ${T.blue}22`, borderRadius:20,
          padding:"16px 20px", marginBottom:16,
          display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:44, height:44, borderRadius:13,
            background:T.blue+"18", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="lock" size={20} color={T.blue}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:900, color:T.navy, marginBottom:3 }}>
              Bank-Grade Wallet Security
            </div>
            <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
              {/* 🔐 SECURITY — shown to reassure users */}
              All payments are encrypted and processed via Supabase Edge Functions. Your card and M-Pesa details are never stored on this device.
            </div>
          </div>
        </div>

      </div>

      <BottomNav active="wallet"/>
    </div>
  );
}
