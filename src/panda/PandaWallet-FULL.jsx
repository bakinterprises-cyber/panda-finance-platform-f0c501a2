import { useState, useRef } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg:"#F5F7FF", surface:"#FFFFFF", card:"#FFFFFF", cardAlt:"#F0F4FF",
  navy:"#0B1F4B", navyMid:"#1A3A6E", navyLight:"#EEF2FF",
  gold:"#C9960A", goldLight:"#FFF8E1", goldMid:"#F5C842",
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

const fmt    = n => "TSh " + Number(n).toLocaleString();
const fmtUSD = n => "$" + Number(n).toFixed(2);
const fmtKES = n => "KES " + Number(n).toLocaleString();
const fmtUGX = n => "UGX " + Number(n).toLocaleString();
const fmtPts = n => Number(n).toLocaleString() + " pts";
const genID  = () => "PF2026-" + Math.floor(10000000 + Math.random() * 90000000);
const genTX  = () => "TX-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase();

const CONTACTS = [
  { username:"@amina",  name:"Amina Hassan",  initials:"AH", color:"#6D28D9", verified:true  },
  { username:"@juma",   name:"Juma Mwangi",   initials:"JM", color:"#0A7B4B", verified:true  },
  { username:"@fatuma", name:"Fatuma Ali",     initials:"FA", color:"#C0392B", verified:false },
  { username:"@hassan", name:"Hassan Kimaro",  initials:"HK", color:"#1D4ED8", verified:true  },
  { username:"@zawadi", name:"Zawadi Mushi",   initials:"ZM", color:"#C9960A", verified:true  },
];

const PROVIDERS = [
  { n:"M-Pesa",       b:1240000, color:"#00A550", initial:"M", ussd:"*150*00#" },
  { n:"Airtel Money", b:890000,  color:"#E01A22", initial:"A", ussd:"*150*60#" },
  { n:"Mixx by Yas",  b:320000,  color:"#0066CC", initial:"Y", ussd:"*150*30#" },
  { n:"HaloPesa",     b:210000,  color:"#FF6B00", initial:"H", ussd:"*150*88#" },
  { n:"NMB Bank",     b:1800000, color:"#1A3A6E", initial:"N", ussd:"App/USSD" },
  { n:"CRDB Bank",    b:360000,  color:"#006633", initial:"C", ussd:"App/USSD" },
];

const INIT_TXS = [
  { id:"TX-M8X2K-AA", type:"in",  from:"@amina",  to:"@bak",   amt:150000, note:"Website Design Payment", time:"Today, 09:14",    fee:0    },
  { id:"TX-L7Z9P-BB", type:"out", from:"@bak",    to:"@juma",  amt:50000,  note:"Lunch",                  time:"Today, 08:30",    fee:0    },
  { id:"TX-K3V1Q-CC", type:"in",  from:"@hassan", to:"@bak",   amt:300000, note:"Rent Split",             time:"Yesterday",       fee:0    },
  { id:"TX-J9W4R-DD", type:"out", from:"@bak",    to:"M-Pesa", amt:80000,  note:"Withdrawal to M-Pesa",  time:"Yesterday",       fee:1500 },
  { id:"TX-I5T6S-EE", type:"out", from:"@bak",    to:"LUKU",   amt:45000,  note:"Electricity Bill",      time:"Jun 12",          fee:500  },
  { id:"TX-H2U8T-FF", type:"in",  from:"@zawadi", to:"@bak",   amt:200000, note:"Vikoba Contribution",   time:"Jun 11",          fee:0    },
];

const INIT_FEED = [
  { id:1, from:"@amina",  to:"@juma",   color:"#6D28D9", amt:50000,  note:"Dinner",         time:"2 min ago",  pub:true,  likes:4, liked:false, comments:["Nice one!"] },
  { id:2, from:"@hassan", to:"@zawadi", color:"#1D4ED8", amt:120000, note:"Rent split",     time:"15 min ago", pub:true,  likes:2, liked:false, comments:[] },
  { id:3, from:"@bak",    to:"@amina",  color:"#0B1F4B", amt:150000, note:"Website Design", time:"1 hr ago",   pub:true,  likes:8, liked:true,  comments:["Great work BAK"] },
  { id:4, from:"@zawadi", to:"@hassan", color:"#C9960A", amt:80000,  note:"Vikoba savings", time:"3 hrs ago",  pub:true,  likes:6, liked:false, comments:[] },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor" }) => {
  const s = { stroke:color, strokeWidth:"1.6", fill:"none" };
  const icons = {
    home:       <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    send:       <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    download:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="7 10 12 15 17 10" {...s}/><line x1="12" y1="15" x2="12" y2="3" {...s}/></>,
    upload:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s}/><polyline points="17 8 12 3 7 8" {...s}/><line x1="12" y1="3" x2="12" y2="15" {...s}/></>,
    inbox:      <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" {...s}/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" {...s}/></>,
    zap:        <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...s}/></>,
    globe:      <><circle cx="12" cy="12" r="10" {...s}/><line x1="2" y1="12" x2="22" y2="12" {...s}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s}/></>,
    creditCard: <><rect x="1" y="4" width="22" height="16" rx="2" {...s}/><line x1="1" y1="10" x2="23" y2="10" {...s}/></>,
    trending:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    bot:        <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><path d="M7 15h0M12 15h0M17 15h0" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/></>,
    users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...s}/><circle cx="9" cy="7" r="4" {...s}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...s}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...s}/></>,
    store:      <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V12a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v9" {...s}/><path d="M2 7l2-4h16l2 4" {...s}/></>,
    shield:     <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" fill="none"/></>,
    star:       <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth="1.4" fill={color} opacity="0.85"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...s}/><path d="M13.73 21a2 2 0 0 1-3.46 0" {...s}/></>,
    wallet:     <><rect x="2" y="5" width="20" height="15" rx="2" {...s}/><path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill={color} stroke="none"/><path d="M2 10h20" {...s}/></>,
    repeat:     <><polyline points="17 1 21 5 17 9" {...s}/><path d="M3 11V9a4 4 0 0 1 4-4h14" {...s}/><polyline points="7 23 3 19 7 15" {...s}/><path d="M21 13v2a4 4 0 0 1-4 4H3" {...s}/></>,
    qr:         <><rect x="3" y="3" width="7" height="7" rx="1" {...s}/><rect x="14" y="3" width="7" height="7" rx="1" {...s}/><rect x="3" y="14" width="7" height="7" rx="1" {...s}/><rect x="5" y="5" width="3" height="3" fill={color} stroke="none"/><rect x="16" y="5" width="3" height="3" fill={color} stroke="none"/><rect x="5" y="16" width="3" height="3" fill={color} stroke="none"/></>,
    link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...s}/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...s}/></>,
    invoice:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="8" y1="13" x2="16" y2="13" {...s}/><line x1="8" y1="17" x2="13" y2="17" {...s}/></>,
    lock:       <><rect x="3" y="11" width="18" height="11" rx="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/><circle cx="12" cy="16" r="1.5" fill={color} stroke="none"/></>,
    key:        <><circle cx="7.5" cy="15.5" r="3.5" {...s}/><path d="M10.5 12L22 2" {...s}/><path d="M19 5l2 2M16 8l2 2" {...s}/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...s}/><polyline points="16 17 21 12 16 7" {...s}/><line x1="21" y1="12" x2="9" y2="12" {...s}/></>,
    gift:       <><polyline points="20 12 20 22 4 22 4 12" {...s}/><rect x="2" y="7" width="20" height="5" rx="1" {...s}/><line x1="12" y1="22" x2="12" y2="7" {...s}/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" {...s}/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" {...s}/></>,
    share:      <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    arrowUD:    <><polyline points="7 16 12 21 17 16" {...s}/><polyline points="7 8 12 3 17 8" {...s}/></>,
    refresh:    <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    check:      <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8"/></>,
    copy:       <><rect x="9" y="9" width="13" height="13" rx="2" {...s}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...s}/></>,
    trash:      <><polyline points="3 6 5 6 21 6" {...s}/><path d="M19 6l-1 14H6L5 6" {...s}/><path d="M10 11v6M14 11v6M9 6V4h6v2" {...s}/></>,
    barChart:   <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="1.8"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="1.8"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="1.8"/></>,
    piggyBank:  <><path d="M19 11c0-3.87-3.13-7-7-7s-7 3.13-7 7" {...s}/><path d="M5 11H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2M19 11h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2M12 20v-6M8 20h8" {...s}/></>,
    award:      <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    settings:   <><circle cx="12" cy="12" r="3" {...s}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...s}/></>,
    eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...s}/><circle cx="12" cy="12" r="3" {...s}/></>,
    chevron:    <><polyline points="9 18 15 12 9 6" {...s}/></>,
    smartphone: <><rect x="5" y="2" width="14" height="20" rx="2" {...s}/><line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:    <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="4" {...s}/></>,
    fingerprint:<><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" {...s}/><path d="M5 12a7 7 0 0 1 7-7M8 12a4 4 0 0 1 8 0c0 2-1 4-2 5" {...s}/><path d="M12 12v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0 }}>{icons[name]||null}</svg>;
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Avatar({ initials, color, size=36, fs=13 }) {
  return <div style={{ width:size,height:size,borderRadius:"50%",background:color+"22",border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:fs,fontWeight:800,color,flexShrink:0 }}>{initials}</div>;
}
function Badge({ children, color }) {
  return <span style={{ background:color+"15",color,border:`1px solid ${color}30`,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4 }}>{children}</span>;
}
function Label({ children, required }) {
  return <div style={{ fontSize:12,fontWeight:700,color:T.textMid,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8 }}>{children}{required&&<span style={{ color:T.red }}> *</span>}</div>;
}
function Field({ value, onChange, placeholder, prefix, type="text", multi }) {
  const [f,setF]=useState(false);
  const base={ width:"100%",background:f?T.surface:T.cardAlt,border:`1.5px solid ${f?T.navy:T.border}`,borderRadius:12,padding:prefix?"13px 14px 13px 44px":"13px 14px",color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",transition:"all 0.2s",boxSizing:"border-box",fontWeight:500 };
  return <div style={{ position:"relative",marginBottom:16 }}>
    {prefix&&<span style={{ position:"absolute",left:14,top:multi?14:"50%",transform:multi?"none":"translateY(-50%)",fontSize:13,color:T.textMute,fontWeight:600,pointerEvents:"none" }}>{prefix}</span>}
    {multi?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base,resize:"vertical" }} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
    :<input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} style={base} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>}
  </div>;
}
function Select({ value, onChange, options }) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%",background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"13px 14px",color:T.text,fontSize:14,fontFamily:"inherit",outline:"none",marginBottom:16,boxSizing:"border-box",fontWeight:500,appearance:"none" }}>
    {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}
function Btn({ children, onClick, variant="primary", size="md", loading, full, icon, disabled }) {
  const p=size==="sm"?"8px 16px":size==="lg"?"15px 32px":"12px 22px";
  const fs=size==="sm"?12:size==="lg"?14:13;
  const V={ primary:{background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,color:"#fff",boxShadow:`0 4px 14px ${T.navy}33`,border:"none"},gold:{background:`linear-gradient(135deg,${T.gold},#A07008)`,color:"#fff",boxShadow:`0 4px 14px ${T.gold}44`,border:"none"},outline:{background:"transparent",color:T.navy,border:`1.5px solid ${T.navy}33`},ghost:{background:T.cardAlt,color:T.textMid,border:`1px solid ${T.border}`},success:{background:T.greenBg,color:T.green,border:`1px solid ${T.green}33`},danger:{background:T.redBg,color:T.red,border:`1px solid ${T.red}33`},amber:{background:T.amberBg,color:T.amber,border:`1px solid ${T.amber}33`} };
  return <button onClick={onClick} disabled={!!loading||!!disabled} style={{ borderRadius:12,cursor:loading||disabled?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700,transition:"all 0.18s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:p,fontSize:fs,width:full?"100%":"auto",opacity:loading||disabled?0.6:1,...V[variant] }}>
    {icon&&<Icon name={icon} size={fs+2} color="currentColor"/>}
    {loading?"Processing...":children}
  </button>;
}
function Card({ children, style={} }) {
  return <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:20,boxShadow:T.shadow,...style }}>{children}</div>;
}
function SHead({ title, sub, action, onAction }) {
  return <div style={{ marginBottom:16 }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <div style={{ fontSize:15,fontWeight:800,color:T.text,letterSpacing:-0.3 }}>{title}</div>
      {action&&<button onClick={onAction} style={{ fontSize:12,color:T.gold,background:"none",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"inherit" }}>{action}</button>}
    </div>
    {sub&&<div style={{ fontSize:12,color:T.textMute,marginTop:3 }}>{sub}</div>}
  </div>;
}
function Divider() { return <div style={{ height:1,background:T.border,margin:"14px 0" }}/>; }
function Toggle({ value, onChange, label, sub, color=T.green }) {
  return <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.border}` }}>
    <div>
      <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:2 }}>{label}</div>
      {sub&&<div style={{ fontSize:11,color:T.textMute }}>{sub}</div>}
    </div>
    <div onClick={()=>onChange(!value)} style={{ width:48,height:26,borderRadius:99,background:value?color:T.border,cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0 }}>
      <div style={{ width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:value?25:3,transition:"left 0.25s",boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }}/>
    </div>
  </div>;
}
function Toast({ toasts }) {
  return <div style={{ position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none" }}>
    {toasts.map(t=><div key={t.id} style={{ background:T.surface,borderLeft:`4px solid ${t.color||T.gold}`,borderRadius:12,padding:"12px 18px",boxShadow:T.shadowMd,minWidth:270,maxWidth:340,animation:"toastIn 0.3s ease",border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:12,color:T.textMute }}>{t.msg}</div>
    </div>)}
  </div>;
}
function Modal({ title, subtitle, onClose, children }) {
  return <div style={{ position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(11,31,75,0.45)",backdropFilter:"blur(6px)" }}>
    <div style={{ background:T.surface,borderRadius:24,padding:"28px 26px",width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",boxShadow:T.shadowLg,border:`1px solid ${T.border}`,position:"relative",animation:"modalIn 0.25s ease" }}>
      <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:2,background:`linear-gradient(90deg,transparent,${T.gold},transparent)`,borderRadius:99 }}/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22 }}>
        <div>
          <div style={{ fontSize:16,fontWeight:800,color:T.text }}>{title}</div>
          {subtitle&&<div style={{ fontSize:12,color:T.textMute,marginTop:3 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ width:32,height:32,borderRadius:8,background:T.cardAlt,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name="x" size={14} color={T.textMute}/>
        </button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── Bank Card ────────────────────────────────────────────────────────────────
function BankCard({ balance, walletID, username, visible, onToggle }) {
  return <div style={{ background:`linear-gradient(145deg,#0B1F4B 0%,#1A3A6E 50%,#0F2A5C 100%)`,borderRadius:24,padding:"28px 26px 24px",marginBottom:20,position:"relative",overflow:"hidden",boxShadow:"0 24px 64px rgba(11,31,75,0.35),0 0 0 1px rgba(201,150,10,0.2)" }}>
    <div style={{ position:"absolute",top:-80,right:-80,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,150,10,0.15),transparent 70%)",pointerEvents:"none" }}/>
    <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.6),transparent)" }}/>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,position:"relative",zIndex:1 }}>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ width:44,height:32,background:"linear-gradient(135deg,#C9960A,#F5D060)",borderRadius:7,boxShadow:"0 4px 12px rgba(201,150,10,0.5)" }}/>
        <div>
          <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase" }}>Panda Finance</div>
          <div style={{ fontSize:13,color:"#C9960A",fontWeight:800 }}>Digital Wallet</div>
        </div>
      </div>
      <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"4px 14px",border:"1px solid rgba(255,255,255,0.12)" }}>
        <span style={{ fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:1.5 }}>PANDA PAY</span>
      </div>
    </div>
    <div style={{ marginBottom:24,position:"relative",zIndex:1 }}>
      <div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:8 }}>Total Balance</div>
      <div style={{ display:"flex",alignItems:"center",gap:14 }}>
        <div style={{ fontSize:34,fontWeight:900,color:"#fff",letterSpacing:-1,fontFamily:"monospace",lineHeight:1 }}>
          {visible?fmt(balance):"TSh •••••••"}
        </div>
        <button onClick={onToggle} style={{ background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"5px 12px",color:"rgba(255,255,255,0.65)",fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"inherit" }}>
          {visible?"Hide":"Show"}
        </button>
      </div>
    </div>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",position:"relative",zIndex:1 }}>
      <div>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:5 }}>Wallet ID</div>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.75)",fontFamily:"monospace",letterSpacing:2 }}>{walletID}</div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:5 }}>Username</div>
        <div style={{ fontSize:16,color:"#F5D060",fontWeight:900,fontFamily:"monospace" }}>{username}</div>
      </div>
    </div>
  </div>;
}

function QBtn({ icon, label, color, bg, onClick }) {
  const [hov,setHov]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{ flex:1,minWidth:80,display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"16px 8px",background:hov?bg:T.surface,border:`1.5px solid ${hov?color:T.border}`,borderRadius:16,cursor:"pointer",transition:"all 0.18s",fontFamily:"inherit",boxShadow:hov?`0 4px 20px ${color}22`:T.shadow }}>
    <div style={{ width:48,height:48,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${color}22` }}>
      <Icon name={icon} size={22} color={color}/>
    </div>
    <div style={{ fontSize:11,fontWeight:700,color:hov?color:T.textMid,textAlign:"center",lineHeight:1.3 }}>{label}</div>
  </button>;
}

function TxRow({ tx, last }) {
  const isIn=tx.type==="in";
  const contact=CONTACTS.find(c=>c.username===(isIn?tx.from:tx.to));
  return <div style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:last?"none":`1px solid ${T.border}` }}>
    {contact
      ?<Avatar initials={contact.initials} color={contact.color} size={44} fs={14}/>
      :<div style={{ width:44,height:44,borderRadius:14,background:isIn?T.greenBg:T.redBg,border:`1px solid ${isIn?T.green:T.red}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:isIn?T.green:T.red,flexShrink:0 }}>{isIn?"IN":"OUT"}</div>}
    <div style={{ flex:1,minWidth:0 }}>
      <div style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{isIn?tx.from:tx.to}</div>
      <div style={{ fontSize:12,color:T.textMute }}>{tx.note}</div>
      <div style={{ fontSize:10,color:T.textMute,opacity:0.6,fontFamily:"monospace",marginTop:1 }}>{tx.id}</div>
    </div>
    <div style={{ textAlign:"right",flexShrink:0 }}>
      <div style={{ fontSize:15,fontWeight:900,color:isIn?T.green:T.text,fontFamily:"monospace",marginBottom:2 }}>{isIn?"+":"-"}{fmt(tx.amt)}</div>
      {tx.fee>0?<div style={{ fontSize:10,color:T.textMute }}>Fee: {fmt(tx.fee)}</div>:<Badge color={T.green}>Free</Badge>}
      <div style={{ fontSize:10,color:T.textMute,marginTop:2 }}>{tx.time}</div>
    </div>
  </div>;
}

function FeedCard({ item, onLike, onComment }) {
  const [showC,setShowC]=useState(false);
  const [newC,setNewC]=useState("");
  const initials=item.from.replace("@","").slice(0,2).toUpperCase();
  return <Card style={{ marginBottom:12,padding:"18px 20px" }}>
    <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:14 }}>
      <Avatar initials={initials} color={item.color} size={42} fs={14}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13,color:T.textMid,marginBottom:3 }}>
          <span style={{ fontWeight:800,color:T.text }}>{item.from}</span><span> paid </span><span style={{ fontWeight:800,color:T.gold }}>{item.to}</span>
        </div>
        <div style={{ fontSize:15,fontWeight:700,color:T.text,marginBottom:4 }}>{item.note}</div>
        <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
          <span style={{ fontSize:15,fontWeight:900,color:T.green,fontFamily:"monospace" }}>{fmt(item.amt)}</span>
          <Badge color={item.pub?T.green:T.textMute}>{item.pub?"Public":"Private"}</Badge>
          <span style={{ fontSize:11,color:T.textMute }}>{item.time}</span>
        </div>
      </div>
    </div>
    <Divider/>
    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
      <button onClick={()=>onLike(item.id)} style={{ display:"flex",alignItems:"center",gap:6,background:item.liked?T.redBg:T.cardAlt,border:`1px solid ${item.liked?T.red+"44":T.border}`,borderRadius:10,padding:"7px 14px",cursor:"pointer",color:item.liked?T.red:T.textMid,fontSize:12,fontWeight:700,fontFamily:"inherit",transition:"all 0.18s" }}>
        {item.liked?"♥":"♡"} {item.likes}
      </button>
      <button onClick={()=>setShowC(v=>!v)} style={{ display:"flex",alignItems:"center",gap:6,background:T.cardAlt,border:`1px solid ${T.border}`,borderRadius:10,padding:"7px 14px",cursor:"pointer",color:T.textMid,fontSize:12,fontWeight:700,fontFamily:"inherit" }}>
        <Icon name="zap" size={12} color={T.textMid}/> {item.comments.length}
      </button>
      <button style={{ marginLeft:"auto",background:T.navyLight,border:`1px solid ${T.navy}22`,borderRadius:10,padding:"7px 14px",cursor:"pointer",color:T.navy,fontSize:12,fontWeight:700,fontFamily:"inherit" }}>Pay Back</button>
    </div>
    {showC&&<div style={{ marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}` }}>
      {item.comments.map((c,i)=><div key={i} style={{ background:T.cardAlt,borderRadius:10,padding:"8px 12px",fontSize:12,color:T.textMid,marginBottom:6 }}>{c}</div>)}
      <div style={{ display:"flex",gap:8,marginTop:8 }}>
        <input value={newC} onChange={e=>setNewC(e.target.value)} placeholder="Add a comment..." style={{ flex:1,background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:12,fontFamily:"inherit",outline:"none" }} onKeyDown={e=>{if(e.key==="Enter"&&newC.trim()){onComment(item.id,newC);setNewC("");}}}/>
        <Btn size="sm" variant="gold" onClick={()=>{if(newC.trim()){onComment(item.id,newC);setNewC("");}}}>Send</Btn>
      </div>
    </div>}
  </Card>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE WALLET — B1 + B2
// ═══════════════════════════════════════════════════════════════════════════════
function CoreWallet({ balance, setBalance, txs, setTxs, feed, setFeed, notifs, setNotifs, toast, walletID }) {
  const [tab,setTab]=useState("home");
  const [modal,setModal]=useState(null);
  const [visible,setVisible]=useState(true);
  const [requests,setRequests]=useState([
    { id:1,from:"@amina",amt:100000,note:"Website Design Balance",time:"2 hours ago" },
    { id:2,from:"@juma",amt:25000,note:"Coffee",time:"Yesterday" },
  ]);
  const [selProv,setSelProv]=useState("M-Pesa");
  const [amt,setAmt]=useState("");
  const [toUser,setToUser]=useState("");
  const [toPhone,setToPhone]=useState("");
  const [note,setNote]=useState("");
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const [splitAmt,setSplitAmt]=useState("");
  const [linkAmt,setLinkAmt]=useState("");
  const [linkNote,setLinkNote]=useState("");
  const [linkGen,setLinkGen]=useState(false);
  const [copied,setCopied]=useState(false);
  const splitPeople=["@amina","@juma","@hassan"];
  const totalIn=txs.filter(t=>t.type==="in").reduce((s,t)=>s+t.amt,0);
  const totalOut=txs.filter(t=>t.type==="out").reduce((s,t)=>s+t.amt,0);
  const unread=notifs.filter(n=>!n.read).length;
  const link="panda.tz/pay/bak"+(linkAmt?"?amt="+linkAmt.replace(/,/g,""):"")+(linkNote?"&note="+encodeURIComponent(linkNote):"");
  const open=name=>{setModal(name);setDone(false);setAmt("");setToUser("");setToPhone("");setNote("");};
  const confirm=()=>{
    const a=parseInt(amt.replace(/,/g,""))||0;
    if(a<=0||(modal!=="Add Money"&&a>balance))return;
    setLoading(true);
    setTimeout(()=>{
      const fee=modal==="Send to Panda"?0:modal==="Withdraw"?1500:modal==="Pay Bill"?500:0;
      const tx={id:genTX(),type:modal==="Add Money"?"in":"out",from:modal==="Add Money"?selProv:"@bak",to:modal==="Send to Panda"?(toUser||"@user"):modal==="Withdraw"?selProv:modal==="Pay Bill"?"Bill":toPhone||selProv,amt:a,note:note||modal,time:"Just now",fee};
      setTxs(t=>[tx,...t]);
      if(modal==="Add Money")setBalance(b=>b+a); else setBalance(b=>Math.max(0,b-a-fee));
      if(modal==="Send to Panda"&&toUser){
        setFeed(f=>[{id:Date.now(),from:"@bak",to:toUser,color:T.navy,amt:a,note:note||"Payment",time:"Just now",pub:true,likes:0,liked:false,comments:[]},...f]);
        setNotifs(n=>[{id:Date.now(),icon:"send",title:"Payment Sent",msg:`You sent ${toUser} ${fmt(a)}`,time:"Just now",color:T.gold,read:false},...n]);
      }
      toast(modal==="Add Money"?"Money Added!":modal==="Send to Panda"?"Sent!":"Done!",modal==="Send to Panda"?`${fmt(a)} sent to ${toUser} — FREE!`:`${fmt(a)} processed`,T.gold);
      setDone(true);setLoading(false);
    },1400);
  };
  const confirmReq=()=>{const a=parseInt(amt.replace(/,/g,""))||0;if(!toUser||!a)return;setLoading(true);setTimeout(()=>{toast("Request Sent!",`${toUser} asked to pay ${fmt(a)}`,T.purple);setDone(true);setLoading(false);},1200);};
  const confirmSplit=()=>{const a=parseInt(splitAmt.replace(/,/g,""))||0;if(!a)return;setLoading(true);setTimeout(()=>{toast("Split Sent!",`Requests sent to ${splitPeople.join(", ")}`,T.amber);setDone(true);setLoading(false);},1300);};
  const acceptReq=req=>{setTxs(t=>[{id:genTX(),type:"in",from:req.from,to:"@bak",amt:req.amt,note:req.note,time:"Just now",fee:0},...t]);setBalance(b=>b+req.amt);setRequests(r=>r.filter(x=>x.id!==req.id));toast("Received!",`${fmt(req.amt)} from ${req.from}`,T.green);};
  const TABS=[
    {id:"home",icon:"home",l:"Home"},{id:"send",icon:"send",l:"Send"},{id:"request",icon:"inbox",l:"Request"},
    {id:"social",icon:"users",l:"Social"},{id:"paylink",icon:"link",l:"Pay Link"},
    {id:"history",icon:"barChart",l:"History"},{id:"accounts",icon:"wallet",l:"Accounts"},
    {id:"notifs",icon:"bell",l:"Alerts",badge:unread||undefined},
  ];
  const SuccessBox=({title,sub,extra})=><div style={{ textAlign:"center",padding:"28px 0" }}>
    <div style={{ width:72,height:72,borderRadius:"50%",background:T.greenBg,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px" }}><Icon name="check" size={32} color={T.green}/></div>
    <div style={{ fontSize:20,fontWeight:900,color:T.text,marginBottom:8 }}>{title}</div>
    <div style={{ fontSize:13,color:T.textMute,marginBottom:extra?6:20 }}>{sub}</div>
    {extra&&<div style={{ fontSize:12,color:T.green,fontWeight:700,marginBottom:20 }}>{extra}</div>}
    <Btn variant="gold" onClick={()=>{setModal(null);setDone(false);setAmt("");}}>Done</Btn>
  </div>;

  return <div>
    <BankCard balance={balance} walletID={walletID} username="@bak" visible={visible} onToggle={()=>setVisible(v=>!v)}/>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18 }}>
      <Card style={{ padding:"16px 18px" }}>
        <div style={{ fontSize:11,color:T.textMute,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6 }}>Money In</div>
        <div style={{ fontSize:20,fontWeight:900,color:T.green,fontFamily:"monospace" }}>+{fmt(totalIn)}</div>
        <div style={{ marginTop:6 }}><Badge color={T.green}>This month</Badge></div>
      </Card>
      <Card style={{ padding:"16px 18px" }}>
        <div style={{ fontSize:11,color:T.textMute,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6 }}>Money Out</div>
        <div style={{ fontSize:20,fontWeight:900,color:T.text,fontFamily:"monospace" }}>-{fmt(totalOut)}</div>
        <div style={{ marginTop:6 }}><Badge color={T.textMute}>This month</Badge></div>
      </Card>
    </div>
    <Card style={{ marginBottom:18 }}>
      <SHead title="Quick Actions"/>
      <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
        <QBtn icon="send"     label="Send"     color={T.gold}   bg={T.goldLight} onClick={()=>open("Send to Panda")}/>
        <QBtn icon="download" label="Add"      color={T.green}  bg={T.greenBg}   onClick={()=>open("Add Money")}/>
        <QBtn icon="upload"   label="Withdraw" color={T.blue}   bg={T.blueBg}    onClick={()=>open("Withdraw")}/>
        <QBtn icon="inbox"    label="Request"  color={T.purple} bg={T.purpleBg}  onClick={()=>open("Request Money")}/>
        <QBtn icon="zap"      label="Split"    color={T.amber}  bg={T.amberBg}   onClick={()=>open("Split Payment")}/>
        <QBtn icon="invoice"  label="Pay Bill" color={T.navy}   bg={T.navyLight} onClick={()=>open("Pay Bill")}/>
      </div>
    </Card>
    <div style={{ display:"flex",gap:4,marginBottom:18,background:T.surface,borderRadius:16,padding:5,border:`1px solid ${T.border}`,boxShadow:T.shadow,overflowX:"auto" }}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,minWidth:55,padding:"9px 4px",borderRadius:12,border:"none",background:tab===t.id?T.navy:"transparent",color:tab===t.id?"#fff":T.textMute,fontWeight:tab===t.id?800:500,fontSize:10,cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative",whiteSpace:"nowrap" }}>
        <Icon name={t.icon} size={15} color={tab===t.id?"#fff":T.textMute}/>
        <span>{t.l}</span>
        {t.badge&&<span style={{ position:"absolute",top:2,right:4,background:T.red,color:"#fff",borderRadius:99,padding:"1px 4px",fontSize:9,fontWeight:900 }}>{t.badge}</span>}
      </button>)}
    </div>

    {tab==="home"&&<>
      {requests.length>0&&<div style={{ background:T.amberBg,border:`1px solid ${T.amber}33`,borderRadius:20,padding:"18px 20px",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}><div style={{ fontSize:15,fontWeight:800,color:T.text }}>Pending Requests</div><Badge color={T.amber}>{requests.length} new</Badge></div>
        {requests.map((r,i)=><div key={r.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",flexWrap:"wrap",gap:8,borderTop:i>0?`1px solid ${T.amber}22`:"none" }}>
          <div><div style={{ fontSize:13,fontWeight:700,color:T.text }}><span style={{ color:T.navy }}>{r.from}</span>{" requests "}<span style={{ color:T.green,fontFamily:"monospace" }}>{fmt(r.amt)}</span></div><div style={{ fontSize:11,color:T.textMute,marginTop:2 }}>{r.note} · {r.time}</div></div>
          <div style={{ display:"flex",gap:8 }}><Btn size="sm" variant="gold" onClick={()=>acceptReq(r)}>Accept</Btn><Btn size="sm" variant="ghost" onClick={()=>setRequests(rx=>rx.filter(x=>x.id!==r.id))}>Decline</Btn></div>
        </div>)}
      </div>}
      <Card style={{ marginBottom:14 }}>
        <SHead title="Send to Friends" sub="Panda-to-Panda is always free"/>
        <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
          {CONTACTS.map(u=><div key={u.username} onClick={()=>{open("Send to Panda");setToUser(u.username);}} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",minWidth:64,padding:"12px 8px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.cardAlt,transition:"all 0.18s",flexShrink:0 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.goldLight;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.cardAlt;}}>
            <div style={{ position:"relative" }}><Avatar initials={u.initials} color={u.color} size={40} fs={13}/>{u.verified&&<div style={{ position:"absolute",bottom:-2,right:-2,width:14,height:14,background:T.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:900,border:`2px solid ${T.surface}` }}>✓</div>}</div>
            <div style={{ fontSize:10,fontWeight:700,color:T.textMid,textAlign:"center" }}>{u.username}</div>
          </div>)}
        </div>
        <div style={{ marginTop:12,padding:"8px 12px",background:T.greenBg,borderRadius:10,fontSize:12,color:T.green,fontWeight:600 }}>Panda-to-Panda transfers are free and instant</div>
      </Card>
      <Card><SHead title="Recent Transactions" action="View All" onAction={()=>setTab("history")}/>{txs.slice(0,4).map((t,i)=><TxRow key={t.id} tx={t} last={i===3}/>)}</Card>
    </>}

    {tab==="send"&&<>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Send Money" sub="Choose your transfer method"/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[{ic:"users",label:"To Panda User",sub:"Free · Instant",color:T.gold,m:"Send to Panda"},{ic:"smartphone",label:"To Phone",sub:"TSh 1,500 fee",color:T.blue,m:"Transfer"},{ic:"wallet",label:"To Bank",sub:"0.5% fee",color:T.navy,m:"Withdraw"},{ic:"invoice",label:"Pay Bill",sub:"LUKU · Water",color:T.amber,m:"Pay Bill"}].map(item=><div key={item.label} onClick={()=>open(item.m)} style={{ padding:"18px 14px",borderRadius:16,border:`1.5px solid ${T.border}`,background:T.cardAlt,cursor:"pointer",transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=item.color;e.currentTarget.style.background=T.surface;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.cardAlt;}}>
            <div style={{ marginBottom:10 }}><Icon name={item.ic} size={26} color={item.color}/></div>
            <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:4 }}>{item.label}</div>
            <div style={{ fontSize:11,color:T.textMute }}>{item.sub}</div>
          </div>)}
        </div>
      </Card>
      <Card><SHead title="Transfer Fees"/>
        {[["Panda to Panda",T.green,"FREE","Instant"],["Panda to M-Pesa",T.amber,"TSh 1,500","~1 min"],["Panda to Bank",T.blue,"0.5%","1–2 hrs"]].map(([l,c,f,t])=>(
          <div key={l} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13,color:T.text,fontWeight:600 }}>{l}</span>
            <div style={{ display:"flex",gap:14,alignItems:"center" }}><Badge color={c}>{f}</Badge><span style={{ fontSize:11,color:T.textMute,minWidth:55,textAlign:"right" }}>{t}</span></div>
          </div>))}
      </Card>
    </>}

    {tab==="request"&&<Card>
      <SHead title="Request Money" sub="Ask a Panda user to pay you"/>
      <Label required>From (Panda Username)</Label><Field value={toUser} onChange={setToUser} placeholder="e.g. @amina"/>
      {toUser.startsWith("@")&&toUser.length>1&&<div style={{ marginBottom:14 }}>{CONTACTS.filter(u=>u.username.includes(toUser.slice(1))).map(u=><div key={u.username} onClick={()=>setToUser(u.username)} style={{ display:"flex",gap:12,alignItems:"center",padding:"10px 14px",borderRadius:12,background:T.cardAlt,border:`1px solid ${T.border}`,marginBottom:6,cursor:"pointer" }}><Avatar initials={u.initials} color={u.color}/><div><div style={{ fontSize:13,fontWeight:700,color:T.text }}>{u.name}</div><div style={{ fontSize:11,color:T.textMute }}>{u.username}</div></div>{u.verified&&<Badge color={T.green}>Verified</Badge>}</div>)}</div>}
      <Label required>Amount</Label><Field value={amt} onChange={setAmt} placeholder="e.g. 100,000" prefix="TSh"/>
      <Label>Note</Label><Field value={note} onChange={setNote} placeholder="e.g. Website Design Balance"/>
      {!done?<Btn full variant="gold" icon="inbox" loading={loading} onClick={confirmReq}>Send Request</Btn>
      :<SuccessBox title="Request Sent!" sub={`${toUser} has been notified`}/>}
    </Card>}

    {tab==="social"&&<>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Social Feed" sub="See what your Panda friends are paying"/>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
          {["All Activity","Friends","My Payments"].map((f,i)=><button key={f} style={{ padding:"7px 16px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",background:i===0?T.navy:T.cardAlt,border:i===0?"none":`1px solid ${T.border}`,color:i===0?"#fff":T.textMid }}>{f}</button>)}
        </div>
      </Card>
      {feed.map(item=><FeedCard key={item.id} item={item}
        onLike={id=>setFeed(f=>f.map(x=>x.id===id?{...x,liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}:x))}
        onComment={(id,text)=>setFeed(f=>f.map(x=>x.id===id?{...x,comments:[...x.comments,text]}:x))}/>)}
    </>}

    {tab==="paylink"&&<Card>
      <SHead title="Payment Link" sub="Anyone can pay you — even without the Panda app"/>
      <Label>Amount (optional)</Label><Field value={linkAmt} onChange={setLinkAmt} placeholder="Leave blank for any amount" prefix="TSh"/>
      <Label>Note (optional)</Label><Field value={linkNote} onChange={setLinkNote} placeholder="e.g. Website Design Payment"/>
      {!linkGen?<Btn full variant="gold" icon="link" onClick={()=>setLinkGen(true)}>Generate Payment Link</Btn>
      :<div>
        <div style={{ background:T.navyLight,border:`1.5px solid ${T.navy}22`,borderRadius:14,padding:16,marginBottom:14 }}>
          <div style={{ fontSize:10,color:T.textMute,marginBottom:6,letterSpacing:1.5,textTransform:"uppercase" }}>Your Payment Link</div>
          <div style={{ fontSize:13,color:T.navy,fontFamily:"monospace",wordBreak:"break-all",fontWeight:700,marginBottom:12 }}>{link}</div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn size="sm" variant={copied?"success":"primary"} icon="copy" onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);toast("Copied","Link copied to clipboard.",T.navy);}}>
              {copied?"Copied!":"Copy Link"}
            </Btn>
            <Btn size="sm" variant="outline" icon="share" onClick={()=>toast("Shared","Link shared via WhatsApp.",T.green)}>Share</Btn>
          </div>
        </div>
        <Btn full variant="ghost" onClick={()=>setLinkGen(false)}>Generate New Link</Btn>
      </div>}
    </Card>}

    {tab==="history"&&<Card><SHead title="Transaction History" sub="Full ledger with unique tracking IDs"/>{txs.map((t,i)=><TxRow key={t.id} tx={t} last={i===txs.length-1}/>)}</Card>}

    {tab==="accounts"&&<Card>
      <SHead title="Linked Accounts" sub="Tap to select for transfers"/>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {PROVIDERS.map(p=><div key={p.n} onClick={()=>setSelProv(p.n)} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,cursor:"pointer",transition:"all 0.18s",border:`2px solid ${selProv===p.n?p.color:T.border}`,background:selProv===p.n?p.color+"08":T.cardAlt }}>
          <div style={{ width:44,height:44,borderRadius:12,background:p.color+"18",border:`1px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:p.color,flexShrink:0 }}>{p.initial}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:800,color:selProv===p.n?p.color:T.text }}>{p.n}</div><div style={{ fontSize:11,color:T.textMute,marginTop:2 }}>USSD: {p.ussd} · Linked</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:15,fontWeight:900,color:T.text,fontFamily:"monospace" }}>{fmt(p.b)}</div>{selProv===p.n&&<Badge color={p.color}>Selected</Badge>}</div>
        </div>)}
      </div>
    </Card>}

    {tab==="notifs"&&<Card>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
        <div><div style={{ fontSize:15,fontWeight:800,color:T.text }}>Notifications</div><div style={{ fontSize:12,color:T.textMute,marginTop:2 }}>Your payment alerts</div></div>
        {notifs.some(n=>!n.read)&&<Btn size="sm" variant="outline" onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))}>Mark all read</Btn>}
      </div>
      {notifs.map(n=><div key={n.id} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))} style={{ display:"flex",gap:14,alignItems:"flex-start",padding:13,borderRadius:14,cursor:"pointer",marginBottom:8,background:n.read?T.cardAlt:T.navyLight,border:`1px solid ${n.read?T.border:n.color+"33"}`,transition:"all 0.18s" }}>
        <div style={{ width:42,height:42,borderRadius:12,background:n.color+"18",border:`1px solid ${n.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name={n.icon||"bell"} size={18} color={n.color}/></div>
        <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:n.read?600:800,color:T.text,marginBottom:2 }}>{n.title}</div><div style={{ fontSize:12,color:T.textMute,marginBottom:2 }}>{n.msg}</div><div style={{ fontSize:10,color:T.textMute,opacity:0.6 }}>{n.time}</div></div>
        {!n.read&&<div style={{ width:8,height:8,borderRadius:"50%",background:n.color,marginTop:4,flexShrink:0 }}/>}
      </div>)}
    </Card>}

    {modal&&<Modal title={modal} onClose={()=>{setModal(null);setDone(false);setAmt("");}}>
      {!done?<>
        {modal==="Send to Panda"&&<div style={{ background:T.greenBg,border:`1px solid ${T.green}33`,borderRadius:12,padding:"10px 16px",marginBottom:16,fontSize:13,color:T.green,fontWeight:700 }}>Panda-to-Panda is FREE and Instant</div>}
        <div style={{ background:T.navyLight,borderRadius:12,padding:"12px 16px",marginBottom:18,display:"flex",justifyContent:"space-between",fontSize:13 }}>
          <span style={{ color:T.textMute }}>Available Balance</span><span style={{ color:T.navy,fontWeight:900,fontFamily:"monospace" }}>{fmt(balance)}</span>
        </div>
        {modal==="Send to Panda"&&<><Label required>Recipient Username</Label><Field value={toUser} onChange={setToUser} placeholder="e.g. @amina"/>
          {toUser.startsWith("@")&&toUser.length>1&&<div style={{ marginBottom:14 }}>{CONTACTS.filter(u=>u.username.includes(toUser.slice(1))).map(u=><div key={u.username} onClick={()=>setToUser(u.username)} style={{ display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderRadius:12,background:T.cardAlt,border:`1px solid ${T.border}`,marginBottom:6,cursor:"pointer" }}><Avatar initials={u.initials} color={u.color}/><div><div style={{ fontSize:13,fontWeight:700,color:T.text }}>{u.name}</div><div style={{ fontSize:11,color:T.textMute }}>{u.username}</div></div></div>)}</div>}
        </>}
        {modal==="Transfer"&&<><Label required>Recipient Phone</Label><Field value={toPhone} onChange={setToPhone} placeholder="+255 712 000 000"/></>}
        {modal==="Pay Bill"&&<><Label required>Bill Account Number</Label><Field value={toPhone} onChange={setToPhone} placeholder="e.g. 001234567"/></>}
        {modal==="Request Money"&&<><Label required>From (Username)</Label><Field value={toUser} onChange={setToUser} placeholder="e.g. @amina"/></>}
        {modal==="Split Payment"&&<><Label required>Total Bill Amount</Label><Field value={splitAmt} onChange={setSplitAmt} placeholder="e.g. 120,000" prefix="TSh"/>
          <div style={{ background:T.navyLight,borderRadius:12,padding:"14px 16px",marginBottom:16 }}>
            <div style={{ fontSize:12,fontWeight:700,color:T.textMid,marginBottom:8 }}>Splitting with</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:splitAmt?10:0 }}>{splitPeople.map(p=><Badge key={p} color={T.navy}>{p}</Badge>)}</div>
            {splitAmt&&<div style={{ fontSize:13,color:T.text,marginTop:10,fontWeight:600 }}>Each pays: <span style={{ color:T.gold,fontWeight:900,fontFamily:"monospace" }}>{fmt(Math.ceil((parseInt(splitAmt.replace(/,/g,""))||0)/(splitPeople.length+1)))}</span></div>}
          </div>
        </>}
        {modal!=="Split Payment"&&<><Label required>Amount (TSh)</Label><Field value={amt} onChange={setAmt} placeholder="e.g. 50,000" prefix="TSh"/><Label>Note (optional)</Label><Field value={note} onChange={setNote} placeholder="What is this for?"/></>}
        {(modal==="Withdraw"||modal==="Transfer")&&<div style={{ fontSize:12,color:T.amber,marginBottom:14,padding:"9px 14px",background:T.amberBg,borderRadius:10,fontWeight:600 }}>Fee: TSh 1,500 · Via: {selProv}</div>}
        <div style={{ display:"flex",gap:10 }}>
          <Btn variant="ghost" onClick={()=>{setModal(null);setDone(false);}}>Cancel</Btn>
          <Btn full variant="gold" loading={loading} onClick={modal==="Request Money"?confirmReq:modal==="Split Payment"?confirmSplit:confirm}>
            {modal==="Request Money"?"Send Request":modal==="Split Payment"?"Split & Send":"Confirm Payment"}
          </Btn>
        </div>
      </>:<SuccessBox
        title={modal==="Request Money"?"Request Sent!":modal==="Split Payment"?"Requests Sent!":"Transaction Complete!"}
        sub={modal==="Send to Panda"?`${fmt(parseInt(amt.replace(/,/g,"")||0))} sent to ${toUser}`:modal==="Add Money"?`${fmt(parseInt(amt.replace(/,/g,"")||0))} added`:modal==="Request Money"?`${toUser} notified`:`Processed`}
        extra={modal==="Send to Panda"?"No fee — Panda-to-Panda is always free":null}
      />}
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BUSINESS SECTION — B3
// ═══════════════════════════════════════════════════════════════════════════════
function BusinessSection({ balance, toast }) {
  const [bTab,setBTab]=useState("merchant");
  const [escrows,setEscrows]=useState([
    { id:"ESC-K8X2A-BB",buyer:"@hassan",seller:"@bak",amt:850000,item:"Laptop — HP EliteBook",status:"held",created:"Jun 12",deadline:"Jun 19" },
    { id:"ESC-J7W9B-CC",buyer:"@amina",seller:"@zawadi",amt:250000,item:"Samsung Galaxy Buds",status:"released",created:"Jun 10",deadline:"Jun 17" },
  ]);
  const [recurring,setRecurring]=useState([
    { id:1,to:"@amina",amt:200000,note:"Monthly salary",freq:"Monthly",next:"Jul 1, 2026",status:"active" },
    { id:2,to:"@juma",amt:50000,note:"Weekly allowance",freq:"Weekly",next:"Jun 20, 2026",status:"active" },
    { id:3,to:"LUKU Bill",amt:45000,note:"Electricity",freq:"Monthly",next:"Jul 5, 2026",status:"paused" },
  ]);
  const [rModal,setRModal]=useState(false);
  const [rTo,setRTo]=useState(""); const [rAmt,setRAmt]=useState(""); const [rNote,setRNote]=useState(""); const [rFreq,setRFreq]=useState("monthly"); const [rDone,setRDone]=useState(false);
  const bizTxs=[
    { id:genTX(),type:"in",from:"Customer · John M.",amt:85000,note:"Table 4 Dinner",time:"Today, 19:45",status:"settled" },
    { id:genTX(),type:"in",from:"Customer · Amina H.",amt:42000,note:"Takeaway order",time:"Today, 17:30",status:"pending" },
    { id:genTX(),type:"in",from:"Customer · Hassan K.",amt:120000,note:"Corporate lunch",time:"Today, 13:10",status:"settled" },
    { id:genTX(),type:"out",from:"Supplier",amt:200000,note:"Vegetable supply",time:"Yesterday",status:"settled" },
  ];
  const todaySales=bizTxs.filter(t=>t.type==="in"&&t.time.startsWith("Today")).reduce((s,t)=>s+t.amt,0);
  const pending=bizTxs.filter(t=>t.status==="pending"&&t.type==="in").reduce((s,t)=>s+t.amt,0);
  const TABS=[
    {id:"merchant",icon:"store",l:"Merchant"},{id:"collections",icon:"qr",l:"Collections"},
    {id:"escrow",icon:"shield",l:"Escrow"},{id:"recurring",icon:"repeat",l:"Recurring"},
  ];
  return <div>
    <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,borderRadius:22,padding:"24px",marginBottom:18,position:"relative",overflow:"hidden",boxShadow:"0 20px 56px rgba(11,31,75,0.3),0 0 0 1px rgba(201,150,10,0.18)" }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
      <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>Business Account</div>
      <div style={{ fontSize:16,fontWeight:800,color:"#fff",marginBottom:16 }}>Gigas Panda Restaurant</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
        {[["Balance",fmt(balance-200000),T.goldMid],["Today Sales",fmt(todaySales),"#34D399"],["Pending",fmt(pending),"#FBBF24"]].map(([l,v,c])=>(
          <div key={l} style={{ background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:13,fontWeight:800,color:c,fontFamily:"monospace" }}>{v}</div>
          </div>))}
      </div>
    </div>
    <div style={{ display:"flex",gap:4,marginBottom:18,background:T.surface,borderRadius:16,padding:5,border:`1px solid ${T.border}`,overflowX:"auto" }}>
      {TABS.map(t=><button key={t.id} onClick={()=>setBTab(t.id)} style={{ flex:1,minWidth:70,padding:"9px 4px",borderRadius:12,border:"none",background:bTab===t.id?T.navy:"transparent",color:bTab===t.id?"#fff":T.textMute,fontWeight:bTab===t.id?800:500,fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
        <Icon name={t.icon} size={15} color={bTab===t.id?"#fff":T.textMute}/><span>{t.l}</span>
      </button>)}
    </div>
    {bTab==="merchant"&&<Card>
      <SHead title="Business Transactions"/>
      {bizTxs.map((tx,i)=><div key={tx.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<bizTxs.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ width:42,height:42,borderRadius:12,flexShrink:0,background:tx.type==="in"?T.greenBg:T.redBg,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name={tx.type==="in"?"trending":"send"} size={18} color={tx.type==="in"?T.green:T.red}/>
        </div>
        <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:2 }}>{tx.from}</div><div style={{ fontSize:12,color:T.textMute }}>{tx.note} · {tx.time}</div></div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:14,fontWeight:900,color:tx.type==="in"?T.green:T.red,fontFamily:"monospace" }}>{tx.type==="in"?"+":"-"}{fmt(tx.amt)}</div>
          <Badge color={tx.status==="settled"?T.green:T.amber}>{tx.status==="settled"?"Settled":"Pending"}</Badge>
        </div>
      </div>)}
    </Card>}
    {bTab==="collections"&&<Card>
      <SHead title="Business Collections" sub="Accept payments via QR, link or invoice"/>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        {[{icon:"qr",label:"QR Code",color:T.navy},{icon:"link",label:"Pay Link",color:T.gold},{icon:"invoice",label:"Invoice",color:T.green}].map(item=>(
          <div key={item.label} onClick={()=>toast("Opening",`${item.label} generator ready.`,item.color)} style={{ padding:"18px 12px",borderRadius:16,border:`1.5px solid ${T.border}`,background:T.cardAlt,cursor:"pointer",textAlign:"center",transition:"all 0.18s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=item.color} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:10 }}><Icon name={item.icon} size={28} color={item.color}/></div>
            <div style={{ fontSize:12,fontWeight:800,color:T.text }}>{item.label}</div>
          </div>))}
      </div>
      <div style={{ background:T.navyLight,borderRadius:12,padding:"12px 16px",fontSize:12,color:T.textMid }}>Share payment links and QR codes to accept business payments from anywhere — even without the Panda app.</div>
    </Card>}
    {bTab==="escrow"&&<Card>
      <SHead title="Escrow Wallet" sub="Secure transactions between buyers and sellers"/>
      {escrows.map((esc,i)=><div key={esc.id} style={{ padding:"14px 0",borderBottom:i<escrows.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:4 }}>{esc.item}</div>
            <div style={{ fontSize:12,color:T.textMute,marginBottom:2 }}>Buyer: <span style={{ color:T.navy,fontWeight:700 }}>{esc.buyer}</span> → Seller: <span style={{ color:T.navy,fontWeight:700 }}>{esc.seller}</span></div>
            <div style={{ fontSize:10,color:T.textMute,fontFamily:"monospace" }}>{esc.id} · {esc.created}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16,fontWeight:900,color:T.text,fontFamily:"monospace",marginBottom:6 }}>{fmt(esc.amt)}</div>
            <Badge color={esc.status==="held"?T.amber:T.green}>{esc.status==="held"?"Funds Held":"Released"}</Badge>
          </div>
        </div>
        {esc.status==="held"&&<div style={{ display:"flex",gap:8,marginTop:10 }}>
          <Btn size="sm" variant="success" icon="check" onClick={()=>{setEscrows(e=>e.map(x=>x.id===esc.id?{...x,status:"released"}:x));toast("Released!",`${fmt(esc.amt)} released to ${esc.seller}`,T.green);}}>Release</Btn>
          <Btn size="sm" variant="danger" onClick={()=>toast("Dispute Raised","Our team will review within 24 hours.",T.red)}>Dispute</Btn>
        </div>}
      </div>)}
    </Card>}
    {bTab==="recurring"&&<>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Recurring Transfers" sub="Automatic payments on your schedule" action="+ New" onAction={()=>setRModal(true)}/>
        {recurring.map((r,i)=><div key={r.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:i<recurring.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ width:44,height:44,borderRadius:12,flexShrink:0,background:r.status==="active"?T.navyLight:T.cardAlt,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="repeat" size={20} color={r.status==="active"?T.navy:T.textMute}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:2 }}>{r.to}</div>
            <div style={{ fontSize:12,color:T.textMute }}>{r.note} · {r.freq} · Next: {r.next}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:15,fontWeight:900,color:T.text,fontFamily:"monospace",marginBottom:8 }}>{fmt(r.amt)}</div>
            <div style={{ display:"flex",gap:6,justifyContent:"flex-end" }}>
              <button onClick={()=>{setRecurring(rc=>rc.map(x=>x.id===r.id?{...x,status:x.status==="active"?"paused":"active"}:x));toast(r.status==="active"?"Paused":"Resumed",`Transfer to ${r.to} ${r.status==="active"?"paused":"resumed"}`,r.status==="active"?T.amber:T.green);}} style={{ width:30,height:30,borderRadius:8,background:r.status==="active"?T.amberBg:T.greenBg,border:`1px solid ${r.status==="active"?T.amber:T.green}33`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon name={r.status==="active"?"clock":"check"} size={14} color={r.status==="active"?T.amber:T.green}/>
              </button>
              <button onClick={()=>{setRecurring(rc=>rc.filter(x=>x.id!==r.id));toast("Deleted",`Transfer to ${r.to} cancelled.`,T.red);}} style={{ width:30,height:30,borderRadius:8,background:T.redBg,border:`1px solid ${T.red}33`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon name="trash" size={14} color={T.red}/>
              </button>
            </div>
          </div>
        </div>)}
      </Card>
      {rModal&&<Modal title="New Recurring Transfer" onClose={()=>{setRModal(false);setRDone(false);}}>
        {!rDone?<>
          <Label required>Send To</Label><Field value={rTo} onChange={setRTo} placeholder="e.g. @amina or M-Pesa"/>
          <Label required>Amount per Transfer</Label><Field value={rAmt} onChange={setRAmt} placeholder="e.g. 200,000" prefix="TSh"/>
          <Label>Note</Label><Field value={rNote} onChange={setRNote} placeholder="e.g. Monthly salary"/>
          <Label required>Frequency</Label>
          <Select value={rFreq} onChange={setRFreq} options={[{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly",label:"Monthly"},{value:"yearly",label:"Yearly"}]}/>
          <div style={{ display:"flex",gap:10 }}>
            <Btn variant="ghost" onClick={()=>setRModal(false)}>Cancel</Btn>
            <Btn full variant="gold" icon="repeat" onClick={()=>{
              if(!rTo||!rAmt)return;
              const a=parseInt(rAmt.replace(/,/g,""))||0;
              setRecurring(r=>[...r,{id:Date.now(),to:rTo,amt:a,note:rNote||"Recurring Transfer",freq:rFreq.charAt(0).toUpperCase()+rFreq.slice(1),next:"Jun 20, 2026",status:"active"}]);
              toast("Scheduled!",`${fmt(a)} will be sent to ${rTo} ${rFreq}.`,T.gold);
              setRDone(true);
            }}>Start Transfer</Btn>
          </div>
        </>:<div style={{ textAlign:"center",padding:"24px 0" }}>
          <div style={{ width:64,height:64,borderRadius:"50%",background:T.greenBg,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}><Icon name="check" size={28} color={T.green}/></div>
          <div style={{ fontSize:18,fontWeight:900,color:T.text,marginBottom:6 }}>Transfer Scheduled!</div>
          <div style={{ fontSize:13,color:T.textMute,marginBottom:20 }}>{rFreq.charAt(0).toUpperCase()+rFreq.slice(1)} transfer to {rTo} is now active.</div>
          <Btn variant="gold" onClick={()=>{setRModal(false);setRDone(false);}}>Done</Btn>
        </div>}
      </Modal>}
    </>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  REWARDS & SECURITY — B4
// ═══════════════════════════════════════════════════════════════════════════════
function RewardsSection({ toast }) {
  const [rTab,setRTab]=useState("points");
  const [points,setPoints]=useState(4820);
  const [biometric,setBiometric]=useState(true);
  const [twoFA,setTwoFA]=useState(true);
  const [txAlerts,setTxAlerts]=useState(true);
  const [frozen,setFrozen]=useState(false);
  const [pinModal,setPinModal]=useState(false);
  const [pinDone,setPinDone]=useState(false);
  const [curPin,setCurPin]=useState(""); const [newPin,setNewPin]=useState(""); const [conPin,setConPin]=useState("");
  const tiers=[{name:"Bronze",min:0,max:999,color:"#CD7F32"},{name:"Silver",min:1000,max:4999,color:"#9E9E9E"},{name:"Gold",min:5000,max:9999,color:T.gold},{name:"Panda",min:10000,max:99999,color:T.navy}];
  const curTier=tiers.find(t=>points>=t.min&&points<=t.max)||tiers[0];
  const nxtTier=tiers[tiers.indexOf(curTier)+1];
  const prog=nxtTier?Math.round(((points-curTier.min)/(nxtTier.min-curTier.min))*100):100;
  const rewards=[{name:"Free Withdrawal",pts:500,color:T.green},{name:"Marketplace Credit",pts:1000,color:T.gold},{name:"Fee Discount 50%",pts:2000,color:T.blue},{name:"Priority Support",pts:3000,color:T.purple}];
  const referrals=[{name:"Amina Hassan",username:"@amina",date:"Jun 10",status:"active",pts:1000},{name:"Juma Mwangi",username:"@juma",date:"Jun 8",status:"active",pts:1000},{name:"Baraka Said",username:"@baraka",date:"Jun 5",status:"pending",pts:0}];
  const devices=[{id:1,name:"Samsung Galaxy S24 Ultra",loc:"Morogoro, TZ",last:"Current session",current:true},{id:2,name:"HP Laptop — Chrome",loc:"Morogoro, TZ",last:"Jun 14, 14:30",current:false}];
  const secScore=[biometric,twoFA,txAlerts,true,true].filter(Boolean).length*20;
  const TABS=[{id:"points",icon:"star",l:"Points"},{id:"referral",icon:"gift",l:"Referral"},{id:"security",icon:"shield",l:"Security"}];
  return <div>
    <div style={{ display:"flex",gap:4,marginBottom:18,background:T.surface,borderRadius:16,padding:5,border:`1px solid ${T.border}`,overflowX:"auto" }}>
      {TABS.map(t=><button key={t.id} onClick={()=>setRTab(t.id)} style={{ flex:1,minWidth:80,padding:"9px 4px",borderRadius:12,border:"none",background:rTab===t.id?T.navy:"transparent",color:rTab===t.id?"#fff":T.textMute,fontWeight:rTab===t.id?800:500,fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
        <Icon name={t.icon} size={15} color={rTab===t.id?"#fff":T.textMute}/><span>{t.l}</span>
      </button>)}
    </div>
    {rTab==="points"&&<>
      <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,borderRadius:22,padding:"24px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 56px rgba(11,31,75,0.3),0 0 0 1px rgba(201,150,10,0.18)" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <div><div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>Panda Points</div><div style={{ fontSize:36,fontWeight:900,color:"#fff",fontFamily:"monospace" }}>{points.toLocaleString()}</div></div>
          <div style={{ background:`${curTier.color}22`,border:`1px solid ${curTier.color}55`,borderRadius:10,padding:"6px 14px",height:"fit-content" }}><div style={{ fontSize:13,fontWeight:900,color:curTier.color }}>{curTier.name} Tier</div></div>
        </div>
        {nxtTier&&<><div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>{(nxtTier.min-points).toLocaleString()} pts to {nxtTier.name}</div>
          <div style={{ background:"rgba(255,255,255,0.1)",borderRadius:99,height:8,overflow:"hidden" }}><div style={{ height:"100%",width:`${prog}%`,background:`linear-gradient(90deg,${T.gold},${T.goldMid})`,borderRadius:99 }}/></div></>}
      </div>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Redeem Rewards" sub={`${fmtPts(points)} available`}/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {rewards.map(r=><div key={r.name} onClick={()=>{if(points<r.pts){toast("Not enough",`Need ${fmtPts(r.pts-points)} more`,T.red);return;}setPoints(p=>p-r.pts);toast("Redeemed!",`${r.name} applied.`,T.gold);}} style={{ padding:"16px 14px",borderRadius:16,border:`1.5px solid ${points>=r.pts?r.color:T.border}`,background:points>=r.pts?r.color+"0A":T.cardAlt,cursor:points>=r.pts?"pointer":"not-allowed",transition:"all 0.18s",opacity:points>=r.pts?1:0.6 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}><Icon name="gift" size={20} color={r.color}/><Badge color={points>=r.pts?r.color:T.textMute}>{fmtPts(r.pts)}</Badge></div>
            <div style={{ fontSize:13,fontWeight:800,color:T.text }}>{r.name}</div>
          </div>)}
        </div>
      </Card>
    </>}
    {rTab==="referral"&&<>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14 }}>
        {[{l:"Referred",v:referrals.length,c:T.navy},{l:"Active",v:referrals.filter(r=>r.status==="active").length,c:T.green},{l:"Earned",v:fmtPts(referrals.filter(r=>r.status==="active").reduce((s,r)=>s+r.pts,0)),c:T.gold}].map(s=>(
          <div key={s.l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 12px",textAlign:"center",boxShadow:T.shadow }}>
            <div style={{ fontSize:20,fontWeight:900,color:s.c,fontFamily:"monospace",marginBottom:4 }}>{s.v}</div>
            <div style={{ fontSize:10,color:T.textMute,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8 }}>{s.l}</div>
          </div>))}
      </div>
      <Card style={{ marginBottom:14,background:`linear-gradient(145deg,${T.goldLight},${T.surface})`,border:`1.5px solid ${T.gold}33` }}>
        <SHead title="Your Referral Code" sub="Both you and your friend earn 1,000 points"/>
        <div style={{ background:T.surface,border:`1.5px dashed ${T.gold}66`,borderRadius:14,padding:"18px",textAlign:"center",marginBottom:14 }}>
          <div style={{ fontSize:10,color:T.textMute,letterSpacing:2,textTransform:"uppercase",marginBottom:8 }}>Referral Code</div>
          <div style={{ fontSize:24,fontWeight:900,color:T.navy,letterSpacing:4,fontFamily:"monospace",marginBottom:12 }}>PANDA-BAK-2026</div>
          <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
            <Btn size="sm" variant="gold" icon="copy" onClick={()=>toast("Copied!","Referral code copied.",T.gold)}>Copy Code</Btn>
            <Btn size="sm" variant="outline" icon="share" onClick={()=>toast("Shared","Link shared via WhatsApp.",T.green)}>Share</Btn>
          </div>
        </div>
      </Card>
      <Card>
        <SHead title="Referred Friends"/>
        {referrals.map((r,i)=><div key={r.username} style={{ display:"flex",alignItems:"center",gap:14,padding:"11px 0",borderBottom:i<referrals.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ width:38,height:38,borderRadius:"50%",background:T.navyLight,border:`2px solid ${T.navy}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:T.navy,flexShrink:0 }}>{r.name.split(" ").map(n=>n[0]).join("")}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:700,color:T.text }}>{r.name}</div><div style={{ fontSize:11,color:T.textMute }}>{r.username} · Joined {r.date}</div></div>
          <div style={{ textAlign:"right" }}><Badge color={r.status==="active"?T.green:T.amber}>{r.status==="active"?"Active":"Pending"}</Badge>{r.pts>0&&<div style={{ fontSize:11,color:T.gold,fontWeight:700,fontFamily:"monospace",marginTop:4 }}>+{fmtPts(r.pts)}</div>}</div>
        </div>)}
      </Card>
    </>}
    {rTab==="security"&&<>
      <Card style={{ marginBottom:14,background:secScore>=80?`linear-gradient(145deg,${T.greenBg},${T.surface})`:T.surface,border:`1.5px solid ${secScore>=80?T.green:T.amber}33` }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div><div style={{ fontSize:15,fontWeight:800,color:T.text }}>Security Score</div><div style={{ fontSize:12,color:T.textMute,marginTop:2 }}>{secScore>=80?"Well protected":"Could be stronger"}</div></div>
          <div style={{ fontSize:42,fontWeight:900,color:secScore>=80?T.green:T.amber,fontFamily:"monospace" }}>{secScore}</div>
        </div>
        <div style={{ background:T.border,borderRadius:99,height:10,overflow:"hidden" }}><div style={{ height:"100%",width:`${secScore}%`,background:secScore>=80?`linear-gradient(90deg,${T.green},#34D399)`:`linear-gradient(90deg,${T.amber},#FBBF24)`,borderRadius:99 }}/></div>
      </Card>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Security Settings"/>
        <Toggle value={biometric} onChange={v=>{setBiometric(v);toast(v?"Biometric On":"Biometric Off",v?"Fingerprint login enabled.":"Fingerprint disabled.",v?T.green:T.amber);}} label="Biometric Login" sub="Fingerprint and Face ID"/>
        <Toggle value={twoFA} onChange={v=>{setTwoFA(v);toast(v?"2FA Enabled":"2FA Disabled",v?"SMS codes active.":"2FA turned off.",v?T.green:T.amber);}} label="Two-Factor Auth" sub="SMS code on every login"/>
        <Toggle value={txAlerts} onChange={v=>{setTxAlerts(v);toast("Alerts Updated","Transaction alerts updated.",T.navy);}} label="Transaction Alerts" sub="Notify on every payment"/>
        <Toggle value={!frozen} onChange={v=>{setFrozen(!v);toast(!v?"Wallet Frozen":"Wallet Active",!v?"All transactions blocked.":"Wallet is active again.",!v?T.red:T.green);}} color={T.green} label="Wallet Active" sub="Toggle off to freeze all transactions"/>
      </Card>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Security Actions"/>
        {[{icon:"key",label:"Change PIN",sub:"Update your wallet PIN",fn:()=>setPinModal(true),color:T.navy},{icon:"fingerprint",label:"Biometric Settings",sub:"Manage fingerprint and Face ID",fn:()=>toast("Biometric","Settings opened.",T.purple),color:T.purple},{icon:"logout",label:"Logout All Devices",sub:"Sign out from all sessions",fn:()=>toast("Logged Out","All devices signed out.",T.red),color:T.red,danger:true}].map(item=>(
          <div key={item.label} onClick={item.fn} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer" }}>
            <div style={{ width:40,height:40,borderRadius:12,background:item.danger?T.redBg:item.color+"15",border:`1px solid ${item.danger?T.red:item.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name={item.icon} size={18} color={item.danger?T.red:item.color}/></div>
            <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:700,color:item.danger?T.red:T.text,marginBottom:2 }}>{item.label}</div><div style={{ fontSize:11,color:T.textMute }}>{item.sub}</div></div>
            <Icon name="chevron" size={16} color={T.textMute}/>
          </div>))}
      </Card>
      <Card>
        <SHead title="Device Management"/>
        {devices.map((d,i)=><div key={d.id} style={{ display:"flex",gap:14,alignItems:"center",padding:"13px 0",borderBottom:i<devices.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ width:44,height:44,borderRadius:12,flexShrink:0,background:d.current?T.navyLight:T.cardAlt,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="smartphone" size={20} color={d.current?T.navy:T.textMute}/></div>
          <div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}><div style={{ fontSize:13,fontWeight:700,color:T.text }}>{d.name}</div>{d.current&&<Badge color={T.green}>Current</Badge>}</div><div style={{ fontSize:11,color:T.textMute }}>{d.loc} · {d.last}</div></div>
          {!d.current&&<Btn size="sm" variant="danger" icon="logout" onClick={()=>toast("Removed",`${d.name} signed out.`,T.red)}>Remove</Btn>}
        </div>)}
      </Card>
      {pinModal&&<Modal title="Change PIN" subtitle="PIN must be 4–6 digits" onClose={()=>{setPinModal(false);setPinDone(false);setCurPin("");setNewPin("");setConPin("");}}>
        {!pinDone?<>
          <Label required>Current PIN</Label><Field value={curPin} onChange={setCurPin} placeholder="Current PIN" type="password"/>
          <Label required>New PIN</Label><Field value={newPin} onChange={setNewPin} placeholder="New PIN (4–6 digits)" type="password"/>
          <Label required>Confirm PIN</Label><Field value={conPin} onChange={setConPin} placeholder="Confirm new PIN" type="password"/>
          {newPin.length>0&&<div style={{ marginBottom:16 }}><div style={{ fontSize:11,color:T.textMute,marginBottom:6 }}>PIN Strength</div><div style={{ display:"flex",gap:4 }}>{[1,2,3,4,5,6].map(i=><div key={i} style={{ flex:1,height:4,borderRadius:99,background:i<=newPin.length?(newPin.length<=2?T.red:newPin.length<=4?T.amber:T.green):T.border }}/>)}</div></div>}
          <div style={{ display:"flex",gap:10 }}>
            <Btn variant="ghost" onClick={()=>setPinModal(false)}>Cancel</Btn>
            <Btn full variant="gold" icon="key" onClick={()=>{if(!curPin||!newPin||!conPin){toast("Fill all fields","Complete all PIN fields.",T.red);return;}if(newPin!==conPin){toast("Mismatch","PINs do not match.",T.red);return;}if(newPin.length<4){toast("Too short","PIN must be 4–6 digits.",T.red);return;}toast("PIN Updated","Your wallet PIN has been changed.",T.green);setPinDone(true);}}>Update PIN</Btn>
          </div>
        </>:<div style={{ textAlign:"center",padding:"24px 0" }}>
          <div style={{ width:64,height:64,borderRadius:"50%",background:T.greenBg,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}><Icon name="check" size={28} color={T.green}/></div>
          <div style={{ fontSize:18,fontWeight:900,color:T.text,marginBottom:6 }}>PIN Updated!</div>
          <div style={{ fontSize:13,color:T.textMute,marginBottom:20 }}>Your wallet PIN has been changed successfully.</div>
          <Btn variant="gold" onClick={()=>{setPinModal(false);setPinDone(false);}}>Done</Btn>
        </div>}
      </Modal>}
    </>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ADVANCED SECTION — B5
// ═══════════════════════════════════════════════════════════════════════════════
function AdvancedSection({ balance, setBalance, toast }) {
  const [aTab,setATab]=useState("currency");
  const [currencies,setCurrencies]=useState({ TZS:2450000,USD:142.50,KES:18400,UGX:520000 });
  const RATES={ TZS:1,USD:0.000038,KES:0.0048,UGX:0.145 };
  const CURR=[{code:"TZS",name:"Tanzanian Shilling",flag:"🇹🇿",fmt:fmt,color:T.navy,sym:"TSh"},{code:"USD",name:"US Dollar",flag:"🇺🇸",fmt:fmtUSD,color:T.green,sym:"$"},{code:"KES",name:"Kenyan Shilling",flag:"🇰🇪",fmt:fmtKES,color:T.red,sym:"KES"},{code:"UGX",name:"Ugandan Shilling",flag:"🇺🇬",fmt:fmtUGX,color:T.purple,sym:"UGX"}];
  const totalUSD=Object.entries(currencies).reduce((s,[c,v])=>s+(v*RATES[c]),0);
  const [fromC,setFromC]=useState("TZS"); const [toC,setToC]=useState("USD");
  const [convAmt,setConvAmt]=useState(""); const [preview,setPreview]=useState(null); const [convDone,setConvDone]=useState(false);
  const [cardVis,setCardVis]=useState(false); const [cardBal,setCardBal]=useState(85000);
  const CARD={number:"4532 8819 2041 7736",expiry:"09/28",cvv:"847",name:"BAK ONLINE LIFE"};
  const portfolio=[{name:"Panda T-Bills",type:"Gov. Bond",risk:"Low",ret:9.5,inv:500000,val:547500},{name:"DSE Equity Fund",type:"Stock Fund",risk:"Medium",ret:18.2,inv:300000,val:354600},{name:"East Africa REIT",type:"Real Estate",risk:"Medium",ret:14.5,inv:200000,val:229000}];
  const portTotal=portfolio.reduce((s,p)=>s+p.val,0);
  const portGain=portTotal-portfolio.reduce((s,p)=>s+p.inv,0);
  const [messages,setMessages]=useState([{role:"ai",text:"Hello BAK! I am your Panda AI Financial Assistant. I have analyzed your data. How can I help you today?"}]);
  const [chatInput,setChatInput]=useState(""); const [chatLoading,setChatLoading]=useState(false);
  const chatBottom=useRef(null);
  const aiReplies={spend:"Your top spending: Food (42%), Transport (28%), Utilities (18%), Entertainment (12%). Food is up 15%.",save:"Set up TSh 50,000 auto-save every Friday. Based on your income, very achievable.",invest:"TSh 850,000 idle. Recommend: 60% Panda T-Bills (9.5%), 30% DSE Equity (18%), 10% emergency.",budget:"Income ~TSh 2,450,000/month: 50% needs, 30% wants, 20% savings/investments.",default:"Great question BAK! Your net worth grew 14% this quarter. Focus on spending, savings, or investments?"};
  const getReply=m=>{const l=m.toLowerCase();if(l.includes("spend"))return aiReplies.spend;if(l.includes("save"))return aiReplies.save;if(l.includes("invest"))return aiReplies.invest;if(l.includes("budget"))return aiReplies.budget;return aiReplies.default;};
  const sendChat=()=>{if(!chatInput.trim())return;const msg={role:"user",text:chatInput};setMessages(m=>[...m,msg]);setChatInput("");setChatLoading(true);setTimeout(()=>{setMessages(m=>[...m,{role:"ai",text:getReply(msg.text)}]);setChatLoading(false);setTimeout(()=>chatBottom.current?.scrollIntoView({behavior:"smooth"}),100);},1400);};
  const [family,setFamily]=useState([{id:1,name:"BAK (Father)",username:"@bak",role:"Admin",bal:2450000,limit:null,init:"B",color:T.navy,spent:320000},{id:2,name:"Mama BAK",username:"@mama",role:"Member",bal:850000,limit:500000,init:"M",color:T.purple,spent:280000},{id:3,name:"BAK Jr.",username:"@bak_jr",role:"Child",bal:120000,limit:100000,init:"J",color:T.gold,spent:45000},{id:4,name:"Grandma Rose",username:"@rose",role:"Member",bal:320000,limit:300000,init:"R",color:T.green,spent:95000}]);
  const [famSel,setFamSel]=useState(null); const [famAmt,setFamAmt]=useState(""); const [famDone,setFamDone]=useState(false); const [famModal,setFamModal]=useState(false);
  const TABS=[{id:"currency",icon:"globe",l:"Currencies"},{id:"card",icon:"creditCard",l:"Card"},{id:"invest",icon:"trending",l:"Invest"},{id:"ai",icon:"bot",l:"AI"},{id:"family",icon:"users",l:"Family"}];
  return <div>
    <div style={{ display:"flex",gap:4,marginBottom:18,background:T.surface,borderRadius:16,padding:5,border:`1px solid ${T.border}`,overflowX:"auto" }}>
      {TABS.map(t=><button key={t.id} onClick={()=>setATab(t.id)} style={{ flex:1,minWidth:65,padding:"9px 4px",borderRadius:12,border:"none",background:aTab===t.id?T.navy:"transparent",color:aTab===t.id?"#fff":T.textMute,fontWeight:aTab===t.id?800:500,fontSize:10,cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
        <Icon name={t.icon} size={15} color={aTab===t.id?"#fff":T.textMute}/><span>{t.l}</span>
      </button>)}
    </div>

    {aTab==="currency"&&<>
      <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,borderRadius:22,padding:"24px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 56px rgba(11,31,75,0.3),0 0 0 1px rgba(201,150,10,0.18)" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
        <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Total Portfolio Value</div>
        <div style={{ fontSize:34,fontWeight:900,color:"#fff",fontFamily:"monospace",marginBottom:16 }}>{fmtUSD(totalUSD)}</div>
        <div style={{ display:"flex",gap:10 }}>
          <Btn size="sm" variant="gold" icon="arrowUD" onClick={()=>{setConvAmt("");setPreview(null);setConvDone(false);}}>Convert</Btn>
          <Btn size="sm" variant="outline" icon="refresh" onClick={()=>toast("Updated","Rates refreshed.",T.green)}>Refresh</Btn>
        </div>
      </div>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Currency Balances"/>
        {CURR.map(c=><div key={c.code} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 16px",borderRadius:14,background:T.cardAlt,border:`1px solid ${T.border}`,marginBottom:10 }}>
          <div style={{ fontSize:26,flexShrink:0 }}>{c.flag}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:14,fontWeight:800,color:T.text }}>{c.code}</div><div style={{ fontSize:11,color:T.textMute }}>{c.name}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:16,fontWeight:900,color:c.color,fontFamily:"monospace" }}>{c.fmt(currencies[c.code])}</div><div style={{ fontSize:11,color:T.textMute }}>≈ {fmtUSD(currencies[c.code]*RATES[c.code])}</div></div>
        </div>)}
      </Card>
      <Card>
        <SHead title="Convert Currency"/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"end",marginBottom:4 }}>
          <div><Label required>From</Label><Select value={fromC} onChange={setFromC} options={CURR.map(c=>({value:c.code,label:`${c.flag} ${c.code}`}))}/></div>
          <div style={{ paddingBottom:16,display:"flex",justifyContent:"center" }}><button onClick={()=>{const tmp=fromC;setFromC(toC);setToC(tmp);setPreview(null);}} style={{ width:36,height:36,borderRadius:"50%",background:T.navyLight,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="arrowUD" size={16} color={T.navy}/></button></div>
          <div><Label required>To</Label><Select value={toC} onChange={v=>{setToC(v);setPreview(null);}} options={CURR.map(c=>({value:c.code,label:`${c.flag} ${c.code}`}))}/></div>
        </div>
        <Label required>Amount</Label><Field value={convAmt} onChange={v=>{setConvAmt(v);setPreview(null);}} placeholder={`Enter ${fromC} amount`} prefix={CURR.find(c=>c.code===fromC)?.sym}/>
        {!convDone?<>
          <Btn full variant="outline" icon="refresh" onClick={()=>{const a=parseFloat(convAmt)||0;if(a>0&&fromC!==toC)setPreview((a*RATES[fromC])/RATES[toC]);}}>Preview Rate</Btn>
          {preview!==null&&<div style={{ background:T.greenBg,border:`1px solid ${T.green}33`,borderRadius:12,padding:"14px 16px",marginTop:12,marginBottom:16 }}>
            <div style={{ fontSize:12,color:T.green,fontWeight:700,marginBottom:4 }}>You will receive</div>
            <div style={{ fontSize:22,fontWeight:900,color:T.green,fontFamily:"monospace" }}>{CURR.find(c=>c.code===toC)?.fmt(preview)}</div>
          </div>}
          <div style={{ marginTop:12 }}><Btn full variant="gold" disabled={!preview} icon="arrowUD" onClick={()=>{const a=parseFloat(convAmt)||0;if(currencies[fromC]<a){toast("Insufficient","Not enough funds.",T.red);return;}setCurrencies(c=>({...c,[fromC]:c[fromC]-a,[toC]:c[toC]+preview}));toast("Converted!",`${convAmt} ${fromC} → ${preview?.toFixed(4)} ${toC}`,T.gold);setConvDone(true);}}>Confirm Conversion</Btn></div>
        </>:<div style={{ textAlign:"center",padding:"20px 0" }}>
          <div style={{ width:56,height:56,borderRadius:"50%",background:T.greenBg,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}><Icon name="check" size={24} color={T.green}/></div>
          <div style={{ fontSize:16,fontWeight:900,color:T.text,marginBottom:14 }}>Conversion Complete!</div>
          <Btn variant="gold" onClick={()=>{setConvDone(false);setConvAmt("");setPreview(null);}}>Convert Again</Btn>
        </div>}
      </Card>
    </>}

    {aTab==="card"&&<>
      <div style={{ background:`linear-gradient(135deg,#0B1F4B 0%,#1A3A6E 40%,#0F2A5C 100%)`,borderRadius:24,padding:"28px 26px",marginBottom:18,position:"relative",overflow:"hidden",boxShadow:"0 24px 64px rgba(11,31,75,0.35),0 0 0 1px rgba(201,150,10,0.2)",minHeight:200 }}>
        <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,150,10,0.14),transparent 70%)" }}/>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.55),transparent)" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26 }}>
          <div><div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase" }}>Panda Virtual Card</div><div style={{ fontSize:13,color:"#C9960A",fontWeight:700,marginTop:2 }}>Online Payments</div></div>
          <div style={{ background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"4px 14px",border:"1px solid rgba(255,255,255,0.15)" }}><span style={{ fontSize:14,fontWeight:900,color:"#fff" }}>VISA</span></div>
        </div>
        <div style={{ width:42,height:32,background:`linear-gradient(135deg,${T.gold},${T.goldMid})`,borderRadius:6,marginBottom:18,boxShadow:`0 4px 12px ${T.gold}55` }}/>
        <div style={{ fontSize:20,fontWeight:700,color:"#fff",letterSpacing:3,fontFamily:"monospace",marginBottom:18 }}>
          {cardVis?CARD.number:CARD.number.replace(/\d(?=\d{4})/g,"•")}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
          <div><div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>Card Holder</div><div style={{ fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:700 }}>{CARD.name}</div></div>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>Expires</div><div style={{ fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:700,fontFamily:"monospace" }}>{cardVis?CARD.expiry:"••/••"}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>CVV</div><div style={{ fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:700,fontFamily:"monospace" }}>{cardVis?CARD.cvv:"•••"}</div></div>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
        <Card style={{ padding:"16px 18px" }}><div style={{ fontSize:11,color:T.textMute,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6 }}>Card Balance</div><div style={{ fontSize:22,fontWeight:900,color:T.navy,fontFamily:"monospace" }}>{fmt(cardBal)}</div><div style={{ marginTop:6 }}><Badge color={T.green}>Active</Badge></div></Card>
        <Card style={{ padding:"16px 18px" }}><div style={{ fontSize:11,color:T.textMute,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6 }}>Quick Top Up</div><Btn size="sm" variant="gold" icon="plus" full onClick={()=>{setCardBal(b=>b+100000);setBalance(b=>b-100000);toast("Card Topped Up","TSh 100,000 added to card.",T.gold);}}>Add TSh 100K</Btn></Card>
      </div>
      <Card>
        <SHead title="Card Controls"/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {[{l:cardVis?"Hide Details":"Show Details",icon:cardVis?"eye":"eye",fn:()=>setCardVis(v=>!v)},{l:"Copy Card Number",icon:"copy",fn:()=>toast("Copied","Card number copied.",T.navy)},{l:"Freeze Card",icon:"lock",fn:()=>toast("Frozen","Card transactions blocked.",T.red)},{l:"Card Settings",icon:"settings",fn:()=>toast("Settings","Card settings opened.",T.navy)}].map(b=><button key={b.l} onClick={b.fn} style={{ padding:"14px 12px",borderRadius:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,border:`1px solid ${T.border}`,background:T.cardAlt,color:T.textMid,transition:"all 0.18s",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
            <Icon name={b.icon} size={20} color={T.navy}/>{b.l}
          </button>)}
        </div>
      </Card>
    </>}

    {aTab==="invest"&&<>
      <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,borderRadius:22,padding:"24px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 56px rgba(11,31,75,0.3),0 0 0 1px rgba(201,150,10,0.18)" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
        <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>Investment Portfolio</div>
        <div style={{ fontSize:34,fontWeight:900,color:"#fff",fontFamily:"monospace",marginBottom:4 }}>{fmt(portTotal)}</div>
        <div style={{ fontSize:13,color:"#34D399",fontWeight:700,marginBottom:16 }}>+{fmt(portGain)} total gain</div>
      </div>
      <Card style={{ marginBottom:14 }}>
        <SHead title="Your Holdings"/>
        {portfolio.map((p,i)=>{const gain=p.val-p.inv;return <div key={p.name} style={{ padding:"14px 0",borderBottom:i<portfolio.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
            <div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}><div style={{ fontSize:14,fontWeight:800,color:T.text }}>{p.name}</div><Badge color={p.risk==="Low"?T.green:T.amber}>{p.risk}</Badge></div><div style={{ fontSize:12,color:T.textMute }}>{p.type} · {p.ret}% p.a.</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:15,fontWeight:900,color:T.navy,fontFamily:"monospace",marginBottom:4 }}>{fmt(p.val)}</div><div style={{ fontSize:12,color:T.green,fontWeight:700 }}>+{fmt(gain)}</div></div>
          </div>
          <div style={{ marginTop:8,background:T.border,borderRadius:99,height:5,overflow:"hidden" }}><div style={{ height:"100%",width:`${Math.min((p.val/p.inv)*100-50,100)}%`,background:`linear-gradient(90deg,${T.green},#34D399)`,borderRadius:99 }}/></div>
        </div>;})}
      </Card>
      <Card>
        <SHead title="New Opportunities"/>
        {[{name:"Panda T-Bills Q3",risk:"Low",ret:9.8,min:50000},{name:"DSE Blue Chip Fund",risk:"Medium",ret:20.1,min:100000},{name:"Kenya Infrastructure",risk:"Medium",ret:16.5,min:200000}].map((o,i)=>(
          <div key={o.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:i<2?`1px solid ${T.border}`:"none",flexWrap:"wrap",gap:8 }}>
            <div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}><div style={{ fontSize:13,fontWeight:800,color:T.text }}>{o.name}</div><Badge color={o.risk==="Low"?T.green:T.amber}>{o.risk}</Badge></div><div style={{ fontSize:11,color:T.textMute }}>Min: {fmt(o.min)}</div></div>
            <div style={{ display:"flex",gap:12,alignItems:"center" }}><div style={{ fontSize:18,fontWeight:900,color:T.green }}>{o.ret}%</div><Btn size="sm" variant="gold" icon="trending" onClick={()=>toast("Investing","Opening investment details...",T.gold)}>Invest</Btn></div>
          </div>))}
      </Card>
    </>}

    {aTab==="ai"&&<>
      <Card style={{ marginBottom:14,background:`linear-gradient(145deg,${T.navyLight},${T.surface})`,border:`1.5px solid ${T.navy}22` }}>
        <div style={{ display:"flex",gap:14,alignItems:"center" }}>
          <div style={{ width:52,height:52,borderRadius:16,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 24px ${T.navy}44` }}><Icon name="bot" size={26} color="#fff"/></div>
          <div><div style={{ fontSize:16,fontWeight:900,color:T.navy,marginBottom:3 }}>Panda AI Assistant</div><div style={{ fontSize:12,color:T.textMute }}>Powered by your real financial data</div><div style={{ display:"flex",gap:6,marginTop:6 }}><Badge color={T.green}>Online</Badge><Badge color={T.blue}>Analyzing</Badge></div></div>
        </div>
      </Card>
      <Card style={{ marginBottom:14 }}>
        <SHead title="AI Insights" sub="Smart alerts for your finances"/>
        {[{color:T.amber,icon:"zap",title:"Spending Alert",desc:"Transport up 32% this month vs last."},{color:T.green,icon:"piggyBank",title:"Savings Tip",desc:"Save TSh 15,000/week to hit your goal in 5 months."},{color:T.gold,icon:"trending",title:"Idle Balance",desc:"TSh 850,000 idle 14 days — invest at 9.5% p.a."}].map((ins,i)=>(
          <div key={ins.title} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"13px 0",borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <div style={{ width:38,height:38,borderRadius:11,background:ins.color+"18",border:`1px solid ${ins.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name={ins.icon} size={18} color={ins.color}/></div>
            <div><div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:3 }}>{ins.title}</div><div style={{ fontSize:12,color:T.textMute,lineHeight:1.5 }}>{ins.desc}</div></div>
          </div>))}
      </Card>
      <Card>
        <SHead title="Chat with AI"/>
        <div style={{ maxHeight:280,overflowY:"auto",marginBottom:14 }}>
          {messages.map((m,i)=><div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10 }}>
            {m.role==="ai"&&<div style={{ width:30,height:30,borderRadius:9,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:8,marginTop:2 }}><Icon name="bot" size={15} color="#fff"/></div>}
            <div style={{ maxWidth:"78%",padding:"11px 14px",fontSize:13,lineHeight:1.6,fontWeight:500,borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",background:m.role==="user"?`linear-gradient(135deg,${T.navy},${T.navyMid})`:T.cardAlt,color:m.role==="user"?"#fff":T.text }}>{m.text}</div>
          </div>)}
          {chatLoading&&<div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <div style={{ width:30,height:30,borderRadius:9,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="bot" size={15} color="#fff"/></div>
            <div style={{ padding:"11px 14px",borderRadius:"14px 14px 14px 3px",background:T.cardAlt,display:"flex",gap:5 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:T.textMute,animation:`pulse 1s ${i*0.2}s infinite` }}/>)}
            </div>
          </div>}
          <div ref={chatBottom}/>
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:10 }}>
          {["Analyze spending","Save more","Invest advice","Build budget"].map(p=><button key={p} onClick={()=>setChatInput(p)} style={{ padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",background:T.navyLight,border:`1px solid ${T.navy}22`,color:T.navy }}>{p}</button>)}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!chatLoading&&sendChat()} placeholder="Ask about your finances..." style={{ flex:1,background:T.cardAlt,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,fontFamily:"inherit",outline:"none" }} onFocus={e=>e.target.style.borderColor=T.navy} onBlur={e=>e.target.style.borderColor=T.border}/>
          <Btn variant="gold" icon="send" loading={chatLoading} onClick={sendChat}>Send</Btn>
        </div>
      </Card>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </>}

    {aTab==="family"&&<>
      <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,borderRadius:22,padding:"24px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 56px rgba(11,31,75,0.3),0 0 0 1px rgba(201,150,10,0.18)" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
        <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>BAK Family Wallet</div>
        <div style={{ fontSize:34,fontWeight:900,color:"#fff",fontFamily:"monospace",marginBottom:4 }}>{fmt(family.reduce((s,m)=>s+m.bal,0))}</div>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:16 }}>{family.length} members</div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          {family.map(m=><div key={m.id} style={{ width:36,height:36,borderRadius:"50%",background:m.color+"33",border:`2px solid ${m.color}77`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff" }}>{m.init}</div>)}
        </div>
      </div>
      <Card>
        <SHead title="Family Members" sub="Manage balances and limits"/>
        {family.map((m,i)=><div key={m.id} style={{ padding:"14px 0",borderBottom:i<family.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap" }}>
            <div style={{ width:46,height:46,borderRadius:"50%",background:m.color+"22",border:`2px solid ${m.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:m.color,flexShrink:0 }}>{m.init}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
                <div style={{ fontSize:14,fontWeight:800,color:T.text }}>{m.name}</div>
                <Badge color={m.role==="Admin"?T.navy:m.role==="Child"?T.gold:T.blue}>{m.role}</Badge>
              </div>
              <div style={{ fontSize:11,color:T.textMute,marginBottom:m.limit?6:0 }}>{m.username}</div>
              {m.limit&&<div><div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:T.textMute,marginBottom:3 }}><span>Spent: {fmt(m.spent)}</span><span>Limit: {fmt(m.limit)}</span></div><div style={{ background:T.border,borderRadius:99,height:4,overflow:"hidden" }}><div style={{ height:"100%",width:`${Math.min((m.spent/m.limit)*100,100)}%`,background:m.spent/m.limit>0.8?T.red:T.green,borderRadius:99 }}/></div></div>}
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15,fontWeight:900,color:T.text,fontFamily:"monospace",marginBottom:8 }}>{fmt(m.bal)}</div>
              {m.role!=="Admin"&&<Btn size="sm" variant="gold" icon="send" onClick={()=>{setFamSel(m);setFamModal(true);setFamDone(false);setFamAmt("");}}>Send</Btn>}
            </div>
          </div>
        </div>)}
      </Card>
      {famModal&&famSel&&<Modal title={`Send to ${famSel.name}`} onClose={()=>setFamModal(false)}>
        {!famDone?<>
          <div style={{ background:T.navyLight,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between" }}><span style={{ fontSize:13,color:T.textMute }}>Their balance</span><span style={{ fontSize:13,color:T.navy,fontWeight:900,fontFamily:"monospace" }}>{fmt(famSel.bal)}</span></div>
          <Label required>Amount</Label><Field value={famAmt} onChange={setFamAmt} placeholder="e.g. 50,000" prefix="TSh"/>
          <div style={{ display:"flex",gap:10 }}>
            <Btn variant="ghost" onClick={()=>setFamModal(false)}>Cancel</Btn>
            <Btn full variant="gold" icon="send" onClick={()=>{const a=parseInt(famAmt.replace(/,/g,""))||0;if(!a)return;setFamily(f=>f.map(x=>x.id===famSel.id?{...x,bal:x.bal+a}:x));setBalance(b=>b-a);toast("Sent!",`${fmt(a)} sent to ${famSel.name}`,T.green);setFamDone(true);}}>Send Funds</Btn>
          </div>
        </>:<div style={{ textAlign:"center",padding:"24px 0" }}>
          <div style={{ width:64,height:64,borderRadius:"50%",background:T.greenBg,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}><Icon name="check" size={28} color={T.green}/></div>
          <div style={{ fontSize:18,fontWeight:900,color:T.text,marginBottom:6 }}>Funds Sent!</div>
          <div style={{ fontSize:13,color:T.textMute,marginBottom:20 }}>{fmt(parseInt(famAmt.replace(/,/g,"")||0))} sent to {famSel.name}</div>
          <Btn variant="gold" onClick={()=>{setFamModal(false);setFamDone(false);}}>Done</Btn>
        </div>}
      </Modal>}
    </>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP — FULL WALLET SHELL
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [section,setSection]=useState("wallet");
  const [balance,setBalance]=useState(2450000);
  const [walletID]=useState(genID);
  const [txs,setTxs]=useState(INIT_TXS);
  const [feed,setFeed]=useState(INIT_FEED);
  const [notifs,setNotifs]=useState([
    { id:1,icon:"send",   title:"Payment Received", msg:"@amina sent you TSh 150,000 for Website Design", time:"2 min ago",  color:T.green, read:false },
    { id:2,icon:"inbox",  title:"Payment Request",  msg:"@juma requests TSh 25,000 for Coffee",           time:"1 hr ago",   color:T.amber, read:false },
    { id:3,icon:"zap",    title:"Split Request",    msg:"@hassan sent a split for Dinner — TSh 40,000",   time:"2 hrs ago",  color:T.purple,read:false },
    { id:4,icon:"check",  title:"Transfer Done",    msg:"Withdrawal of TSh 80,000 to M-Pesa complete",   time:"3 hrs ago",  color:T.blue,  read:true  },
    { id:5,icon:"sparkle",title:"New Friend",       msg:"@zawadi just joined Panda Finance!",             time:"5 hrs ago",  color:T.gold,  read:true  },
  ]);
  const [toasts,setToasts]=useState([]);

  const toast=(title,msg,color=T.gold)=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,title,msg,color}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3800);
  };

  const unread=notifs.filter(n=>!n.read).length;

  const NAV=[
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"business", icon:"store",   label:"Business" },
    { id:"rewards",  icon:"star",    label:"Rewards"  },
    { id:"advanced", icon:"sparkle", label:"Advanced" },
  ];

  return <div style={{ background:T.bg,minHeight:"100vh",color:T.text,fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif" }}>
    <style>{`
      @keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
      @keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
      *{box-sizing:border-box;}
      input::placeholder,textarea::placeholder{color:#8A9BC0;}
      select{appearance:none;-webkit-appearance:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:#F5F7FF;}
      ::-webkit-scrollbar-thumb{background:#DDE3F5;border-radius:99px;}
      button:hover{opacity:0.88;}
    `}</style>

    <Toast toasts={toasts}/>

    {/* ── Header ── */}
    <div style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(11,31,75,0.06)" }}>
      <div style={{ maxWidth:680,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11,color:T.textMute,letterSpacing:1,textTransform:"uppercase",fontWeight:600 }}>Panda Finance · Tanzania 🇹🇿</div>
          <div style={{ fontSize:18,fontWeight:900,color:T.navy,letterSpacing:-0.5 }}>{NAV.find(n=>n.id===section)?.label}</div>
        </div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          {/* Notification bell */}
          <button onClick={()=>setSection("rewards")} style={{ position:"relative",width:40,height:40,borderRadius:12,background:T.navyLight,border:`1px solid ${T.navy}22`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="bell" size={18} color={T.navy}/>
            {unread>0&&<span style={{ position:"absolute",top:-4,right:-4,width:18,height:18,background:T.red,borderRadius:"50%",fontSize:9,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.bg}` }}>{unread}</span>}
          </button>
          {/* Avatar */}
          <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff",boxShadow:`0 4px 14px ${T.navy}44` }}>B</div>
        </div>
      </div>
    </div>

    {/* ── Balance Bar ── */}
    <div style={{ background:T.navyLight,borderBottom:`1px solid ${T.navy}18`,padding:"8px 20px" }}>
      <div style={{ maxWidth:680,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ fontSize:11,color:T.textMid,fontWeight:600 }}>
          Balance: <span style={{ color:T.navy,fontWeight:900,fontFamily:"monospace" }}>{fmt(balance)}</span>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <Badge color={T.green}>Verified</Badge>
          <Badge color={T.gold}>Gold Tier</Badge>
        </div>
      </div>
    </div>

    {/* ── Desktop Nav ── */}
    <div style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"8px 20px",overflowX:"auto" }}>
      <div style={{ maxWidth:680,margin:"0 auto",display:"flex",gap:6 }}>
        {NAV.map(n=><button key={n.id} onClick={()=>setSection(n.id)} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:section===n.id?800:500,fontSize:13,transition:"all 0.18s",background:section===n.id?T.navy:"transparent",color:section===n.id?"#fff":T.textMute,whiteSpace:"nowrap",boxShadow:section===n.id?`0 4px 14px ${T.navy}33`:"none" }}>
          <Icon name={n.icon} size={15} color={section===n.id?"#fff":T.textMute}/>{n.label}
        </button>)}
      </div>
    </div>

    {/* ── Content ── */}
    <div style={{ padding:"20px 16px 100px",maxWidth:680,margin:"0 auto" }}>
      {section==="wallet"   &&<CoreWallet balance={balance} setBalance={setBalance} txs={txs} setTxs={setTxs} feed={feed} setFeed={setFeed} notifs={notifs} setNotifs={setNotifs} toast={toast} walletID={walletID}/>}
      {section==="business" &&<BusinessSection balance={balance} toast={toast}/>}
      {section==="rewards"  &&<RewardsSection toast={toast}/>}
      {section==="advanced" &&<AdvancedSection balance={balance} setBalance={setBalance} toast={toast}/>}
    </div>

    {/* ── Bottom Nav Bar (mobile) ── */}
    <div style={{ position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,padding:"10px 16px 16px",display:"flex",justifyContent:"space-around",zIndex:200,boxShadow:"0 -4px 20px rgba(11,31,75,0.08)" }}>
      {NAV.map(n=><button key={n.id} onClick={()=>setSection(n.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:section===n.id?T.navyLight:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",padding:"8px 16px",borderRadius:12,transition:"all 0.18s",position:"relative" }}>
        <Icon name={n.icon} size={20} color={section===n.id?T.navy:T.textMute}/>
        <span style={{ fontSize:10,fontWeight:section===n.id?800:500,color:section===n.id?T.navy:T.textMute }}>{n.label}</span>
        {n.id==="rewards"&&unread>0&&<span style={{ position:"absolute",top:4,right:10,width:8,height:8,background:T.red,borderRadius:"50%",border:`1.5px solid ${T.surface}` }}/>}
      </button>)}
    </div>
  </div>;
}
