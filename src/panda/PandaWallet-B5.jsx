import { useState, useEffect, useRef } from "react";

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
  teal:"#0D7490", tealBg:"#E0F7FA",
  border:"#DDE3F5",
  shadow:"0 2px 16px rgba(11,31,75,0.08)",
  shadowMd:"0 8px 32px rgba(11,31,75,0.12)",
  shadowLg:"0 20px 60px rgba(11,31,75,0.18)",
};

const fmt    = n => "TSh " + Number(n).toLocaleString();
const fmtUSD = n => "$" + Number(n).toFixed(2);
const fmtKES = n => "KES " + Number(n).toLocaleString();
const fmtUGX = n => "UGX " + Number(n).toLocaleString();

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor" }) => {
  const p = { stroke:color, strokeWidth:"1.6", fill:"none" };
  const icons = {
    globe:        <><circle cx="12" cy="12" r="10" {...p}/><line x1="2" y1="12" x2="22" y2="12" {...p}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...p}/></>,
    creditCard:   <><rect x="1" y="4" width="22" height="16" rx="2" {...p}/><line x1="1" y1="10" x2="23" y2="10" {...p}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...p}/><polyline points="17 6 23 6 23 12" {...p}/></>,
    bot:          <><rect x="3" y="11" width="18" height="10" rx="2" {...p}/><path d="M12 11V7" {...p}/><circle cx="12" cy="5" r="2" {...p}/><path d="M7 15h0M12 15h0M17 15h0" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...p}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...p}/></>,
    arrowRight:   <><line x1="5" y1="12" x2="19" y2="12" {...p}/><polyline points="12 5 19 12 12 19" {...p}/></>,
    arrowUpDown:  <><polyline points="7 16 12 21 17 16" {...p}/><polyline points="7 8 12 3 17 8" {...p}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8"/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...p}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...p}/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2" {...p}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...p}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...p}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" fill="none"/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" {...p}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...p}/><circle cx="12" cy="16" r="1.5" fill={color} stroke="none"/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    eyeOff:       <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" {...p}/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" {...p}/><line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="1.6"/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...p}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...p}/></>,
    zap:          <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p}/></>,
    piggyBank:    <><path d="M19 11c0-3.87-3.13-7-7-7s-7 3.13-7 7" {...p}/><path d="M5 11H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2" {...p}/><path d="M19 11h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2" {...p}/><path d="M12 20v-6" {...p}/><path d="M8 20h8" {...p}/><circle cx="15" cy="9" r="1" fill={color} stroke="none"/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="1.8"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="1.8"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="1.8"/></>,
    info:         <><circle cx="12" cy="12" r="10" {...p}/><line x1="12" y1="16" x2="12" y2="12" {...p}/><line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...p}/></>,
    sparkle:      <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="4" {...p}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="15" rx="2" {...p}/><path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill={color} stroke="none"/><path d="M2 10h20" {...p}/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...p}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0 }}>{icons[name]||null}</svg>;
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Badge({ children, color }) {
  return <span style={{ background:color+"15", color, border:`1px solid ${color}30`,
    borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700,
    display:"inline-flex", alignItems:"center", gap:4 }}>{children}</span>;
}

function Label({ children, required }) {
  return <div style={{ fontSize:12, fontWeight:700, color:T.textMid, marginBottom:6,
    textTransform:"uppercase", letterSpacing:0.8 }}>
    {children}{required&&<span style={{ color:T.red }}> *</span>}
  </div>;
}

function Field({ value, onChange, placeholder, prefix, type="text" }) {
  const [f, setF] = useState(false);
  return <div style={{ position:"relative", marginBottom:16 }}>
    {prefix&&<span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
      fontSize:13, color:T.textMute, fontWeight:600, pointerEvents:"none" }}>{prefix}</span>}
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{ width:"100%", background:f?T.surface:T.cardAlt, border:`1.5px solid ${f?T.navy:T.border}`,
        borderRadius:12, padding:prefix?"13px 14px 13px 44px":"13px 14px",
        color:T.text, fontSize:14, fontFamily:"inherit", outline:"none",
        transition:"all 0.2s", boxSizing:"border-box", fontWeight:500 }}
      onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
  </div>;
}

function Select({ value, onChange, options }) {
  return <select value={value} onChange={e=>onChange(e.target.value)}
    style={{ width:"100%", background:T.cardAlt, border:`1.5px solid ${T.border}`, borderRadius:12,
      padding:"13px 14px", color:T.text, fontSize:14, fontFamily:"inherit",
      outline:"none", marginBottom:16, boxSizing:"border-box", fontWeight:500,
      appearance:"none" }}>
    {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}

function Btn({ children, onClick, variant="primary", size="md", loading, full, icon, disabled }) {
  const p = size==="sm"?"8px 16px":size==="lg"?"15px 32px":"12px 22px";
  const fs = size==="sm"?12:size==="lg"?14:13;
  const styles = {
    primary: { background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, color:"#fff", boxShadow:`0 4px 14px ${T.navy}33`, border:"none" },
    gold:    { background:`linear-gradient(135deg,${T.gold},#A07008)`, color:"#fff", boxShadow:`0 4px 14px ${T.gold}44`, border:"none" },
    outline: { background:"transparent", color:T.navy, border:`1.5px solid ${T.navy}33` },
    ghost:   { background:T.cardAlt, color:T.textMid, border:`1px solid ${T.border}` },
    success: { background:T.greenBg, color:T.green, border:`1px solid ${T.green}33` },
    danger:  { background:T.redBg, color:T.red, border:`1px solid ${T.red}33` },
    teal:    { background:T.tealBg, color:T.teal, border:`1px solid ${T.teal}33` },
  };
  return <button onClick={onClick} disabled={!!loading||!!disabled}
    style={{ borderRadius:12, cursor:loading||disabled?"not-allowed":"pointer", fontFamily:"inherit",
      fontWeight:700, transition:"all 0.18s", display:"inline-flex", alignItems:"center",
      justifyContent:"center", gap:8, padding:p, fontSize:fs, width:full?"100%":"auto",
      opacity:loading||disabled?0.6:1, ...styles[variant] }}>
    {icon&&<Icon name={icon} size={fs+2} color="currentColor"/>}
    {loading?"Processing...":children}
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
      {action&&<button onClick={onAction} style={{ fontSize:12, color:T.gold, background:"none",
        border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>{action}</button>}
    </div>
    {sub&&<div style={{ fontSize:12, color:T.textMute, marginTop:3 }}>{sub}</div>}
  </div>;
}

function Divider() { return <div style={{ height:1, background:T.border, margin:"14px 0" }}/>; }

function Toast({ toasts }) {
  return <div style={{ position:"fixed", top:16, right:16, zIndex:9999,
    display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
    {toasts.map(t=><div key={t.id} style={{ background:T.surface,
      borderLeft:`4px solid ${t.color||T.gold}`, borderRadius:12,
      padding:"12px 18px", boxShadow:T.shadowMd, minWidth:270, maxWidth:340,
      animation:"toastIn 0.3s ease", border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:12, color:T.textMute }}>{t.msg}</div>
    </div>)}
  </div>;
}

function Modal({ title, subtitle, onClose, children, wide }) {
  return <div style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center",
    justifyContent:"center", padding:16, background:"rgba(11,31,75,0.45)", backdropFilter:"blur(6px)" }}>
    <div style={{ background:T.surface, borderRadius:24, padding:"28px 26px", width:"100%",
      maxWidth:wide?560:460, maxHeight:"90vh", overflowY:"auto", boxShadow:T.shadowLg,
      border:`1px solid ${T.border}`, position:"relative", animation:"modalIn 0.25s ease" }}>
      <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2,
        background:`linear-gradient(90deg,transparent,${T.gold},transparent)`, borderRadius:99 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.text }}>{title}</div>
          {subtitle&&<div style={{ fontSize:12, color:T.textMute, marginTop:3 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:T.cardAlt,
          border:`1px solid ${T.border}`, cursor:"pointer", display:"flex",
          alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={14} color={T.textMute}/>
        </button>
      </div>
      {children}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 5A — MULTI-CURRENCY WALLET
// ═══════════════════════════════════════════════════════════════════════════════
function MultiCurrencyWallet({ toast }) {
  const [balances, setBalances] = useState({
    TZS: 2450000, USD: 142.50, KES: 18400, UGX: 520000,
  });
  const [rates] = useState({
    TZS:1, USD:0.000038, KES:0.0048, UGX:0.145,
  });
  const [modal, setModal] = useState(null);
  const [fromCur, setFromCur] = useState("TZS");
  const [toCur, setToCur]     = useState("USD");
  const [convertAmt, setConvertAmt] = useState("");
  const [converted, setConverted]   = useState(null);
  const [done, setDone]             = useState(false);
  const [addModal, setAddModal]     = useState(false);
  const [addAmt, setAddAmt]         = useState("");
  const [addCur, setAddCur]         = useState("USD");

  const CURRENCIES = [
    { code:"TZS", name:"Tanzanian Shilling", flag:"🇹🇿", fmt:fmt,    color:T.navy,   symbol:"TSh" },
    { code:"USD", name:"US Dollar",           flag:"🇺🇸", fmt:fmtUSD, color:T.green,  symbol:"$"   },
    { code:"KES", name:"Kenyan Shilling",     flag:"🇰🇪", fmt:fmtKES, color:T.red,    symbol:"KES" },
    { code:"UGX", name:"Ugandan Shilling",    flag:"🇺🇬", fmt:fmtUGX, color:T.purple, symbol:"UGX" },
  ];

  const totalUSD = Object.entries(balances).reduce((s,[c,v])=>s+(v*rates[c]),0);

  const doConvert = () => {
    const a = parseFloat(convertAmt) || 0;
    if(a<=0||fromCur===toCur) return;
    const inUSD = a * rates[fromCur];
    const result = inUSD / rates[toCur];
    setConverted(result);
  };

  const confirmConvert = () => {
    const a = parseFloat(convertAmt)||0;
    const inUSD = a * rates[fromCur];
    const result = inUSD / rates[toCur];
    if(balances[fromCur]<a){ toast("Insufficient Balance","Not enough funds to convert.",T.red); return; }
    setBalances(b=>({ ...b, [fromCur]:b[fromCur]-a, [toCur]:b[toCur]+result }));
    toast("Currency Converted",`${convertAmt} ${fromCur} converted to ${result.toFixed(4)} ${toCur}`,T.gold);
    setDone(true);
  };

  const fmtBal = (code, val) => {
    const c = CURRENCIES.find(x=>x.code===code);
    return c ? c.fmt(val) : val;
  };

  const txHistory = [
    { from:"TZS", to:"USD", amt:500000, result:19.0,  time:"Today, 10:30",     rate:"1 USD = 26,315 TZS" },
    { from:"USD", to:"KES", amt:50,     result:6500,   time:"Yesterday, 14:00", rate:"1 USD = 130 KES"     },
    { from:"TZS", to:"UGX", amt:200000, result:29000,  time:"Jun 12",           rate:"1 TZS = 0.145 UGX"  },
  ];

  return <div>
    {/* Total Value Card */}
    <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,
      borderRadius:24, padding:"26px 24px", marginBottom:18,
      boxShadow:"0 20px 56px rgba(11,31,75,0.3), 0 0 0 1px rgba(201,150,10,0.18)",
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,150,10,0.15),transparent 70%)" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2,
        textTransform:"uppercase", marginBottom:6 }}>Total Portfolio Value</div>
      <div style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1,
        fontFamily:"monospace", marginBottom:4 }}>{fmtUSD(totalUSD)}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:20 }}>
        Equivalent value across all currencies
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Btn size="sm" variant="gold" icon="arrowUpDown" onClick={()=>{ setModal("convert"); setDone(false); setConverted(null); setConvertAmt(""); }}>
          Convert Currency
        </Btn>
        <Btn size="sm" variant="outline" icon="plus" onClick={()=>setAddModal(true)}
          style={{ border:"1px solid rgba(255,255,255,0.3)", color:"rgba(255,255,255,0.8)" }}>
          Add Currency
        </Btn>
      </div>
    </div>

    {/* Currency balances */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Currency Balances" sub="Your holdings across all supported currencies"/>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CURRENCIES.map(c=><div key={c.code} style={{ display:"flex", alignItems:"center",
          gap:14, padding:"14px 16px", borderRadius:14,
          background:T.cardAlt, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:28, flexShrink:0 }}>{c.flag}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.text, marginBottom:2 }}>{c.code}</div>
            <div style={{ fontSize:11, color:T.textMute }}>{c.name}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16, fontWeight:900, color:c.color,
              fontFamily:"monospace", marginBottom:4 }}>
              {c.fmt(balances[c.code])}
            </div>
            <div style={{ fontSize:11, color:T.textMute }}>
              ≈ {fmtUSD(balances[c.code]*rates[c.code])}
            </div>
          </div>
        </div>)}
      </div>
    </Card>

    {/* Live rates */}
    <Card style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <SHead title="Live Exchange Rates" sub="Updated every 15 minutes"/>
        <button onClick={()=>toast("Rates Updated","Exchange rates refreshed.",T.green)}
          style={{ background:"none", border:"none", cursor:"pointer", color:T.gold, display:"flex" }}>
          <Icon name="refresh" size={16} color={T.gold}/>
        </button>
      </div>
      {[
        { pair:"USD / TZS", rate:"1 USD = 26,315 TZS", change:"+0.3%", up:true  },
        { pair:"KES / TZS", rate:"1 KES = 202 TZS",    change:"-0.1%", up:false },
        { pair:"UGX / TZS", rate:"1 UGX = 6.89 TZS",  change:"+0.5%", up:true  },
        { pair:"EUR / TZS", rate:"1 EUR = 28,400 TZS", change:"+0.2%", up:true  },
      ].map((r,i)=><div key={r.pair} style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", padding:"11px 0",
        borderBottom:i<3?`1px solid ${T.border}`:"none" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{r.pair}</div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ fontSize:13, color:T.textMid, fontFamily:"monospace" }}>{r.rate}</div>
          <Badge color={r.up?T.green:T.red}>{r.change}</Badge>
        </div>
      </div>)}
    </Card>

    {/* Conversion history */}
    <Card>
      <SHead title="Conversion History"/>
      {txHistory.map((t,i)=><div key={i} style={{ display:"flex", gap:14, alignItems:"center",
        padding:"12px 0", borderBottom:i<txHistory.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ width:42, height:42, borderRadius:12, background:T.goldLight,
          border:`1px solid ${T.gold}22`, display:"flex", alignItems:"center",
          justifyContent:"center", flexShrink:0 }}>
          <Icon name="arrowUpDown" size={18} color={T.gold}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>
            {t.amt} {t.from} → {t.result.toLocaleString()} {t.to}
          </div>
          <div style={{ fontSize:11, color:T.textMute }}>{t.rate} · {t.time}</div>
        </div>
        <Badge color={T.gold}>Converted</Badge>
      </div>)}
    </Card>

    {/* Convert Modal */}
    {modal==="convert"&&<Modal title="Convert Currency" subtitle="Real-time exchange rates apply"
      onClose={()=>setModal(null)}>
      {!done?<>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"end", marginBottom:4 }}>
          <div>
            <Label required>From</Label>
            <Select value={fromCur} onChange={setFromCur} options={CURRENCIES.map(c=>({ value:c.code, label:`${c.flag} ${c.code}` }))}/>
          </div>
          <div style={{ paddingBottom:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <button onClick={()=>{ const tmp=fromCur; setFromCur(toCur); setToCur(tmp); setConverted(null); }}
              style={{ width:36, height:36, borderRadius:"50%", background:T.navyLight,
                border:`1px solid ${T.border}`, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
              <Icon name="arrowUpDown" size={16} color={T.navy}/>
            </button>
          </div>
          <div>
            <Label required>To</Label>
            <Select value={toCur} onChange={v=>{ setToCur(v); setConverted(null); }} options={CURRENCIES.map(c=>({ value:c.code, label:`${c.flag} ${c.code}` }))}/>
          </div>
        </div>
        <Label required>Amount to Convert</Label>
        <Field value={convertAmt} onChange={v=>{ setConvertAmt(v); setConverted(null); }} placeholder={`Enter amount in ${fromCur}`} prefix={CURRENCIES.find(c=>c.code===fromCur)?.symbol}/>
        <div style={{ background:T.navyLight, borderRadius:12, padding:"12px 16px", marginBottom:16,
          display:"flex", justifyContent:"space-between", fontSize:13 }}>
          <span style={{ color:T.textMute }}>Available balance</span>
          <span style={{ color:T.navy, fontWeight:800, fontFamily:"monospace" }}>
            {fmtBal(fromCur, balances[fromCur])}
          </span>
        </div>
        {convertAmt&&<>
          <Btn full variant="outline" icon="refresh" onClick={doConvert}>Preview Rate</Btn>
          {converted!==null&&<div style={{ background:T.greenBg, border:`1px solid ${T.green}33`,
            borderRadius:12, padding:"14px 16px", marginTop:12, marginBottom:16 }}>
            <div style={{ fontSize:12, color:T.green, fontWeight:700, marginBottom:4 }}>You will receive</div>
            <div style={{ fontSize:22, fontWeight:900, color:T.green, fontFamily:"monospace" }}>
              {fmtBal(toCur, converted)}
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:4 }}>
              Rate: 1 {fromCur} = {(rates[fromCur]/rates[toCur]).toFixed(4)} {toCur}
            </div>
          </div>}
        </>}
        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn full variant="gold" icon="arrowUpDown" disabled={!converted} onClick={confirmConvert}>
            Confirm Conversion
          </Btn>
        </div>
      </>:<div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:T.greenBg,
          border:`2px solid ${T.green}44`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="check" size={28} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:6 }}>Conversion Complete!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          Your {fromCur} has been converted to {toCur} at the live rate.
        </div>
        <Btn variant="gold" onClick={()=>{ setModal(null); setDone(false); }}>Done</Btn>
      </div>}
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 5B — PANDA VIRTUAL CARD
// ═══════════════════════════════════════════════════════════════════════════════
function VirtualCard({ toast }) {
  const [cardVisible, setCardVisible] = useState(false);
  const [frozen, setFrozen]           = useState(false);
  const [modal, setModal]             = useState(null);
  const [topupAmt, setTopupAmt]       = useState("");
  const [cardBal, setCardBal]         = useState(85000);
  const [limit, setLimit]             = useState(500000);
  const [copied, setCopied]           = useState(null);

  const card = {
    number: "4532 8819 2041 7736",
    expiry: "09/28",
    cvv:    "847",
    name:   "BAK ONLINE LIFE",
    type:   "Visa",
  };

  const mask = str => str.replace(/\d(?=\d{4})/g, "•");

  const txs = [
    { merchant:"Netflix",        amt:15000, cat:"Streaming", time:"Today, 08:00",    flag:"🇺🇸", status:"completed" },
    { merchant:"AWS Console",    amt:42000, cat:"Cloud",     time:"Yesterday, 14:30",flag:"🇺🇸", status:"completed" },
    { merchant:"Google Play",    amt:8000,  cat:"Apps",      time:"Jun 12",           flag:"🇺🇸", status:"completed" },
    { merchant:"Canva Pro",      amt:12000, cat:"Design",    time:"Jun 10",           flag:"🇦🇺", status:"completed" },
    { merchant:"Notion",         amt:5000,  cat:"Productivity",time:"Jun 8",          flag:"🇺🇸", status:"completed" },
    { merchant:"Hover.com",      amt:18000, cat:"Domain",    time:"Jun 5",            flag:"🇺🇸", status:"completed" },
  ];

  const usedThisMonth = txs.reduce((s,t)=>s+t.amt, 0);

  const copy = (field, val) => {
    setCopied(field);
    setTimeout(()=>setCopied(null), 2500);
    toast("Copied",`${field} copied to clipboard.`,T.navy);
  };

  return <div>
    {/* Virtual Card */}
    <div style={{ background:`linear-gradient(135deg,#0B1F4B 0%,#1A3A6E 40%,#0F2A5C 100%)`,
      borderRadius:24, padding:"28px 26px", marginBottom:18, position:"relative", overflow:"hidden",
      boxShadow:"0 24px 64px rgba(11,31,75,0.35), 0 0 0 1px rgba(201,150,10,0.2)",
      minHeight:200 }}>
      <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,150,10,0.14),transparent 70%)" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.55),transparent)" }}/>

      {/* Card header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2,
            textTransform:"uppercase" }}>Panda Virtual Card</div>
          <div style={{ fontSize:13, color:"#C9960A", fontWeight:700, marginTop:2 }}>Online Payments</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {frozen&&<Badge color={T.red}>Frozen</Badge>}
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:8, padding:"4px 12px",
            border:"1px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize:14, fontWeight:900, color:"#fff", letterSpacing:0.5 }}>VISA</span>
          </div>
        </div>
      </div>

      {/* Chip */}
      <div style={{ width:42, height:32, background:`linear-gradient(135deg,${T.gold},${T.goldMid})`,
        borderRadius:6, marginBottom:18, boxShadow:`0 4px 12px ${T.gold}55` }}/>

      {/* Card number */}
      <div style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:3,
        fontFamily:"monospace", marginBottom:18 }}>
        {cardVisible ? card.number : mask(card.number)}
      </div>

      {/* Card footer */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2,
            textTransform:"uppercase", marginBottom:4 }}>Card Holder</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontWeight:700,
            letterSpacing:1 }}>{card.name}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2,
            textTransform:"uppercase", marginBottom:4 }}>Expires</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontWeight:700,
            fontFamily:"monospace" }}>{cardVisible?card.expiry:"••/••"}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2,
            textTransform:"uppercase", marginBottom:4 }}>CVV</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontWeight:700,
            fontFamily:"monospace" }}>{cardVisible?card.cvv:"•••"}</div>
        </div>
      </div>
    </div>

    {/* Card balance + actions */}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
      <Card style={{ padding:"16px 18px" }}>
        <div style={{ fontSize:11, color:T.textMute, fontWeight:700, textTransform:"uppercase",
          letterSpacing:0.8, marginBottom:6 }}>Card Balance</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.navy, fontFamily:"monospace",
          letterSpacing:-0.5, marginBottom:6 }}>{fmt(cardBal)}</div>
        <Badge color={frozen?T.red:T.green}>{frozen?"Card Frozen":"Active"}</Badge>
      </Card>
      <Card style={{ padding:"16px 18px" }}>
        <div style={{ fontSize:11, color:T.textMute, fontWeight:700, textTransform:"uppercase",
          letterSpacing:0.8, marginBottom:6 }}>Spent This Month</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.text, fontFamily:"monospace",
          letterSpacing:-0.5, marginBottom:6 }}>{fmt(usedThisMonth)}</div>
        <div style={{ fontSize:11, color:T.textMute }}>Limit: {fmt(limit)}</div>
      </Card>
    </div>

    {/* Spending limit bar */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Monthly Spending Limit"/>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12,
        color:T.textMute, marginBottom:8 }}>
        <span>Used: {fmt(usedThisMonth)}</span>
        <span>Limit: {fmt(limit)}</span>
      </div>
      <div style={{ background:T.border, borderRadius:99, height:10, overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", width:`${Math.min((usedThisMonth/limit)*100,100)}%`,
          background:`linear-gradient(90deg,${T.green},${usedThisMonth/limit>0.8?T.red:T.green})`,
          borderRadius:99, transition:"width 1s ease" }}/>
      </div>
      <div style={{ fontSize:11, color:T.textMute }}>
        {fmt(limit-usedThisMonth)} remaining this month
      </div>
    </Card>

    {/* Card controls */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Card Controls"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          { label:"Show Card Details", icon:"eye",        action:()=>setCardVisible(v=>!v), variant:cardVisible?"danger":"primary" },
          { label:"Top Up Card",       icon:"plus",       action:()=>setModal("topup"),    variant:"gold" },
          { label:frozen?"Unfreeze Card":"Freeze Card", icon:"lock", action:()=>{ setFrozen(f=>!f); toast(frozen?"Card Unfrozen":"Card Frozen",frozen?"Card is now active.":"All card transactions blocked.",frozen?T.green:T.red); }, variant:frozen?"success":"danger" },
          { label:"Card Settings",     icon:"settings",   action:()=>setModal("settings"), variant:"ghost" },
        ].map(b=><button key={b.label} onClick={b.action} style={{ padding:"14px 12px",
          borderRadius:14, cursor:"pointer", fontFamily:"inherit", fontWeight:700,
          fontSize:12, transition:"all 0.18s", display:"flex", flexDirection:"column",
          alignItems:"center", gap:8, border:`1px solid ${T.border}`,
          background:T.cardAlt, color:T.textMid }}>
          <Icon name={b.icon} size={20} color={T.navy}/>
          {b.label}
        </button>)}
      </div>

      {/* Card details (when visible) */}
      {cardVisible&&<div style={{ marginTop:14, background:T.navyLight, borderRadius:14, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.textMid, marginBottom:12,
          textTransform:"uppercase", letterSpacing:0.8 }}>Card Details — Keep these private</div>
        {[
          { label:"Card Number", value:card.number, field:"Card Number" },
          { label:"Expiry",      value:card.expiry, field:"Expiry"      },
          { label:"CVV",         value:card.cvv,    field:"CVV"         },
        ].map(d=><div key={d.label} style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:12, color:T.textMute, fontWeight:600 }}>{d.label}</span>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:13, fontWeight:800, color:T.navy, fontFamily:"monospace",
              letterSpacing:1 }}>{d.value}</span>
            <button onClick={()=>copy(d.field, d.value)}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:copied===d.field?T.green:T.textMute, display:"flex" }}>
              <Icon name={copied===d.field?"check":"copy"} size={14}
                color={copied===d.field?T.green:T.textMute}/>
            </button>
          </div>
        </div>)}
      </div>}
    </Card>

    {/* Transactions */}
    <Card>
      <SHead title="Card Transactions" sub="All online payments made with your Panda card"/>
      {txs.map((t,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:14,
        padding:"12px 0", borderBottom:i<txs.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ width:42, height:42, borderRadius:12, background:T.navyLight,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          fontSize:16 }}>{t.flag}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>{t.merchant}</div>
          <div style={{ fontSize:11, color:T.textMute }}>{t.cat} · {t.time}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:14, fontWeight:900, color:T.red, fontFamily:"monospace" }}>
            -{fmt(t.amt)}
          </div>
          <Badge color={T.green}>Paid</Badge>
        </div>
      </div>)}
    </Card>

    {/* Top up modal */}
    {modal==="topup"&&<Modal title="Top Up Card" subtitle="Add funds to your virtual card"
      onClose={()=>setModal(null)}>
      <Label required>Amount to add</Label>
      <Field value={topupAmt} onChange={setTopupAmt} placeholder="e.g. 100,000" prefix="TSh"/>
      <div style={{ background:T.navyLight, borderRadius:12, padding:"12px 16px",
        marginBottom:16, display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, color:T.textMute }}>Card Balance After</span>
        <span style={{ fontSize:13, color:T.navy, fontWeight:900, fontFamily:"monospace" }}>
          {fmt(cardBal + (parseInt(topupAmt.replace(/,/g,""))||0))}
        </span>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
        <Btn full variant="gold" icon="plus" onClick={()=>{
          const a = parseInt(topupAmt.replace(/,/g,""))||0;
          if(a>0){ setCardBal(b=>b+a); setModal(null); setTopupAmt("");
            toast("Card Topped Up",`${fmt(a)} added to your virtual card.`,T.gold); }
        }}>Top Up</Btn>
      </div>
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 5C — INVESTMENT WALLET
// ═══════════════════════════════════════════════════════════════════════════════
function InvestmentWallet({ toast }) {
  const [portfolio, setPortfolio] = useState([
    { id:1, name:"Panda T-Bills",       type:"Government Bond", risk:"Low",    return:9.5,  invested:500000,  value:547500,  period:"90 days",  maturity:"Sep 12, 2026" },
    { id:2, name:"DSE Equity Fund",     type:"Stock Fund",      risk:"Medium", return:18.2, invested:300000,  value:354600,  period:"1 year",   maturity:"Jun 1, 2027"  },
    { id:3, name:"East Africa REIT",    type:"Real Estate",     risk:"Medium", return:14.5, invested:200000,  value:229000,  period:"2 years",  maturity:"Jun 1, 2028"  },
    { id:4, name:"Panda Money Market",  type:"Money Market",    risk:"Low",    return:7.8,  invested:150000,  value:161700,  period:"30 days",  maturity:"Jul 1, 2026"  },
  ]);
  const [modal, setModal]       = useState(null);
  const [selInv, setSelInv]     = useState(null);
  const [invAmt, setInvAmt]     = useState("");
  const [done, setDone]         = useState(false);

  const totalInvested = portfolio.reduce((s,p)=>s+p.invested, 0);
  const totalValue    = portfolio.reduce((s,p)=>s+p.value, 0);
  const totalGain     = totalValue - totalInvested;
  const gainPct       = ((totalGain/totalInvested)*100).toFixed(1);

  const riskColor = { Low:T.green, Medium:T.amber, High:T.red };

  const opportunities = [
    { name:"Panda T-Bills 2026 Q3", type:"Government Bond", risk:"Low",    return:9.8,  min:50000,   period:"90 days" },
    { name:"DSE Blue Chip Fund",    type:"Stock Fund",      risk:"Medium", return:20.1, min:100000,  period:"1 year"  },
    { name:"Kenya Infrastructure",  type:"Infrastructure",  risk:"Medium", return:16.5, min:200000,  period:"3 years" },
    { name:"Crypto Index Fund",     type:"Digital Assets",  risk:"High",   return:45.0, min:50000,   period:"1 year"  },
  ];

  const invest = () => {
    const a = parseInt(invAmt.replace(/,/g,""))||0;
    if(!selInv||a<selInv.min){ toast("Minimum Investment",`Minimum investment is ${fmt(selInv.min)}`,T.red); return; }
    setPortfolio(p=>[...p,{
      id:Date.now(), name:selInv.name, type:selInv.type, risk:selInv.risk,
      return:selInv.return, invested:a, value:a, period:selInv.period,
      maturity:"Jun 2027"
    }]);
    toast("Investment Placed",`${fmt(a)} invested in ${selInv.name}`,T.gold);
    setDone(true);
  };

  return <div>
    {/* Portfolio overview card */}
    <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,
      borderRadius:24, padding:"26px 24px", marginBottom:18,
      boxShadow:"0 20px 56px rgba(11,31,75,0.3), 0 0 0 1px rgba(201,150,10,0.18)",
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,150,10,0.15),transparent 70%)" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2,
        textTransform:"uppercase", marginBottom:6 }}>Investment Portfolio</div>
      <div style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1,
        fontFamily:"monospace", marginBottom:4 }}>{fmt(totalValue)}</div>
      <div style={{ display:"flex", gap:16, marginBottom:20, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
            letterSpacing:1.5, marginBottom:3 }}>Invested</div>
          <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.75)",
            fontFamily:"monospace" }}>{fmt(totalInvested)}</div>
        </div>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
            letterSpacing:1.5, marginBottom:3 }}>Total Gain</div>
          <div style={{ fontSize:14, fontWeight:800, color:"#34D399",
            fontFamily:"monospace" }}>+{fmt(totalGain)} ({gainPct}%)</div>
        </div>
      </div>
      <Btn size="sm" variant="gold" icon="plus" onClick={()=>{ setModal("invest"); setDone(false); setInvAmt(""); setSelInv(null); }}>
        New Investment
      </Btn>
    </div>

    {/* Portfolio holdings */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Your Holdings" sub={`${portfolio.length} active investments`}/>
      {portfolio.map((p,i)=>{
        const gain = p.value - p.invested;
        const gainP = ((gain/p.invested)*100).toFixed(1);
        return <div key={p.id} style={{ padding:"16px 0",
          borderBottom:i<portfolio.length-1?`1px solid ${T.border}`:"none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
            marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{p.name}</div>
                <Badge color={riskColor[p.risk]}>{p.risk} Risk</Badge>
              </div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:2 }}>{p.type} · {p.period}</div>
              <div style={{ fontSize:11, color:T.textMute }}>Matures: {p.maturity}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                fontFamily:"monospace", marginBottom:4 }}>{fmt(p.value)}</div>
              <div style={{ fontSize:12, color:T.green, fontWeight:700 }}>+{fmt(gain)} ({gainP}%)</div>
              <div style={{ fontSize:11, color:T.textMute }}>{p.return}% p.a.</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ background:T.border, borderRadius:99, height:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min((p.value/p.invested)*100-100+50,100)}%`,
              background:`linear-gradient(90deg,${T.green},#34D399)`, borderRadius:99 }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:T.textMute }}>
            <span>Invested: {fmt(p.invested)}</span>
            <span>Current: {fmt(p.value)}</span>
          </div>
        </div>;
      })}
    </Card>

    {/* Opportunities */}
    <Card>
      <SHead title="Investment Opportunities" sub="Invest directly from your Panda wallet"/>
      {opportunities.map((o,i)=><div key={i} style={{ padding:"14px 0",
        borderBottom:i<opportunities.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
          marginBottom:10, flexWrap:"wrap", gap:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.text }}>{o.name}</div>
              <Badge color={riskColor[o.risk]}>{o.risk}</Badge>
            </div>
            <div style={{ fontSize:12, color:T.textMute, marginBottom:2 }}>{o.type} · {o.period}</div>
            <div style={{ fontSize:11, color:T.textMute }}>Min: {fmt(o.min)}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:18, fontWeight:900, color:T.green,
              marginBottom:8 }}>{o.return}% p.a.</div>
            <Btn size="sm" variant="gold" icon="trendingUp"
              onClick={()=>{ setSelInv(o); setModal("invest"); setDone(false); setInvAmt(""); }}>
              Invest
            </Btn>
          </div>
        </div>
      </div>)}
    </Card>

    {/* Invest modal */}
    {modal==="invest"&&<Modal title="Make an Investment" subtitle="Funds are deducted from your Panda wallet"
      onClose={()=>setModal(null)}>
      {!done?<>
        {!selInv?<>
          <Label required>Select Investment</Label>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {opportunities.map(o=><div key={o.name} onClick={()=>setSelInv(o)}
              style={{ padding:"14px 16px", borderRadius:14, cursor:"pointer",
                border:`2px solid ${selInv?.name===o.name?T.gold:T.border}`,
                background:selInv?.name===o.name?T.goldLight:T.cardAlt,
                transition:"all 0.18s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:2 }}>{o.name}</div>
                  <div style={{ fontSize:11, color:T.textMute }}>{o.type} · Min {fmt(o.min)}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, fontWeight:900, color:T.green }}>{o.return}%</div>
                  <Badge color={riskColor[o.risk]}>{o.risk}</Badge>
                </div>
              </div>
            </div>)}
          </div>
        </>:<>
          <div style={{ background:T.navyLight, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.text, marginBottom:4 }}>{selInv.name}</div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, color:T.textMute }}>Return: <strong style={{ color:T.green }}>{selInv.return}% p.a.</strong></span>
              <span style={{ fontSize:12, color:T.textMute }}>Min: <strong style={{ color:T.navy }}>{fmt(selInv.min)}</strong></span>
              <span style={{ fontSize:12, color:T.textMute }}>Period: <strong style={{ color:T.navy }}>{selInv.period}</strong></span>
            </div>
          </div>
          <Label required>Investment Amount</Label>
          <Field value={invAmt} onChange={setInvAmt} placeholder={`Minimum ${fmt(selInv.min)}`} prefix="TSh"/>
          {invAmt&&parseInt(invAmt.replace(/,/g,""))>0&&<div style={{ background:T.greenBg,
            border:`1px solid ${T.green}33`, borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
            <div style={{ fontSize:12, color:T.green, fontWeight:700, marginBottom:4 }}>Projected Return</div>
            <div style={{ fontSize:18, fontWeight:900, color:T.green, fontFamily:"monospace" }}>
              {fmt(Math.round((parseInt(invAmt.replace(/,/g,""))||0)*(1+selInv.return/100)))}
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginTop:4 }}>After {selInv.period} at {selInv.return}% p.a.</div>
          </div>}
          <button onClick={()=>setSelInv(null)} style={{ fontSize:12, color:T.textMute, background:"none",
            border:"none", cursor:"pointer", marginBottom:16, fontFamily:"inherit" }}>
            Change investment
          </button>
        </>}
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn full variant="gold" icon="trendingUp" disabled={!selInv||!invAmt} onClick={invest}>
            Confirm Investment
          </Btn>
        </div>
      </>:<div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:T.greenBg,
          border:`2px solid ${T.green}44`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="check" size={28} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:6 }}>Investment Placed!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          {fmt(parseInt(invAmt.replace(/,/g,"")||0))} invested in {selInv?.name}. Track your returns in portfolio.
        </div>
        <Btn variant="gold" onClick={()=>{ setModal(null); setDone(false); }}>Done</Btn>
      </div>}
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 5D — AI FINANCIAL ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════
function AIAssistant({ toast }) {
  const [messages, setMessages] = useState([
    { role:"ai", text:"Hello BAK! I am your Panda AI Financial Assistant. I have analyzed your spending, savings, and investment patterns. How can I help you today?", time:"Now" },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);
  const bottomRef = useRef(null);

  const insights = [
    { id:1, type:"warning", color:T.amber, icon:"zap",
      title:"Spending Spike Detected",
      desc:"Your transport spending is up 32% this month compared to last month.",
      action:"See breakdown" },
    { id:2, type:"tip", color:T.green, icon:"piggyBank",
      title:"Savings Opportunity",
      desc:"If you save TSh 15,000 per week, you will reach your TSh 300,000 goal in 5 months.",
      action:"Set up auto-save" },
    { id:3, type:"insight", color:T.blue, icon:"barChart",
      title:"Income Pattern",
      desc:"You receive most of your income between the 1st and 5th of each month.",
      action:"Plan budget" },
    { id:4, type:"invest", color:T.gold, icon:"trendingUp",
      title:"Idle Balance Alert",
      desc:"TSh 850,000 has been sitting idle for 14 days. Invest it and earn up to 9.5% p.a.",
      action:"View opportunities" },
  ];

  const aiReplies = {
    "spending":   "Based on your last 30 days, you spent the most on food (42%), transport (28%), utilities (18%), and entertainment (12%). Your food spending is 15% higher than the previous month.",
    "save":       "To save more effectively, I recommend setting up a recurring transfer of TSh 50,000 every Friday to your savings vault. Based on your income pattern, this is achievable without affecting your daily expenses.",
    "invest":     "You currently have TSh 850,000 in idle balance. I recommend splitting it as follows: 60% in Panda T-Bills (9.5% p.a., low risk), 30% in DSE Equity Fund (18% p.a., medium risk), and 10% keep as emergency fund.",
    "budget":     "Based on your income of approximately TSh 2,450,000 per month, I suggest: 50% for needs (TSh 1,225,000), 30% for wants (TSh 735,000), and 20% for savings and investments (TSh 490,000).",
    "loan":       "Based on your transaction history and credit score of 742, you qualify for a Panda microloan of up to TSh 5,000,000 at 12% p.a. Would you like to apply?",
    "default":    "That is a great question, BAK. Based on your financial profile, I see you are making good progress. Your net worth has grown 14% this quarter. Is there a specific area you would like to focus on — spending, savings, or investments?",
  };

  const getReply = (msg) => {
    const m = msg.toLowerCase();
    if(m.includes("spend")) return aiReplies.spending;
    if(m.includes("save")||m.includes("saving")) return aiReplies.save;
    if(m.includes("invest")) return aiReplies.invest;
    if(m.includes("budget")) return aiReplies.budget;
    if(m.includes("loan")||m.includes("borrow")) return aiReplies.loan;
    return aiReplies.default;
  };

  const send = () => {
    if(!input.trim()) return;
    const userMsg = { role:"user", text:input, time:"Now" };
    setMessages(m=>[...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(()=>{
      const reply = getReply(input);
      setMessages(m=>[...m, { role:"ai", text:reply, time:"Now" }]);
      setLoading(false);
      setTimeout(()=>bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
    }, 1400);
  };

  const quickPrompts = [
    "Analyze my spending",
    "How can I save more?",
    "Where should I invest?",
    "Build me a budget",
    "Do I qualify for a loan?",
  ];

  return <div>
    {/* AI Header */}
    <Card style={{ marginBottom:14, background:`linear-gradient(145deg,${T.navyLight},${T.surface})`,
      border:`1.5px solid ${T.navy}22` }}>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:52, height:52, borderRadius:16, background:T.navy,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          boxShadow:`0 8px 24px ${T.navy}44` }}>
          <Icon name="bot" size={26} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:T.navy, marginBottom:3 }}>Panda AI Assistant</div>
          <div style={{ fontSize:12, color:T.textMute, lineHeight:1.4 }}>
            Powered by your real financial data · Personalized insights · Always learning
          </div>
          <div style={{ display:"flex", gap:6, marginTop:6 }}>
            <Badge color={T.green}>Online</Badge>
            <Badge color={T.blue}>Analyzing your data</Badge>
          </div>
        </div>
      </div>
    </Card>

    {/* AI Insights */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Smart Insights" sub="AI-generated alerts and recommendations for your finances"/>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {insights.map(ins=><div key={ins.id} onClick={()=>setActiveInsight(ins.id===activeInsight?null:ins.id)}
          style={{ padding:"14px 16px", borderRadius:14, cursor:"pointer",
            background:activeInsight===ins.id?ins.color+"0F":T.cardAlt,
            border:`1.5px solid ${activeInsight===ins.id?ins.color:T.border}`,
            transition:"all 0.2s" }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:38, height:38, borderRadius:11, background:ins.color+"18",
              border:`1px solid ${ins.color}30`, display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0 }}>
              <Icon name={ins.icon} size={18} color={ins.color}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:3 }}>{ins.title}</div>
              <div style={{ fontSize:12, color:T.textMute, lineHeight:1.5, marginBottom:activeInsight===ins.id?10:0 }}>
                {ins.desc}
              </div>
              {activeInsight===ins.id&&<Btn size="sm" variant="gold" onClick={e=>{ e.stopPropagation(); toast("Action Taken",`${ins.action} initiated.`,ins.color); }}>{ins.action}</Btn>}
            </div>
            <Icon name="chevronRight" size={16} color={T.textMute}
              style={{ transform:activeInsight===ins.id?"rotate(90deg)":"none", transition:"transform 0.2s" }}/>
          </div>
        </div>)}
      </div>
    </Card>

    {/* Chat */}
    <Card>
      <SHead title="Chat with Panda AI" sub="Ask anything about your finances"/>

      {/* Messages */}
      <div style={{ maxHeight:340, overflowY:"auto", marginBottom:14, padding:"4px 0" }}>
        {messages.map((m,i)=><div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start",
          marginBottom:12 }}>
          {m.role==="ai"&&<div style={{ width:32, height:32, borderRadius:10, background:T.navy,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, marginRight:10, marginTop:2 }}>
            <Icon name="bot" size={16} color="#fff"/>
          </div>}
          <div style={{ maxWidth:"78%", padding:"12px 16px",
            borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
            background:m.role==="user"?`linear-gradient(135deg,${T.navy},${T.navyMid})`:T.cardAlt,
            color:m.role==="user"?"#fff":T.text,
            fontSize:13, lineHeight:1.6, fontWeight:500,
            boxShadow:T.shadow }}>
            {m.text}
          </div>
        </div>)}
        {loading&&<div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:T.navy,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="bot" size={16} color="#fff"/>
          </div>
          <div style={{ padding:"12px 16px", borderRadius:"16px 16px 16px 4px",
            background:T.cardAlt, display:"flex", gap:6, alignItems:"center" }}>
            {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%",
              background:T.textMute, animation:`pulse 1s ${i*0.2}s infinite`,
              animationTimingFunction:"ease-in-out" }}/>)}
          </div>
        </div>}
        <div ref={bottomRef}/>
      </div>

      {/* Quick prompts */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {quickPrompts.map(p=><button key={p} onClick={()=>{ setInput(p); }}
          style={{ padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit", background:T.navyLight,
            border:`1px solid ${T.navy}22`, color:T.navy, transition:"all 0.18s" }}>
          {p}
        </button>)}
      </div>

      {/* Input */}
      <div style={{ display:"flex", gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!loading&&send()}
          placeholder="Ask about your spending, savings, investments..."
          style={{ flex:1, background:T.cardAlt, border:`1.5px solid ${T.border}`,
            borderRadius:12, padding:"12px 16px", color:T.text, fontSize:13,
            fontFamily:"inherit", outline:"none", transition:"border-color 0.2s" }}
          onFocus={e=>e.target.style.borderColor=T.navy}
          onBlur={e=>e.target.style.borderColor=T.border}/>
        <Btn variant="gold" icon="send" loading={loading} onClick={send}>Send</Btn>
      </div>
    </Card>
    <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH 5E — FAMILY WALLET
// ═══════════════════════════════════════════════════════════════════════════════
function FamilyWallet({ toast }) {
  const [members, setMembers] = useState([
    { id:1, name:"BAK (Father)",   username:"@bak",    role:"Admin",  balance:2450000, limit:null,   avatar:"B", color:T.navy,   spent:320000, txCount:12, active:true  },
    { id:2, name:"Mama BAK",       username:"@mama",   role:"Member", balance:850000,  limit:500000, avatar:"M", color:T.purple, spent:280000, txCount:8,  active:true  },
    { id:3, name:"BAK Jr.",        username:"@bak_jr", role:"Child",  balance:120000,  limit:100000, avatar:"J", color:T.gold,   spent:45000,  txCount:5,  active:true  },
    { id:4, name:"Grandma Rose",   username:"@rose",   role:"Member", balance:320000,  limit:300000, avatar:"R", color:T.green,  spent:95000,  txCount:3,  active:true  },
  ]);

  const [modal, setModal]         = useState(null);
  const [selMember, setSelMember] = useState(null);
  const [sendAmt, setSendAmt]     = useState("");
  const [sendNote, setSendNote]   = useState("");
  const [newLimit, setNewLimit]   = useState("");
  const [done, setDone]           = useState(false);
  const [addModal, setAddModal]   = useState(false);
  const [newName, setNewName]     = useState("");
  const [newUser, setNewUser]     = useState("");
  const [newRole, setNewRole]     = useState("Member");

  const totalFamily = members.reduce((s,m)=>s+m.balance,0);
  const totalSpent  = members.reduce((s,m)=>s+m.spent,0);

  const sendFunds = () => {
    const a = parseInt(sendAmt.replace(/,/g,""))||0;
    if(!a||!selMember) return;
    setMembers(m=>m.map(x=>x.id===selMember.id?{...x,balance:x.balance+a}:x));
    toast("Funds Sent",`${fmt(a)} sent to ${selMember.name}`,T.green);
    setDone(true);
  };

  const updateLimit = () => {
    const l = parseInt(newLimit.replace(/,/g,""))||0;
    if(!l||!selMember) return;
    setMembers(m=>m.map(x=>x.id===selMember.id?{...x,limit:l}:x));
    toast("Limit Updated",`Spending limit for ${selMember.name} updated to ${fmt(l)}`,T.gold);
    setModal(null);
  };

  const addMember = () => {
    if(!newName||!newUser) return;
    setMembers(m=>[...m,{
      id:Date.now(), name:newName, username:newUser, role:newRole,
      balance:0, limit:newRole==="Child"?100000:500000,
      avatar:newName[0].toUpperCase(), color:T.teal,
      spent:0, txCount:0, active:true
    }]);
    toast("Member Added",`${newName} added to your family wallet.`,T.green);
    setAddModal(false);
    setNewName(""); setNewUser(""); setNewRole("Member");
  };

  const roleColor = { Admin:T.navy, Member:T.blue, Child:T.gold };

  const recentActivity = [
    { member:"Mama BAK",    action:"Paid electricity bill",     amt:65000, time:"Today, 08:30"    },
    { member:"BAK Jr.",     action:"School canteen purchase",    amt:5000,  time:"Today, 07:15"    },
    { member:"BAK (Father)","action":"Sent to @amina",          amt:50000, time:"Yesterday, 19:00" },
    { member:"Grandma Rose","action":"Received pension deposit", amt:95000, time:"Yesterday, 10:00" },
  ];

  return <div>
    {/* Family wallet overview */}
    <div style={{ background:`linear-gradient(145deg,#0B1F4B,#1A3A6E)`,
      borderRadius:24, padding:"26px 24px", marginBottom:18,
      boxShadow:"0 20px 56px rgba(11,31,75,0.3), 0 0 0 1px rgba(201,150,10,0.18)",
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(201,150,10,0.15),transparent 70%)" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(201,150,10,0.5),transparent)" }}/>
      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:2,
        textTransform:"uppercase", marginBottom:6 }}>BAK Family Wallet</div>
      <div style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1,
        fontFamily:"monospace", marginBottom:4 }}>{fmt(totalFamily)}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>
        Combined family balance · {members.length} members
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:20 }}>
        {members.map(m=><div key={m.id} style={{ width:36, height:36, borderRadius:"50%",
          background:m.color+"33", border:`2px solid ${m.color}77`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:900, color:"#fff" }}>{m.avatar}</div>)}
        <button onClick={()=>setAddModal(true)} style={{ width:36, height:36, borderRadius:"50%",
          background:"rgba(255,255,255,0.1)", border:"1.5px dashed rgba(255,255,255,0.35)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          color:"rgba(255,255,255,0.7)" }}>
          <Icon name="plus" size={16} color="rgba(255,255,255,0.7)"/>
        </button>
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 14px",
          border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
            letterSpacing:1.5, marginBottom:4 }}>Total Spent</div>
          <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.8)",
            fontFamily:"monospace" }}>{fmt(totalSpent)}</div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 14px",
          border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase",
            letterSpacing:1.5, marginBottom:4 }}>Family ID</div>
          <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.8)",
            fontFamily:"monospace" }}>FAM-00291</div>
        </div>
      </div>
    </div>

    {/* Members */}
    <Card style={{ marginBottom:14 }}>
      <SHead title="Family Members" sub="Manage balances and spending limits"
        action="+ Add Member" onAction={()=>setAddModal(true)}/>
      {members.map((m,i)=><div key={m.id} style={{ padding:"16px 0",
        borderBottom:i<members.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
          {/* Avatar */}
          <div style={{ width:46, height:46, borderRadius:"50%", background:m.color+"22",
            border:`2px solid ${m.color}44`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:16, fontWeight:900, color:m.color, flexShrink:0 }}>
            {m.avatar}
          </div>
          {/* Info */}
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{m.name}</div>
              <Badge color={roleColor[m.role]}>{m.role}</Badge>
            </div>
            <div style={{ fontSize:11, color:T.textMute, marginBottom:6 }}>{m.username} · {m.txCount} transactions this month</div>
            {/* Spending limit bar */}
            {m.limit&&<div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10,
                color:T.textMute, marginBottom:4 }}>
                <span>Spent: {fmt(m.spent)}</span>
                <span>Limit: {fmt(m.limit)}</span>
              </div>
              <div style={{ background:T.border, borderRadius:99, height:5, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min((m.spent/m.limit)*100,100)}%`,
                  background:m.spent/m.limit>0.8?T.red:T.green,
                  borderRadius:99, transition:"width 0.6s ease" }}/>
              </div>
            </div>}
          </div>
          {/* Balance + actions */}
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16, fontWeight:900, color:T.text,
              fontFamily:"monospace", marginBottom:8 }}>{fmt(m.balance)}</div>
            <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
              <Btn size="sm" variant="gold" icon="send"
                onClick={()=>{ setSelMember(m); setModal("send"); setDone(false); setSendAmt(""); setSendNote(""); }}>
                Send
              </Btn>
              {m.role!=="Admin"&&<Btn size="sm" variant="outline" icon="settings"
                onClick={()=>{ setSelMember(m); setModal("limit"); setNewLimit(m.limit?String(m.limit):""); }}>
                Limit
              </Btn>}
            </div>
          </div>
        </div>
      </div>)}
    </Card>

    {/* Recent family activity */}
    <Card>
      <SHead title="Recent Family Activity"/>
      {recentActivity.map((a,i)=><div key={i} style={{ display:"flex", gap:14, alignItems:"center",
        padding:"11px 0", borderBottom:i<recentActivity.length-1?`1px solid ${T.border}`:"none" }}>
        <div style={{ width:38, height:38, borderRadius:11, background:T.navyLight,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          fontSize:13, fontWeight:800, color:T.navy }}>
          {a.member[0]}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>{a.member}</div>
          <div style={{ fontSize:11, color:T.textMute }}>{a.action} · {a.time}</div>
        </div>
        <div style={{ fontSize:13, fontWeight:900, color:T.text, fontFamily:"monospace" }}>
          {fmt(a.amt)}
        </div>
      </div>)}
    </Card>

    {/* Send funds modal */}
    {modal==="send"&&<Modal title={`Send to ${selMember?.name}`} subtitle="Funds sent from your personal balance"
      onClose={()=>setModal(null)}>
      {!done?<>
        <div style={{ background:T.navyLight, borderRadius:12, padding:"12px 16px", marginBottom:16,
          display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, color:T.textMute }}>Recipient balance</span>
          <span style={{ fontSize:13, color:T.navy, fontWeight:900, fontFamily:"monospace" }}>
            {fmt(selMember?.balance||0)}
          </span>
        </div>
        <Label required>Amount</Label>
        <Field value={sendAmt} onChange={setSendAmt} placeholder="e.g. 50,000" prefix="TSh"/>
        <Label>Note</Label>
        <Field value={sendNote} onChange={setSendNote} placeholder="e.g. Weekly allowance"/>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn full variant="gold" icon="send" onClick={sendFunds}>Send Funds</Btn>
        </div>
      </>:<div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:T.greenBg,
          border:`2px solid ${T.green}44`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="check" size={28} color={T.green}/>
        </div>
        <div style={{ fontSize:18, fontWeight:900, color:T.text, marginBottom:6 }}>Funds Sent!</div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          {fmt(parseInt(sendAmt.replace(/,/g,"")||0))} sent to {selMember?.name}
        </div>
        <Btn variant="gold" onClick={()=>{ setModal(null); setDone(false); }}>Done</Btn>
      </div>}
    </Modal>}

    {/* Limit modal */}
    {modal==="limit"&&<Modal title={`Spending Limit — ${selMember?.name}`}
      subtitle="Set the maximum monthly spending for this member"
      onClose={()=>setModal(null)}>
      <div style={{ background:T.navyLight, borderRadius:12, padding:"12px 16px", marginBottom:16,
        display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, color:T.textMute }}>Current limit</span>
        <span style={{ fontSize:13, color:T.navy, fontWeight:900, fontFamily:"monospace" }}>
          {selMember?.limit?fmt(selMember.limit):"No limit"}
        </span>
      </div>
      <Label required>New Monthly Limit</Label>
      <Field value={newLimit} onChange={setNewLimit} placeholder="e.g. 200,000" prefix="TSh"/>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, color:T.textMute, marginBottom:8 }}>Quick set</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["50,000","100,000","200,000","500,000"].map(v=><button key={v}
            onClick={()=>setNewLimit(v)} style={{ padding:"6px 14px", borderRadius:99,
              fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              background:newLimit===v?T.navy:T.cardAlt,
              border:`1px solid ${newLimit===v?T.navy:T.border}`,
              color:newLimit===v?"#fff":T.textMid }}>
            TSh {v}
          </button>)}
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
        <Btn full variant="gold" icon="check" onClick={updateLimit}>Update Limit</Btn>
      </div>
    </Modal>}

    {/* Add member modal */}
    {addModal&&<Modal title="Add Family Member" subtitle="Invite someone to your family wallet"
      onClose={()=>setAddModal(false)}>
      <Label required>Full Name</Label>
      <Field value={newName} onChange={setNewName} placeholder="e.g. Mama BAK"/>
      <Label required>Panda Username</Label>
      <Field value={newUser} onChange={setNewUser} placeholder="e.g. @mama"/>
      <Label required>Role</Label>
      <Select value={newRole} onChange={setNewRole} options={[
        { value:"Member", label:"Member — Full access with optional limit" },
        { value:"Child",  label:"Child — Restricted access with spending limit" },
      ]}/>
      <div style={{ background:T.amberBg, border:`1px solid ${T.amber}33`, borderRadius:12,
        padding:"12px 16px", marginBottom:16, fontSize:12, color:T.amber, fontWeight:600 }}>
        The person must have an active Panda Finance account to be added to your family wallet.
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn variant="ghost" onClick={()=>setAddModal(false)}>Cancel</Btn>
        <Btn full variant="gold" icon="users" onClick={addMember}>Add Member</Btn>
      </div>
    </Modal>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("currency");
  const [toasts, setToasts] = useState([]);

  const toast = (title, msg, color=T.gold) => {
    const id = Date.now();
    setToasts(t=>[...t,{id,title,msg,color}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3800);
  };

  const SCREENS = [
    { id:"currency",   label:"Multi-Currency", icon:"globe"      },
    { id:"card",       label:"Virtual Card",   icon:"creditCard" },
    { id:"invest",     label:"Investments",    icon:"trendingUp" },
    { id:"ai",         label:"AI Assistant",   icon:"bot"        },
    { id:"family",     label:"Family Wallet",  icon:"users"      },
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
      button:hover{opacity:0.88;}
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
            {SCREENS.find(s=>s.id===screen)?.label}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Badge color={T.gold}>Batch 5</Badge>
          <div style={{ width:40, height:40, borderRadius:12,
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:15, color:"#fff",
            boxShadow:`0 4px 14px ${T.navy}44` }}>B</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`,
      padding:"10px 20px", overflowX:"auto" }}>
      <div style={{ maxWidth:640, margin:"0 auto", display:"flex", gap:6 }}>
        {SCREENS.map(s=><button key={s.id} onClick={()=>setScreen(s.id)}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 16px",
            borderRadius:12, border:"none", cursor:"pointer", fontFamily:"inherit",
            fontWeight:screen===s.id?800:500, fontSize:12, transition:"all 0.18s",
            background:screen===s.id?T.navy:"transparent",
            color:screen===s.id?"#fff":T.textMute, whiteSpace:"nowrap",
            boxShadow:screen===s.id?`0 4px 14px ${T.navy}33`:"none" }}>
          <Icon name={s.icon} size={14} color={screen===s.id?"#fff":T.textMute}/>
          {s.label}
        </button>)}
      </div>
    </div>

    <div style={{ padding:"24px 16px 60px", maxWidth:640, margin:"0 auto" }}>
      {screen==="currency" && <MultiCurrencyWallet toast={toast}/>}
      {screen==="card"     && <VirtualCard         toast={toast}/>}
      {screen==="invest"   && <InvestmentWallet    toast={toast}/>}
      {screen==="ai"       && <AIAssistant         toast={toast}/>}
      {screen==="family"   && <FamilyWallet        toast={toast}/>}
    </div>
  </div>;
}
