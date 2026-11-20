import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg:"#F5F7FF", surface:"#FFFFFF", card:"#FFFFFF", cardAlt:"#F0F4FF",
  navy:"#0B1F4B", navyMid:"#1A3A6E", navyLight:"#EEF2FF",
  gold:"#C9960A", goldLight:"#FFF8E1",
  text:"#0B1F4B", textMid:"#3D5A8A", textMute:"#8A9BC0",
  green:"#0A7B4B", greenBg:"#E8F7F0",
  red:"#C0392B", redBg:"#FDECEA",
  amber:"#B45309", amberBg:"#FEF3C7",
  blue:"#1D4ED8", blueBg:"#EFF6FF",
  purple:"#6D28D9", purpleBg:"#F5F3FF",
  border:"#DDE3F5",
  shadow:"0 2px 16px rgba(11,31,75,0.08)",
  shadowMd:"0 8px 32px rgba(11,31,75,0.12)",
  shadowLg:"0 20px 60px rgba(11,31,75,0.18)",
};

const fmt = n => "TSh " + Number(n).toLocaleString();
const genID = () => "PF2026-" + Math.floor(10000000 + Math.random() * 90000000);
const genTX = () => "TX-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
const genESC = () => "ESC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,5).toUpperCase();
const genINV = () => "INV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

// ─── SVG Icons (no emojis) ───────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor" }) => {
  const icons = {
    store:      <><rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M16 21V12a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v9" stroke={color} strokeWidth="1.6" fill="none"/><path d="M2 7l2-4h16l2 4" stroke={color} strokeWidth="1.6" fill="none"/></>,
    wallet:     <><rect x="2" y="5" width="20" height="15" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill={color}/><path d="M2 10h20" stroke={color} strokeWidth="1.6"/></>,
    trending:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="1.6" fill="none"/><polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="1.6" fill="none"/></>,
    shield:     <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" stroke={color} strokeWidth="1.6" fill="none"/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" fill="none"/></>,
    repeat:     <><polyline points="17 1 21 5 17 9" stroke={color} strokeWidth="1.6" fill="none"/><path d="M3 11V9a4 4 0 0 1 4-4h14" stroke={color} strokeWidth="1.6" fill="none"/><polyline points="7 23 3 19 7 15" stroke={color} strokeWidth="1.6" fill="none"/><path d="M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth="1.6" fill="none"/></>,
    qr:         <><rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.6" fill="none"/><rect x="5" y="5" width="3" height="3" fill={color}/><rect x="16" y="5" width="3" height="3" fill={color}/><rect x="5" y="16" width="3" height="3" fill={color}/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" stroke={color} strokeWidth="1.4" fill="none"/></>,
    link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="1.6" fill="none"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={color} strokeWidth="1.6" fill="none"/></>,
    invoice:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="1.6" fill="none"/><polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="1.6" fill="none"/><line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.6"/><line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.6"/></>,
    lock:       <><rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.6" fill="none"/><circle cx="12" cy="16" r="1.5" fill={color}/></>,
    unlock:     <><rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={color} strokeWidth="1.6" fill="none"/><circle cx="12" cy="16" r="1.5" fill={color}/></>,
    clock:      <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" fill="none"/><polyline points="12 6 12 12 16 14" stroke={color} strokeWidth="1.6" fill="none"/></>,
    check:      <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.6"/><polyline points="12 5 19 12 12 19" stroke={color} strokeWidth="1.6" fill="none"/></>,
    send:       <><line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="1.6"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth="1.6" fill="none"/></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="1.8"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="1.8"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="1.8"/></>,
    users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.6" fill="none"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.6" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="1.6" fill="none"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="1.6" fill="none"/></>,
    copy:       <><rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="1.6" fill="none"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8"/></>,
    trash:      <><polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.6" fill="none"/><path d="M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.6" fill="none"/><path d="M10 11v6M14 11v6" stroke={color} strokeWidth="1.6"/><path d="M9 6V4h6v2" stroke={color} strokeWidth="1.6" fill="none"/></>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="1.6" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.6" fill="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0 }}>{icons[name]}</svg>;
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Avatar({ initials, color, size=36, fs=13 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:color+"22",
    border:`2px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:fs, fontWeight:800, color, flexShrink:0, letterSpacing:-0.5 }}>{initials}</div>;
}

function Badge({ children, color }) {
  return <span style={{ background:color+"15", color, border:`1px solid ${color}30`,
    borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700,
    display:"inline-flex", alignItems:"center", gap:4 }}>{children}</span>;
}

function Label({ children, required }) {
  return <div style={{ fontSize:12, fontWeight:700, color:T.textMid, marginBottom:6,
    textTransform:"uppercase", letterSpacing:0.8 }}>
    {children}{required && <span style={{ color:T.red }}> *</span>}
  </div>;
}

function Field({ value, onChange, placeholder, prefix, type="text", multi }) {
  const [f, setF] = useState(false);
  const base = { width:"100%", background:f?T.surface:T.cardAlt, border:`1.5px solid ${f?T.navy:T.border}`,
    borderRadius:12, padding:prefix?"13px 14px 13px 44px":"13px 14px", color:T.text, fontSize:14,
    fontFamily:"inherit", outline:"none", transition:"all 0.2s", boxSizing:"border-box", fontWeight:500 };
  return <div style={{ position:"relative", marginBottom:16 }}>
    {prefix && <span style={{ position:"absolute", left:14, top:multi?14:"50%",
      transform:multi?"none":"translateY(-50%)", fontSize:13, color:T.textMute,
      fontWeight:600, pointerEvents:"none" }}>{prefix}</span>}
    {multi
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          rows={3} style={{ ...base, resize:"vertical" }}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
      : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
          style={base} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
    }
  </div>;
}

function Select({ value, onChange, options }) {
  return <select value={value} onChange={e=>onChange(e.target.value)}
    style={{ width:"100%", background:T.cardAlt, border:`1.5px solid ${T.border}`, borderRadius:12,
      padding:"13px 14px", color:T.text, fontSize:14, fontFamily:"inherit", outline:"none",
      marginBottom:16, boxSizing:"border-box", fontWeight:500 }}>
    {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}

function Btn({ children, onClick, variant="primary", size="md", loading, full, icon }) {
  const p = size==="sm"?"8px 16px":size==="lg"?"15px 32px":"12px 22px";
  const fs = size==="sm"?12:size==="lg"?14:13;
  const styles = {
    primary: { background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, color:"#fff", boxShadow:`0 4px 14px ${T.navy}33`, border:"none" },
    gold:    { background:`linear-gradient(135deg,${T.gold},#A07008)`, color:"#fff", boxShadow:`0 4px 14px ${T.gold}44`, border:"none" },
    outline: { background:"transparent", color:T.navy, border:`1.5px solid ${T.navy}33` },
    ghost:   { background:T.cardAlt, color:T.textMid, border:`1px solid ${T.border}` },
    success: { background:T.greenBg, color:T.green, border:`1px solid ${T.green}33` },
    danger:  { background:T.redBg, color:T.red, border:`1px solid ${T.red}33` },
  };
  return <button onClick={onClick} disabled={!!loading}
    style={{ borderRadius:12, cursor:loading?"wait":"pointer", fontFamily:"inherit",
      fontWeight:700, transition:"all 0.18s", display:"inline-flex", alignItems:"center",
      justifyContent:"center", gap:8, padding:p, fontSize:fs,
      width:full?"100%":"auto", opacity:loading?0.7:1, ...styles[variant] }}>
    {icon && <Icon name={icon} size={fs+2} color="currentColor"/>}
    {loading ? "Processing..." : children}
  </button>;
}

function Card({ children, style={} }) {
  return <div style={{ background:T.card, border:`1px solid ${T.border}`,
    borderRadius:20, padding:20, boxShadow:T.shadow, ...style }}>{children}</div>;
}

function SHead({ title, sub, action, onAction }) {
  return <div style={{ marginBottom:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:-0.3 }}>{title}</div>
      {action && <button onClick={onAction} style={{ fontSize:12, color:T.gold, background:"none",
        border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>{action}</button>}
    </div>
    {sub && <div style={{ fontSize:12, color:T.textMute, marginTop:3 }}>{sub}</div>}
  </div>;
}

function Divider() {
  return <div style={{ height:1, background:T.border, margin:"14px 0" }}/>;
}

function InfoRow({ label, value, valueColor }) {
  return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
    <span style={{ fontSize:13, color:T.textMute, fontWeight:500 }}>{label}</span>
    <span style={{ fontSize:13, color:valueColor||T.text, fontWeight:700, fontFamily:"monospace" }}>{value}</span>
  </div>;
}

function StatCard({ label, value, color, icon }) {
  return <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16,
    padding:"16px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:T.shadow }}>
    <div style={{ width:46, height:46, borderRadius:14, background:color+"15",
      border:`1px solid ${color}22`, display:"flex", alignItems:"center",
      justifyContent:"center", flexShrink:0, color }}>
      <Icon name={icon} size={20} color={color}/>
    </div>
    <div>
      <div style={{ fontSize:11, color:T.textMute, fontWeight:700, textTransform:"uppercase",
        letterSpacing:0.8, marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:19, fontWeight:900, color, fontFamily:"monospace",
        letterSpacing:-0.5 }}>{value}</div>
    </div>
  </div>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return <div style={{ position:"fixed", top:16, right:16, zIndex:9999,
    display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
    {toasts.map(t=><div key={t.id} style={{ background:T.surface, borderLeft:`4px solid ${t.color||T.gold}`,
      borderRadius:12, padding:"12px 18px", boxShadow:T.shadowMd, minWidth:270, maxWidth:340,
      animation:"toastIn 0.3s ease", border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:12, color:T.textMute }}>{t.msg}</div>
    </div>)}
  </div>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children, width=480 }) {
  return <div style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center",
    justifyContent:"center", padding:16, background:"rgba(11,31,75,0.45)", backdropFilter:"blur(6px)" }}>
    <div style={{ background:T.surface, borderRadius:24, padding:"28px 26px", width:"100%",
      maxWidth:width, maxHeight:"90vh", overflowY:"auto", boxShadow:T.shadowLg,
      border:`1px solid ${T.border}`, position:"relative", animation:"modalIn 0.25s ease" }}>
      <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2,
        background:`linear-gradient(90deg,transparent,${T.gold},transparent)`, borderRadius:99 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.text }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:T.textMute, marginTop:3 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:T.cardAlt,
          border:`1px solid ${T.border}`, cursor:"pointer", color:T.textMute,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={14} color={T.textMute}/>
        </button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return <div style={{ display:"flex", gap:4, marginBottom:20, background:T.surface,
    borderRadius:16, padding:5, border:`1px solid ${T.border}`, boxShadow:T.shadow, overflowX:"auto" }}>
    {tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)}
      style={{ flex:1, minWidth:80, padding:"10px 8px", borderRadius:12, border:"none",
        background:active===t.id?T.navy:"transparent",
        color:active===t.id?"#fff":T.textMute, fontWeight:active===t.id?800:500,
        fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s",
        boxShadow:active===t.id?`0 4px 14px ${T.navy}33`:"none",
        display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <Icon name={t.icon} size={16} color={active===t.id?"#fff":T.textMute}/>
      <span style={{ whiteSpace:"nowrap" }}>{t.label}</span>
    </button>)}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 3 — MERCHANT WALLET
// ═══════════════════════════════════════════════════════════════════════════════
function MerchantWallet({ toast }) {
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);
  const [settleName, setSettleName] = useState("");
  const [settleAmt, setSettleAmt] = useState("");
  const [settledItems, setSettledItems] = useState([]);

  const [bizTxs, setBizTxs] = useState([
    { id:genTX(), type:"in",  from:"Customer · John M.",  amt:85000,  note:"Table 4 — Dinner order",       time:"Today, 19:45", status:"settled"  },
    { id:genTX(), type:"in",  from:"Customer · Amina H.", amt:42000,  note:"Takeaway order #091",          time:"Today, 17:30", status:"pending"  },
    { id:genTX(), type:"in",  from:"Customer · Hassan K.",amt:120000, note:"Corporate lunch booking",     time:"Today, 13:10", status:"settled"  },
    { id:genTX(), type:"out", from:"Supplier · Morogoro Fresh",amt:200000,note:"Vegetable supply",         time:"Yesterday",    status:"settled"  },
    { id:genTX(), type:"in",  from:"Customer · Zawadi M.",amt:55000,  note:"Online order #088",           time:"Yesterday",    status:"pending"  },
    { id:genTX(), type:"in",  from:"Customer · Juma W.",  amt:30000,  note:"Beverage order",              time:"Jun 12",       status:"settled"  },
  ]);

  const totalIn     = bizTxs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amt,0);
  const totalPending = bizTxs.filter(t=>t.status==="pending"&&t.type==="in").reduce((s,t)=>s+t.amt,0);
  const todaySales  = bizTxs.filter(t=>t.type==="in"&&t.time.startsWith("Today")).reduce((s,t)=>s+t.amt,0);
  const availBal    = totalIn - 200000; // after supplier payment

  const settle = (txId) => {
    setBizTxs(txs=>txs.map(t=>t.id===txId?{...t,status:"settled"}:t));
    toast("Payment Settled","Funds moved to your main wallet balance.",T.green);
  };

  const TABS = [
    { id:"overview", icon:"chart",   label:"Overview"   },
    { id:"sales",    icon:"trending", label:"Sales"      },
    { id:"settle",   icon:"send",     label:"Settle"     },
  ];

  return <div>
    {/* Business balance card */}
    <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,
      borderRadius:22, padding:"26px 24px", marginBottom:18,
      boxShadow:"0 20px 56px rgba(11,31,75,0.3), 0 0 0 1px rgba(201,150,10,0.18)",
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,150,10,0.12),transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2,
            textTransform:"uppercase", marginBottom:4 }}>Business Account</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Gigas Panda Restaurant</div>
        </div>
        <div style={{ background:"rgba(201,150,10,0.18)", border:"1px solid rgba(201,150,10,0.35)",
          borderRadius:8, padding:"4px 12px" }}>
          <span style={{ fontSize:11, color:"#C9960A", fontWeight:700, letterSpacing:1 }}>MERCHANT</span>
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:2,
          textTransform:"uppercase", marginBottom:8 }}>Available Balance</div>
        <div style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1,
          fontFamily:"'JetBrains Mono',monospace" }}>{fmt(availBal)}</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {[
          { label:"Today's Sales",  value:fmt(todaySales),  color:"#34D399" },
          { label:"Pending",        value:fmt(totalPending), color:"#FBBF24" },
          { label:"Business ID",    value:"MRC-00291",       color:"rgba(255,255,255,0.7)" },
        ].map(s=><div key={s.label} style={{ background:"rgba(255,255,255,0.06)",
          borderRadius:10, padding:"10px 12px", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
            letterSpacing:1.5, marginBottom:4 }}>{s.label}</div>
          <div style={{ fontSize:13, fontWeight:800, color:s.color,
            fontFamily:"'JetBrains Mono',monospace" }}>{s.value}</div>
        </div>)}
      </div>
    </div>

    {/* Stats row */}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
      <StatCard label="Total Revenue"    value={fmt(totalIn)}      color={T.green}  icon="trending"/>
      <StatCard label="Pending Settlement" value={fmt(totalPending)} color={T.amber} icon="clock"/>
    </div>

    <Tabs tabs={TABS} active={tab} onChange={setTab}/>

    {/* Overview */}
    {tab==="overview" && <div>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Recent Transactions" sub="All business income and expenses"/>
        {bizTxs.slice(0,5).map((tx,i)=><div key={tx.id} style={{ display:"flex", alignItems:"center",
          gap:14, padding:"13px 0", borderBottom:i<4?`1px solid ${T.border}`:"none" }}>
          <div style={{ width:42, height:42, borderRadius:12, flexShrink:0,
            background:tx.type==="in"?T.greenBg:T.redBg,
            border:`1px solid ${tx.type==="in"?T.green:T.red}22`,
            display:"flex", alignItems:"center", justifyContent:"center", color:tx.type==="in"?T.green:T.red }}>
            <Icon name={tx.type==="in"?"trending":"send"} size={18} color={tx.type==="in"?T.green:T.red}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>{tx.from}</div>
            <div style={{ fontSize:12, color:T.textMute }}>{tx.note}</div>
            <div style={{ fontSize:10, color:T.textMute, marginTop:1, opacity:0.6, fontFamily:"monospace" }}>{tx.time}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:14, fontWeight:900, color:tx.type==="in"?T.green:T.red,
              fontFamily:"monospace", marginBottom:4 }}>
              {tx.type==="in"?"+":"-"}{fmt(tx.amt)}
            </div>
            <Badge color={tx.status==="settled"?T.green:T.amber}>
              {tx.status==="settled"?"Settled":"Pending"}
            </Badge>
          </div>
        </div>)}
      </Card>

      {/* Quick settle pending */}
      {bizTxs.filter(t=>t.status==="pending"&&t.type==="in").length>0&&<Card style={{ border:`1px solid ${T.amber}33`, background:T.amberBg }}>
        <SHead title="Pending Settlement" sub="These payments are awaiting settlement to your main wallet"/>
        {bizTxs.filter(t=>t.status==="pending"&&t.type==="in").map(tx=><div key={tx.id}
          style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 0", borderBottom:`1px solid ${T.amber}22`, flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{tx.from}</div>
            <div style={{ fontSize:12, color:T.textMute }}>{tx.note} · {tx.time}</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:900, color:T.amber, fontFamily:"monospace" }}>{fmt(tx.amt)}</span>
            <Btn size="sm" variant="gold" onClick={()=>settle(tx.id)} icon="check">Settle</Btn>
          </div>
        </div>)}
      </Card>}
    </div>}

    {/* Sales breakdown */}
    {tab==="sales" && <Card>
      <SHead title="Sales Breakdown" sub="Revenue by category and time period"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { label:"Dine-In", pct:58, color:T.navy,   val:fmt(Math.round(todaySales*0.58)) },
          { label:"Takeaway",pct:28, color:T.gold,    val:fmt(Math.round(todaySales*0.28)) },
          { label:"Online",  pct:14, color:T.green,   val:fmt(Math.round(todaySales*0.14)) },
        ].map(s=><div key={s.label} style={{ background:T.cardAlt, borderRadius:14, padding:"14px 12px",
          border:`1px solid ${T.border}`, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:s.color, marginBottom:4 }}>{s.pct}%</div>
          <div style={{ fontSize:11, fontWeight:700, color:T.textMid, marginBottom:6 }}>{s.label}</div>
          <div style={{ fontSize:12, fontWeight:800, color:T.text, fontFamily:"monospace" }}>{s.val}</div>
        </div>)}
      </div>
      {/* Bar chart */}
      <div style={{ marginBottom:6 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.textMid, marginBottom:12 }}>This Week — Daily Sales</div>
        {[
          { day:"Mon", val:120000, pct:50 },
          { day:"Tue", val:95000,  pct:40 },
          { day:"Wed", val:180000, pct:75 },
          { day:"Thu", val:240000, pct:100 },
          { day:"Fri", val:195000, pct:81 },
          { day:"Sat", val:220000, pct:92 },
          { day:"Sun", val:todaySales, pct:Math.round(todaySales/2400) },
        ].map(d=><div key={d.day} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ fontSize:12, fontWeight:600, color:T.textMute, width:30 }}>{d.day}</div>
          <div style={{ flex:1, height:10, background:T.cardAlt, borderRadius:99, overflow:"hidden" }}>
            <div style={{ width:`${d.pct}%`, height:"100%",
              background:`linear-gradient(90deg,${T.navy},${T.navyMid})`, borderRadius:99,
              transition:"width 0.8s ease" }}/>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"monospace",
            minWidth:90, textAlign:"right" }}>{fmt(d.val)}</div>
        </div>)}
      </div>
    </Card>}

    {/* Settle funds */}
    {tab==="settle" && <Card>
      <SHead title="Settle Funds" sub="Move your business balance to your personal Panda wallet or bank"/>
      <div style={{ background:T.navyLight, borderRadius:12, padding:"14px 16px", marginBottom:18,
        display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:T.textMid, fontSize:13 }}>Available to Settle</span>
        <span style={{ color:T.navy, fontWeight:900, fontSize:14, fontFamily:"monospace" }}>{fmt(availBal)}</span>
      </div>
      <Label required>Settlement Destination</Label>
      <Select value={settleName} onChange={setSettleName} options={[
        { value:"",          label:"Select destination..." },
        { value:"personal",  label:"My Personal Panda Wallet (@bak)" },
        { value:"nmb",       label:"NMB Bank — Business Account" },
        { value:"crdb",      label:"CRDB Bank — Business Account" },
        { value:"mpesa",     label:"M-Pesa — +255 712 000 000" },
      ]}/>
      <Label required>Amount to Settle</Label>
      <Field value={settleAmt} onChange={setSettleAmt} placeholder="e.g. 500,000" prefix="TSh"/>
      <div style={{ marginBottom:18 }}>
        {[
          { label:"Settlement Fee",  value:"Free (personal wallet) / TSh 1,500 (external)" },
          { label:"Processing Time", value:"Instant (personal) / 1–2 hours (bank)"         },
          { label:"Business ID",     value:"MRC-00291"                                       },
        ].map(r=><InfoRow key={r.label} {...r}/>)}
      </div>
      <Btn full variant="gold" icon="send"
        onClick={()=>{
          if(!settleName||!settleAmt)return;
          toast("Settlement Initiated",`${fmt(parseInt(settleAmt.replace(/,/g,"")||0))} is being settled.`,T.green);
          setSettleAmt("");setSettleName("");
        }}>
        Settle Funds
      </Btn>
    </Card>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 3 — BUSINESS COLLECTIONS (QR · LINK · INVOICE)
// ═══════════════════════════════════════════════════════════════════════════════
function BusinessCollections({ toast }) {
  const [tab, setTab] = useState("qr");
  const [invItems, setInvItems] = useState([
    { id:1, desc:"Website Design — Full Package", qty:1, price:1500000 },
    { id:2, desc:"Domain Registration (1 year)",  qty:1, price:45000   },
  ]);
  const [newDesc, setNewDesc] = useState("");
  const [newQty, setNewQty] = useState("1");
  const [newPrice, setNewPrice] = useState("");
  const [invClient, setInvClient] = useState("");
  const [invNote, setInvNote] = useState("");
  const [generated, setGenerated] = useState(false);
  const [invID] = useState(genINV());
  const [linkAmt, setLinkAmt] = useState("");
  const [linkNote, setLinkNote] = useState("");
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const invTotal = invItems.reduce((s,i)=>s+i.qty*i.price, 0);
  const link = "panda.tz/pay/bak" + (linkAmt?"?amt="+linkAmt.replace(/,/g,""):"") + (linkNote?"&note="+encodeURIComponent(linkNote):"");

  const addItem = () => {
    if(!newDesc||!newPrice)return;
    setInvItems(items=>[...items,{ id:Date.now(), desc:newDesc, qty:parseInt(newQty)||1, price:parseInt(newPrice.replace(/,/g,""))||0 }]);
    setNewDesc("");setNewQty("1");setNewPrice("");
  };

  const TABS = [
    { id:"qr",      icon:"qr",      label:"QR Code"   },
    { id:"link",    icon:"link",     label:"Pay Link"  },
    { id:"invoice", icon:"invoice",  label:"Invoice"   },
  ];

  return <div>
    <Card style={{ marginBottom:18 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:T.navy+"18",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="store" size={20} color={T.navy}/>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.text }}>Business Collections</div>
          <div style={{ fontSize:12, color:T.textMute }}>Accept payments via QR, link, or invoice</div>
        </div>
      </div>
    </Card>

    <Tabs tabs={TABS} active={tab} onChange={setTab}/>

    {/* QR Code */}
    {tab==="qr" && <div>
      <Card style={{ marginBottom:14, textAlign:"center" }}>
        <SHead title="Business QR Code" sub="Customers scan this to pay you instantly"/>
        {/* QR visual */}
        <div style={{ background:T.cardAlt, borderRadius:18, padding:28, marginBottom:18, display:"inline-block" }}>
          <div style={{ width:160, height:160, background:"#fff", borderRadius:14,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:T.shadowMd, position:"relative", overflow:"hidden",
            border:`3px solid ${T.navy}` }}>
            {/* Simulated QR grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, padding:8 }}>
              {Array.from({length:49},(_,i)=>{
                const corner = [0,1,2,7,8,9,14,15,16,32,33,34,39,40,41,46,47,48];
                const dark = corner.includes(i) || Math.random()>0.55;
                return <div key={i} style={{ width:16,height:16,borderRadius:2,background:dark?T.navy:"transparent" }}/>;
              })}
            </div>
            {/* Center panda logo */}
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",
              justifyContent:"center" }}>
              <div style={{ width:36,height:36,background:T.navy,borderRadius:8,
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon name="store" size={18} color="#fff"/>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize:14, fontWeight:800, color:T.text, marginBottom:4 }}>Gigas Panda Restaurant</div>
        <div style={{ fontSize:12, color:T.textMute, marginBottom:16 }}>Merchant ID: MRC-00291 · @bak</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <Badge color={T.green}>Verified Merchant</Badge>
          <Badge color={T.blue}>Instant Payment</Badge>
          <Badge color={T.gold}>No App Needed</Badge>
        </div>
        <Divider/>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <Btn variant="primary" icon="copy" onClick={()=>toast("QR Code Copied","QR image copied to clipboard.",T.navy)}>Save QR</Btn>
          <Btn variant="outline" icon="send" onClick={()=>toast("QR Shared","QR code shared via WhatsApp.",T.gold)}>Share</Btn>
          <Btn variant="ghost" icon="invoice" onClick={()=>toast("QR Printed","Sending to printer...",T.textMid)}>Print</Btn>
        </div>
      </Card>

      {/* Fixed amount QR */}
      <Card>
        <SHead title="Fixed Amount QR" sub="Generate a QR with a specific amount pre-filled"/>
        <Label>Amount (leave blank for any amount)</Label>
        <Field value={linkAmt} onChange={setLinkAmt} placeholder="e.g. 85,000" prefix="TSh"/>
        <Label>Item or Service</Label>
        <Field value={linkNote} onChange={setLinkNote} placeholder="e.g. Table 4 Dinner"/>
        <Btn full variant="gold" icon="qr" onClick={()=>{toast("Fixed QR Generated",`QR for ${fmt(parseInt(linkAmt.replace(/,/g,"")||0))} is ready.`,T.gold);}}>
          Generate Fixed Amount QR
        </Btn>
      </Card>
    </div>}

    {/* Pay Link */}
    {tab==="link" && <Card>
      <SHead title="Payment Link" sub="Share a link and anyone can pay you — even without the Panda app"/>
      <Label>Amount (optional)</Label>
      <Field value={linkAmt} onChange={setLinkAmt} placeholder="e.g. 85,000" prefix="TSh"/>
      <Label>What is this for?</Label>
      <Field value={linkNote} onChange={setLinkNote} placeholder="e.g. Table 4 Dinner"/>
      {!linkGenerated
        ? <Btn full variant="gold" icon="link" onClick={()=>setLinkGenerated(true)}>Generate Payment Link</Btn>
        : <div>
            <div style={{ background:T.navyLight, border:`1.5px solid ${T.navy}22`, borderRadius:14,
              padding:"16px", marginBottom:14 }}>
              <div style={{ fontSize:10, color:T.textMute, marginBottom:6, letterSpacing:1.5, textTransform:"uppercase" }}>Your Payment Link</div>
              <div style={{ fontSize:13, color:T.navy, fontFamily:"monospace", wordBreak:"break-all", fontWeight:700, marginBottom:12 }}>{link}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Btn size="sm" variant={copied?"success":"primary"} icon="copy"
                  onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);toast("Link Copied","Payment link copied to clipboard.",T.navy);}}>
                  {copied?"Copied!":"Copy Link"}
                </Btn>
                <Btn size="sm" variant="outline" icon="send" onClick={()=>toast("Shared","Link shared via WhatsApp.",T.green)}>WhatsApp</Btn>
                <Btn size="sm" variant="ghost" icon="send" onClick={()=>toast("Shared","Link sent via SMS.",T.blue)}>SMS</Btn>
              </div>
            </div>
            <Btn full variant="ghost" onClick={()=>setLinkGenerated(false)}>Generate New Link</Btn>
          </div>
      }
    </Card>}

    {/* Invoice */}
    {tab==="invoice" && <div>
      {!generated ? <>
        <Card style={{ marginBottom:14 }}>
          <SHead title="New Invoice" sub={`Invoice number: ${invID}`}/>
          <Label required>Client Name or Business</Label>
          <Field value={invClient} onChange={setInvClient} placeholder="e.g. BAK Online Life"/>
          <Label>Invoice Note</Label>
          <Field value={invNote} onChange={setInvNote} placeholder="e.g. Website development services" multi/>
        </Card>

        <Card style={{ marginBottom:14 }}>
          <SHead title="Invoice Items"/>
          {invItems.map((item,i)=><div key={item.id} style={{ display:"flex", alignItems:"center",
            gap:12, padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{item.desc}</div>
              <div style={{ fontSize:12, color:T.textMute }}>Qty: {item.qty} × {fmt(item.price)}</div>
            </div>
            <div style={{ fontSize:14, fontWeight:900, color:T.text, fontFamily:"monospace" }}>{fmt(item.qty*item.price)}</div>
            <button onClick={()=>setInvItems(its=>its.filter((_,j)=>j!==i))}
              style={{ background:"none", border:"none", cursor:"pointer", color:T.red, display:"flex" }}>
              <Icon name="trash" size={16} color={T.red}/>
            </button>
          </div>)}

          {/* Add item row */}
          <div style={{ marginTop:14, padding:"14px", background:T.cardAlt, borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.textMid, marginBottom:10 }}>Add Item</div>
            <Field value={newDesc} onChange={setNewDesc} placeholder="Item description"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Field value={newQty} onChange={setNewQty} placeholder="Qty" type="number"/>
              <Field value={newPrice} onChange={setNewPrice} placeholder="Unit price" prefix="TSh"/>
            </div>
            <Btn size="sm" variant="outline" icon="plus" onClick={addItem}>Add Item</Btn>
          </div>

          <Divider/>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0" }}>
            <span style={{ fontSize:15, fontWeight:800, color:T.text }}>Total</span>
            <span style={{ fontSize:17, fontWeight:900, color:T.navy, fontFamily:"monospace" }}>{fmt(invTotal)}</span>
          </div>
        </Card>

        <Btn full variant="gold" icon="invoice"
          onClick={()=>{if(invClient)setGenerated(true);}}>
          Generate Invoice
        </Btn>
      </> : (
        // Invoice Preview
        <Card>
          <div style={{ borderBottom:`2px solid ${T.navy}`, paddingBottom:16, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:T.navy, letterSpacing:-0.5 }}>INVOICE</div>
                <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>#{invID}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:800, color:T.text }}>Gigas Panda Restaurant</div>
                <div style={{ fontSize:11, color:T.textMute }}>Merchant · @bak · MRC-00291</div>
                <div style={{ fontSize:11, color:T.textMute }}>Morogoro, Tanzania</div>
              </div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, color:T.textMute, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Billed To</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{invClient}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:T.textMute, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Invoice Date</div>
              <div style={{ fontSize:13, fontWeight:600, color:T.text }}>June 15, 2026</div>
              <div style={{ fontSize:10, color:T.textMute, marginTop:2 }}>Due: June 22, 2026</div>
            </div>
          </div>

          {invNote && <div style={{ background:T.cardAlt, borderRadius:10, padding:"10px 14px",
            fontSize:12, color:T.textMid, marginBottom:14 }}>{invNote}</div>}

          <div style={{ background:T.navy, borderRadius:"10px 10px 0 0",
            padding:"10px 14px", display:"grid", gridTemplateColumns:"1fr auto auto" }}>
            {["Description","Qty","Amount"].map(h=><div key={h} style={{ fontSize:11,
              fontWeight:700, color:"rgba(255,255,255,0.7)", textTransform:"uppercase",
              letterSpacing:0.8, textAlign:h==="Description"?"left":"right" }}>{h}</div>)}
          </div>
          {invItems.map((item,i)=><div key={item.id} style={{ display:"grid",
            gridTemplateColumns:"1fr auto auto", padding:"11px 14px",
            background:i%2===0?T.cardAlt:T.surface, borderLeft:`1px solid ${T.border}`,
            borderRight:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{item.desc}</div>
            <div style={{ fontSize:13, color:T.textMute, textAlign:"right", paddingRight:20 }}>{item.qty}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, textAlign:"right",
              fontFamily:"monospace" }}>{fmt(item.qty*item.price)}</div>
          </div>)}
          <div style={{ background:T.navy, borderRadius:"0 0 10px 10px", padding:"14px",
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.7)" }}>Total Due</span>
            <span style={{ fontSize:18, fontWeight:900, color:"#C9960A",
              fontFamily:"'JetBrains Mono',monospace" }}>{fmt(invTotal)}</span>
          </div>

          <Divider/>
          <div style={{ fontSize:11, color:T.textMute, textAlign:"center", marginBottom:14 }}>
            Pay instantly at <span style={{ color:T.navy, fontWeight:700 }}>panda.tz/pay/bak</span> or scan the QR code
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn full variant="primary" icon="copy" onClick={()=>toast("Invoice Copied","Invoice link copied.",T.navy)}>Copy Invoice Link</Btn>
            <Btn full variant="outline" icon="send" onClick={()=>toast("Invoice Sent",`Invoice ${invID} sent to ${invClient}.`,T.green)}>Send to Client</Btn>
          </div>
          <div style={{ marginTop:10 }}>
            <Btn full variant="ghost" onClick={()=>setGenerated(false)}>Edit Invoice</Btn>
          </div>
        </Card>
      )}
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 3 — ESCROW WALLET
// ═══════════════════════════════════════════════════════════════════════════════
function EscrowWallet({ toast }) {
  const [modal, setModal] = useState(null);
  const [escrows, setEscrows] = useState([
    { id:"ESC-K8X2A-BB", buyer:"@hassan", seller:"@bak",    amt:850000,  item:"Laptop — HP EliteBook",       status:"held",     created:"Jun 12, 2026", deadline:"Jun 19, 2026" },
    { id:"ESC-J7W9B-CC", buyer:"@amina",  seller:"@zawadi", amt:250000,  item:"Samsung Galaxy Buds Pro",      status:"released", created:"Jun 10, 2026", deadline:"Jun 17, 2026" },
    { id:"ESC-I6V8C-DD", buyer:"@bak",    seller:"@juma",   amt:1200000, item:"Sony Mirrorless Camera A7III", status:"disputed", created:"Jun 8, 2026",  deadline:"Jun 15, 2026" },
  ]);

  const [newBuyer, setNewBuyer]   = useState("");
  const [newSeller, setNewSeller] = useState("");
  const [newAmt, setNewAmt]       = useState("");
  const [newItem, setNewItem]     = useState("");
  const [newDays, setNewDays]     = useState("7");
  const [done, setDone]           = useState(false);

  const statusColor = { held:T.amber, released:T.green, disputed:T.red };
  const statusLabel = { held:"Funds Held", released:"Released", disputed:"In Dispute" };
  const statusIcon  = { held:"lock", released:"unlock", disputed:"shield" };

  const createEscrow = () => {
    if(!newBuyer||!newSeller||!newAmt||!newItem)return;
    const newEsc = {
      id: genESC(),
      buyer: newBuyer, seller: newSeller,
      amt: parseInt(newAmt.replace(/,/g,""))||0,
      item: newItem, status:"held",
      created:"Jun 15, 2026",
      deadline:`Jun ${15+parseInt(newDays||7)}, 2026`
    };
    setEscrows(e=>[newEsc,...e]);
    toast("Escrow Created",`${fmt(newEsc.amt)} is now securely held by Panda.`,T.amber);
    setDone(true);
  };

  const release = (id) => {
    setEscrows(e=>e.map(x=>x.id===id?{...x,status:"released"}:x));
    toast("Funds Released","Payment released to the seller. Transaction complete.",T.green);
  };

  const dispute = (id) => {
    setEscrows(e=>e.map(x=>x.id===id?{...x,status:"disputed"}:x));
    toast("Dispute Raised","Our team will review this transaction within 24 hours.",T.red);
  };

  return <div>
    {/* Explainer */}
    <Card style={{ marginBottom:14, background:T.navyLight, border:`1px solid ${T.navy}22` }}>
      <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
        <div style={{ width:46, height:46, borderRadius:14, background:T.navy,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon name="shield" size={22} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.navy, marginBottom:4 }}>How Escrow Works</div>
          <div style={{ fontSize:12, color:T.textMid, lineHeight:1.6 }}>
            Buyer pays Panda. Panda holds the money securely. Seller delivers the item. Buyer confirms receipt. Panda releases funds to seller. If there is a dispute, Panda mediates.
          </div>
        </div>
      </div>
    </Card>

    {/* Stats */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
      {[
        { label:"Funds Held",    value:fmt(escrows.filter(e=>e.status==="held").reduce((s,e)=>s+e.amt,0)),    color:T.amber  },
        { label:"Released",      value:fmt(escrows.filter(e=>e.status==="released").reduce((s,e)=>s+e.amt,0)), color:T.green  },
        { label:"In Dispute",    value:escrows.filter(e=>e.status==="disputed").length + " active",             color:T.red    },
      ].map(s=><div key={s.label} style={{ background:T.card, border:`1px solid ${T.border}`,
        borderRadius:14, padding:"14px 12px", textAlign:"center", boxShadow:T.shadow }}>
        <div style={{ fontSize:11, color:T.textMute, fontWeight:700, textTransform:"uppercase",
          letterSpacing:0.8, marginBottom:6 }}>{s.label}</div>
        <div style={{ fontSize:14, fontWeight:900, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
      </div>)}
    </div>

    {/* Active escrows */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Escrow Transactions" sub="All your secure transactions"/>
      {escrows.map((esc,i)=><div key={esc.id} style={{ padding:"16px 0",
        borderBottom:i<escrows.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
          gap:12, marginBottom:10, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:statusColor[esc.status]+"15",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name={statusIcon[esc.status]} size={16} color={statusColor[esc.status]}/>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{esc.item}</div>
            </div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:2 }}>
              Buyer: <span style={{ color:T.navy, fontWeight:700 }}>{esc.buyer}</span>
              {" → "}
              Seller: <span style={{ color:T.navy, fontWeight:700 }}>{esc.seller}</span>
            </div>
            <div style={{ fontSize:10, color:T.textMute, fontFamily:"monospace" }}>{esc.id}</div>
            <div style={{ fontSize:10, color:T.textMute }}>Created {esc.created} · Deadline {esc.deadline}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16, fontWeight:900, color:T.text,
              fontFamily:"monospace", marginBottom:6 }}>{fmt(esc.amt)}</div>
            <Badge color={statusColor[esc.status]}>{statusLabel[esc.status]}</Badge>
          </div>
        </div>
        {esc.status==="held" && esc.buyer==="@hassan" && (
          <div style={{ display:"flex", gap:8 }}>
            <Btn size="sm" variant="success" icon="check" onClick={()=>release(esc.id)}>Release Funds</Btn>
            <Btn size="sm" variant="danger"  icon="x"     onClick={()=>dispute(esc.id)}>Raise Dispute</Btn>
          </div>
        )}
        {esc.status==="disputed" && (
          <div style={{ background:T.redBg, borderRadius:10, padding:"8px 12px",
            fontSize:12, color:T.red, fontWeight:600 }}>
            Dispute in review — Panda team will resolve within 24 hours.
          </div>
        )}
      </div>)}
    </Card>

    {/* Create escrow */}
    <Card>
      <SHead title="Create New Escrow" sub="Secure a transaction between buyer and seller"/>
      {!done ? <>
        <Label required>Buyer (Panda Username)</Label>
        <Field value={newBuyer} onChange={setNewBuyer} placeholder="e.g. @hassan"/>
        <Label required>Seller (Panda Username)</Label>
        <Field value={newSeller} onChange={setNewSeller} placeholder="e.g. @bak"/>
        <Label required>Amount</Label>
        <Field value={newAmt} onChange={setNewAmt} placeholder="e.g. 850,000" prefix="TSh"/>
        <Label required>Item or Service Description</Label>
        <Field value={newItem} onChange={setNewItem} placeholder="e.g. iPhone 15 Pro Max — 256GB"/>
        <Label>Release Window (days)</Label>
        <Select value={newDays} onChange={setNewDays} options={[
          { value:"3",  label:"3 days — Fast delivery" },
          { value:"7",  label:"7 days — Standard"      },
          { value:"14", label:"14 days — International" },
          { value:"30", label:"30 days — Custom project" },
        ]}/>
        <div style={{ background:T.amberBg, border:`1px solid ${T.amber}33`, borderRadius:12,
          padding:"12px 16px", marginBottom:16, fontSize:12, color:T.amber, fontWeight:600 }}>
          Panda will hold the funds for {newDays} days. The buyer must confirm delivery before funds are released to the seller.
        </div>
        <Btn full variant="gold" icon="lock" onClick={createEscrow}>Create Secure Escrow</Btn>
      </> : <div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:T.greenBg,
          border:`2px solid ${T.green}44`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="shield" size={28} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:6 }}>Escrow Created!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          Funds are securely held by Panda. The seller will be notified.
        </div>
        <Btn variant="gold" onClick={()=>setDone(false)}>Create Another</Btn>
      </div>}
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 3 — RECURRING TRANSFERS
// ═══════════════════════════════════════════════════════════════════════════════
function RecurringTransfers({ toast }) {
  const [modal, setModal] = useState(false);
  const [recurring, setRecurring] = useState([
    { id:1, to:"@amina",   amt:200000, note:"Monthly salary payment", freq:"Monthly",  day:"1st",    next:"Jul 1, 2026",  status:"active",  total:2400000, sent:8 },
    { id:2, to:"@juma",    amt:50000,  note:"Weekly allowance",       freq:"Weekly",   day:"Friday", next:"Jun 20, 2026", status:"active",  total:2600000, sent:52 },
    { id:3, to:"Vikoba",   amt:100000, note:"Vikoba savings group",   freq:"Monthly",  day:"15th",   next:"Jun 15, 2026", status:"paused",  total:1200000, sent:12 },
    { id:4, to:"LUKU Bill",amt:45000,  note:"Electricity auto-pay",   freq:"Monthly",  day:"5th",    next:"Jul 5, 2026",  status:"active",  total:540000,  sent:12 },
  ]);

  const [rTo, setRTo]     = useState("");
  const [rAmt, setRAmt]   = useState("");
  const [rNote, setRNote] = useState("");
  const [rFreq, setRFreq] = useState("monthly");
  const [rDay, setRDay]   = useState("1");
  const [done, setDone]   = useState(false);

  const toggle = (id) => {
    setRecurring(r=>r.map(x=>x.id===id?{...x,status:x.status==="active"?"paused":"active"}:x));
    const item = recurring.find(x=>x.id===id);
    toast(item.status==="active"?"Transfer Paused":"Transfer Resumed",
      `Recurring transfer to ${item.to} ${item.status==="active"?"paused":"resumed"}.`,
      item.status==="active"?T.amber:T.green);
  };

  const del = (id) => {
    setRecurring(r=>r.filter(x=>x.id!==id));
    toast("Transfer Deleted","Recurring transfer has been cancelled.",T.red);
  };

  const create = () => {
    if(!rTo||!rAmt)return;
    const a = parseInt(rAmt.replace(/,/g,""))||0;
    const freqLabel = { daily:"Daily", weekly:"Weekly", monthly:"Monthly", yearly:"Yearly" };
    setRecurring(r=>[...r,{
      id:Date.now(), to:rTo, amt:a, note:rNote||"Recurring Transfer",
      freq:freqLabel[rFreq], day:rDay==="1"?"1st":rDay+"th",
      next:"Jun 20, 2026", status:"active", total:0, sent:0
    }]);
    toast("Recurring Transfer Created",`${fmt(a)} will be sent to ${rTo} ${freqLabel[rFreq].toLowerCase()}.`,T.gold);
    setDone(true);
  };

  const activeAmt   = recurring.filter(r=>r.status==="active").reduce((s,r)=>s+r.amt,0);
  const totalSentAll = recurring.reduce((s,r)=>s+r.total,0);

  return <div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
      <StatCard label="Active Monthly"    value={fmt(activeAmt)}    color={T.navy}  icon="repeat"/>
      <StatCard label="Total Sent (All)"  value={fmt(totalSentAll)} color={T.green} icon="trending"/>
    </div>

    <Card style={{ marginBottom:14 }}>
      <SHead title="Recurring Transfers" sub="Automatic payments on your schedule"
        action="+ New" onAction={()=>setModal(true)}/>

      {recurring.map((r,i)=><div key={r.id} style={{ padding:"16px 0",
        borderBottom:i<recurring.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
          {/* Icon */}
          <div style={{ width:44, height:44, borderRadius:12, flexShrink:0,
            background:r.status==="active"?T.navyLight:T.cardAlt,
            border:`1px solid ${r.status==="active"?T.navy:T.border}22`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="repeat" size={20} color={r.status==="active"?T.navy:T.textMute}/>
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{r.to}</div>
              <Badge color={r.status==="active"?T.green:T.amber}>
                {r.status==="active"?"Active":"Paused"}
              </Badge>
            </div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:2 }}>{r.note}</div>
            <div style={{ fontSize:11, color:T.textMute }}>
              {r.freq} · Every {r.day} · Next: <span style={{ color:T.navy, fontWeight:700 }}>{r.next}</span>
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
              {r.sent} payments sent · Total: <span style={{ fontFamily:"monospace", fontWeight:700 }}>{fmt(r.total)}</span>
            </div>
          </div>

          {/* Amount + actions */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:16, fontWeight:900, color:T.text,
              fontFamily:"monospace", marginBottom:8 }}>{fmt(r.amt)}</div>
            <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
              <button onClick={()=>toggle(r.id)} style={{ width:32, height:32, borderRadius:8,
                background:r.status==="active"?T.amberBg:T.greenBg,
                border:`1px solid ${r.status==="active"?T.amber:T.green}33`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name={r.status==="active"?"clock":"check"} size={15}
                  color={r.status==="active"?T.amber:T.green}/>
              </button>
              <button onClick={()=>del(r.id)} style={{ width:32, height:32, borderRadius:8,
                background:T.redBg, border:`1px solid ${T.red}33`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="trash" size={15} color={T.red}/>
              </button>
            </div>
          </div>
        </div>
      </div>)}
    </Card>

    {/* Use cases */}
    <Card>
      <SHead title="Common Uses for Recurring Transfers"/>
      {[
        { icon:"users",   label:"Staff Salaries",       sub:"Pay employees automatically on payday" },
        { icon:"shield",  label:"Savings Goals",         sub:"Auto-save every week to reach your goal faster" },
        { icon:"store",   label:"Supplier Payments",     sub:"Pay vendors on a fixed schedule" },
        { icon:"repeat",  label:"Group Contributions",   sub:"Vikoba or community savings, sent automatically" },
      ].map(item=><div key={item.label} style={{ display:"flex", gap:14, alignItems:"center",
        padding:"13px 0", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ width:40, height:40, borderRadius:12, background:T.navyLight,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon name={item.icon} size={18} color={T.navy}/>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>{item.label}</div>
          <div style={{ fontSize:12, color:T.textMute }}>{item.sub}</div>
        </div>
      </div>)}
    </Card>

    {/* Create Modal */}
    {modal && <Modal title="New Recurring Transfer" subtitle="Set up automatic payments on your schedule"
      onClose={()=>{setModal(false);setDone(false);}}>
      {!done ? <>
        <Label required>Send To (Panda Username or Merchant)</Label>
        <Field value={rTo} onChange={setRTo} placeholder="e.g. @amina or M-Pesa"/>
        <Label required>Amount per Transfer</Label>
        <Field value={rAmt} onChange={setRAmt} placeholder="e.g. 200,000" prefix="TSh"/>
        <Label>Note</Label>
        <Field value={rNote} onChange={setRNote} placeholder="e.g. Monthly salary"/>
        <Label required>Frequency</Label>
        <Select value={rFreq} onChange={setRFreq} options={[
          { value:"daily",   label:"Daily"   },
          { value:"weekly",  label:"Weekly"  },
          { value:"monthly", label:"Monthly" },
          { value:"yearly",  label:"Yearly"  },
        ]}/>
        <Label>Day of Transfer</Label>
        <Select value={rDay} onChange={setRDay} options={
          rFreq==="weekly"
            ? ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,i)=>({value:String(i+1),label:d}))
            : Array.from({length:28},(_,i)=>({ value:String(i+1), label:`${i+1}${i===0?"st":i===1?"nd":i===2?"rd":"th"} of each month` }))
        }/>
        <div style={{ background:T.navyLight, borderRadius:12, padding:"12px 16px",
          marginBottom:16, fontSize:12, color:T.textMid }}>
          Panda will automatically send <strong style={{ color:T.navy }}>{rAmt?fmt(parseInt(rAmt.replace(/,/g,""))||0):"the amount"}</strong> to <strong style={{ color:T.navy }}>{rTo||"the recipient"}</strong> {rFreq}. You can pause or cancel at any time.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
          <Btn full variant="gold" icon="repeat" onClick={create}>Start Recurring Transfer</Btn>
        </div>
      </> : <div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:T.greenBg,
          border:`2px solid ${T.green}44`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="check" size={28} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:6 }}>Transfer Scheduled!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          Panda will automatically send {fmt(parseInt(rAmt.replace(/,/g,"")||0))} to {rTo} {rFreq.toLowerCase()}.
        </div>
        <Btn variant="gold" onClick={()=>{setModal(false);setDone(false);}}>Done</Btn>
      </div>}
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP — BATCH 3 SHOWCASE
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("merchant");
  const [toasts, setToasts] = useState([]);

  const toast = (title, msg, color=T.gold) => {
    const id = Date.now();
    setToasts(t=>[...t,{id,title,msg,color}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3800);
  };

  const SCREENS = [
    { id:"merchant",    label:"Merchant Wallet",       icon:"store"   },
    { id:"collections", label:"Business Collections",  icon:"qr"      },
    { id:"escrow",      label:"Escrow",                icon:"shield"  },
    { id:"recurring",   label:"Recurring Transfers",   icon:"repeat"  },
  ];

  return <div style={{ background:T.bg, minHeight:"100vh", color:T.text,
    fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif" }}>
    <style>{`
      @keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
      @keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
      *{box-sizing:border-box;}
      input::placeholder,textarea::placeholder{color:#8A9BC0;}
      select{appearance:none;-webkit-appearance:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:#F5F7FF;}
      ::-webkit-scrollbar-thumb{background:#DDE3F5;border-radius:99px;}
      button:hover{opacity:0.9;}
    `}</style>

    <Toast toasts={toasts}/>

    {/* Header */}
    <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`,
      padding:"16px 20px", position:"sticky", top:0, zIndex:100,
      boxShadow:"0 2px 12px rgba(11,31,75,0.06)" }}>
      <div style={{ maxWidth:640, margin:"0 auto", display:"flex",
        justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:T.textMute, letterSpacing:1,
            textTransform:"uppercase", fontWeight:600 }}>Panda Finance</div>
          <div style={{ fontSize:20, fontWeight:900, color:T.navy, letterSpacing:-0.5 }}>
            Business Tools
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Badge color={T.gold}>Batch 3</Badge>
          <div style={{ width:40, height:40, borderRadius:12,
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:15, color:"#fff",
            boxShadow:`0 4px 14px ${T.navy}44` }}>B</div>
        </div>
      </div>
    </div>

    {/* Screen tabs */}
    <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`,
      padding:"10px 20px", overflowX:"auto" }}>
      <div style={{ maxWidth:640, margin:"0 auto", display:"flex", gap:6 }}>
        {SCREENS.map(s=><button key={s.id} onClick={()=>setScreen(s.id)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px",
            borderRadius:12, border:"none", cursor:"pointer", fontFamily:"inherit",
            fontWeight:screen===s.id?800:500, fontSize:13, transition:"all 0.18s",
            background:screen===s.id?T.navy:"transparent",
            color:screen===s.id?"#fff":T.textMute, whiteSpace:"nowrap",
            boxShadow:screen===s.id?`0 4px 14px ${T.navy}33`:"none" }}>
          <Icon name={s.icon} size={15} color={screen===s.id?"#fff":T.textMute}/>
          {s.label}
        </button>)}
      </div>
    </div>

    <div style={{ padding:"24px 16px 60px", maxWidth:640, margin:"0 auto" }}>
      {screen==="merchant"    && <MerchantWallet    toast={toast}/>}
      {screen==="collections" && <BusinessCollections toast={toast}/>}
      {screen==="escrow"      && <EscrowWallet      toast={toast}/>}
      {screen==="recurring"   && <RecurringTransfers toast={toast}/>}
    </div>
  </div>;
}
