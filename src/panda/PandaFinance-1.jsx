import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════ THEME ═══════════════════════════════
const DARK={bg:"#04080F",surface:"#080F1C",card:"#0C1728",cardHover:"#0F1E33",
  accent:"#00D4AA",accentDark:"#009E78",accentLight:"#33FFCC",
  gold:"#FFD700",goldDark:"#CC9900",silver:"#C0C8D8",
  text:"#EDF5FF",muted:"#4D6480",faint:"#243550",
  danger:"#FF3860",warn:"#FF9500",success:"#00D4AA",
  purple:"#A78BFA",pink:"#F472B6",blue:"#38BDF8",green:"#34D399",orange:"#FB923C",
  border:"#0E1E30",glass:"rgba(8,15,28,0.85)",
};
const LIGHT={bg:"#F0F4FF",surface:"#FFFFFF",card:"#FFFFFF",cardHover:"#F8FAFF",
  accent:"#00977A",accentDark:"#006E5A",accentLight:"#00C4A0",
  gold:"#D97706",goldDark:"#B45309",silver:"#64748B",
  text:"#0A1628",muted:"#64748B",faint:"#EEF2F8",
  danger:"#DC2626",warn:"#D97706",success:"#00977A",
  purple:"#7C3AED",pink:"#DB2777",blue:"#2563EB",green:"#059669",orange:"#EA580C",
  border:"#E2E8F0",glass:"rgba(255,255,255,0.9)",
};

// ══════════════════════════════════════ CSS ══════════════════════════════════
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-thumb{background:rgba(0,212,170,0.3);border-radius:99px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes zoomIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes floatSm{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 24px rgba(0,212,170,0.25),0 0 48px rgba(0,212,170,0.1)}50%{box-shadow:0 0 60px rgba(0,212,170,0.6),0 0 120px rgba(0,212,170,0.2)}}
@keyframes goldGlow{0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.2)}50%{box-shadow:0 0 50px rgba(255,215,0,0.55)}}
@keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
@keyframes rain{0%{transform:translateY(-40px) rotate(0deg);opacity:0}8%{opacity:0.07}92%{opacity:0.07}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(80px,-60px) scale(1.15)}70%{transform:translate(-60px,40px) scale(0.9)}}
@keyframes orb2{0%,100%{transform:translate(0,0)}35%{transform:translate(-70px,80px) scale(1.1)}65%{transform:translate(50px,-50px) scale(0.92)}}
@keyframes orb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,60px) scale(1.08)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastIn{from{opacity:0;transform:translateX(140px) scale(0.85)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes toastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(140px)}}
@keyframes badgePop{0%{transform:scale(0)}65%{transform:scale(1.45)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:rotate(0)}18%{transform:rotate(-18deg)}36%{transform:rotate(18deg)}54%{transform:rotate(-11deg)}72%{transform:rotate(11deg)}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes countUp{from{opacity:0;transform:scale(0.6) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes borderPulse{0%,100%{border-color:rgba(0,212,170,0.3)}50%{border-color:rgba(0,212,170,0.85)}}
@keyframes chartBar{from{height:0}to{height:var(--h)}}
@keyframes scanLine{0%{top:-2px}100%{top:100%}}
@keyframes dash{to{stroke-dashoffset:0}}
.fade-up{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards;}
.zoom-in{animation:zoomIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards;}
.ch:hover{transform:translateY(-4px)!important;transition:all 0.25s cubic-bezier(0.22,1,0.36,1)!important;}
.bp:hover{filter:brightness(1.12);transform:translateY(-1px);}
.bp:active{transform:scale(0.95);}
.ni:hover{background:rgba(0,212,170,0.1)!important;transform:translateX(5px);transition:all 0.2s;}
.mc:hover{border-color:#00D4AA!important;transform:translateY(-6px)!important;box-shadow:0 20px 50px rgba(0,212,170,0.18)!important;}
.bb{animation:badgePop 0.45s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}
.rg{animation:shake 0.65s ease;}
.sp{animation:spin 0.9s linear infinite;}
.sh{background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);background-size:600px 100%;animation:shimmer 1.6s infinite;}
@media(max-width:900px){
  .dsk{display:none!important;}.mw{margin-left:0!important;}
  .g4{grid-template-columns:repeat(2,1fr)!important;}
  .g3{grid-template-columns:repeat(1,1fr)!important;}
  .g2{grid-template-columns:repeat(1,1fr)!important;}
}`;

// ════════════════════════════════════════ NAV ════════════════════════════════
const NAV=[
  {s:"Main",items:[{id:"dashboard",ic:"🏠",l:"Dashboard"},{id:"wallet",ic:"💳",l:"Digital Wallet"},{id:"savings",ic:"🐼",l:"Smart Savings"},{id:"credit",ic:"📊",l:"Credit Score"}]},
  {s:"Business",items:[{id:"bizai",ic:"🧠",l:"AI Business Hub"},{id:"books",ic:"📒",l:"AI Bookkeeping"},{id:"inventory",ic:"📦",l:"AI Inventory"},{id:"cashflow",ic:"💹",l:"Cash Flow"},{id:"analytics",ic:"📈",l:"Analytics"}]},
  {s:"Finance",items:[{id:"loans",ic:"🏦",l:"Microloan Market"},{id:"invest",ic:"🌱",l:"Investment Hub"},{id:"insurance",ic:"🛡️",l:"Insurance"},{id:"tax",ic:"🧾",l:"Tax Assistant"},{id:"currency",ic:"💱",l:"Currency Exchange"}]},
  {s:"Marketplace",items:[{id:"market",ic:"🛒",l:"Live Marketplace"},{id:"farmer",ic:"🌾",l:"Farmer Hub"},{id:"vikoba",ic:"👥",l:"Vikoba"},{id:"edu",ic:"🎓",l:"Financial Education"},{id:"support",ic:"🆘",l:"Help Center"}]},
  {s:"Platform",items:[{id:"assistant",ic:"🤖",l:"AI Assistant"},{id:"notifs",ic:"🔔",l:"Notifications"},{id:"revenue",ic:"💰",l:"Revenue & Fees"},{id:"profile",ic:"👤",l:"My Profile"},{id:"admin",ic:"⚙️",l:"Admin Panel"}]},
];

// ══════════════════════════════════ CONSTANTS ════════════════════════════════
const fmt=n=>"TSh "+Number(n).toLocaleString();
const fmtC=(n,c="TSh")=>c==="TSh"?fmt(n):`${c} ${parseFloat(n).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const NOTIF_C={alert:"#FF3860",money:"#00D4AA",credit:"#A78BFA",loan:"#FFD700",invest:"#34D399",security:"#FB923C",saving:"#00D4AA",market:"#F472B6",ai:"#38BDF8",tax:"#FBBF24",inventory:"#FF3860",community:"#A78BFA",education:"#34D399"};
const INIT_N=[
  {id:1,type:"alert",icon:"⚠️",title:"Low Stock Alert",body:"Cooking Oil 1L has only 12 units. AI recommends ordering 200 units.",time:"2 min ago",read:false,cat:"inventory"},
  {id:2,type:"money",icon:"💰",title:"M-Pesa Deposit",body:"TSh 250,000 received from +255 712 *** 456.",time:"9 min ago",read:false,cat:"wallet"},
  {id:3,type:"credit",icon:"⭐",title:"Credit Score +15",body:"Your score rose to 742. Keep saving consistently!",time:"1 hr ago",read:false,cat:"credit"},
  {id:4,type:"loan",icon:"🏦",title:"Loan Offer: 7% p.a.",body:"Panda Micro offers TSh 500K at 7%. Expires in 48 hrs.",time:"2 hrs ago",read:false,cat:"loan"},
  {id:5,type:"invest",icon:"🌱",title:"Investment +18%",body:"Kilimo Fresh Farm performing at +18% p.a. Portfolio up.",time:"3 hrs ago",read:true,cat:"invest"},
  {id:6,type:"security",icon:"🔐",title:"New Login Detected",body:"Login from Dar es Salaam on Chrome. Change PIN if not you.",time:"5 hrs ago",read:true,cat:"security"},
  {id:7,type:"saving",icon:"🐼",title:"Auto-Save Done",body:"TSh 25,000 saved to House Goal. Balance: TSh 31.025M.",time:"6 hrs ago",read:true,cat:"saving"},
  {id:8,type:"market",icon:"🛒",title:"Order Received!",body:"Honey 500g sold for TSh 18,000 on Live Marketplace.",time:"Yesterday",read:true,cat:"market"},
  {id:9,type:"ai",icon:"🤖",title:"AI Business Tip",body:"Friday revenue 34% higher. Run promos mid-week to boost slow days.",time:"Yesterday",read:true,cat:"ai"},
  {id:10,type:"tax",icon:"🧾",title:"VAT Due in 14 Days",body:"June 20 deadline. Est. TSh 2.1M VAT. File via TRA portal.",time:"2 days ago",read:true,cat:"tax"},
];
const LIVE_TOASTS=[
  {type:"money",icon:"💰",title:"Payment Received",body:"TSh 85,000 received from Juma Ali via M-Pesa."},
  {type:"alert",icon:"⚠️",title:"Rice 5kg — Low Stock",body:"8 units left. AI recommends ordering 150 units today."},
  {type:"ai",icon:"🤖",title:"AI Business Insight",body:"Your Friday revenue is 34% above average. Boost mid-week!"},
  {type:"invest",icon:"🌱",title:"Investment Alert",body:"Coastal Fisheries now 88% funded. Last chance to join!"},
  {type:"security",icon:"🔐",title:"Security Check Passed",body:"Account security strong. PIN last changed 30 days ago."},
];

// ══════════════════════════════════ COMPONENTS ══════════════════════════════
function Card({C,ch,ac,gold,gl,st={},onClick}){
  return <div className={`${ch?"ch":""}`} onClick={onClick} style={{background:gold?`linear-gradient(135deg,${C.gold}1A,${C.goldDark}0A)`:ac?`linear-gradient(135deg,${C.accent}1A,${C.accent}06)`:gl?C.glass:C.card,border:`1px solid ${gold?C.gold+"44":ac?C.accent+"44":C.border}`,borderRadius:18,padding:22,transition:"all 0.25s",cursor:onClick?"pointer":"default",backdropFilter:gl?"blur(14px)":"none",...st}}/>
}
function Btn({C,ch,on,v="p",fu,sm,xs,ld,ic,st={}}){
  const V={p:{background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,color:"#fff",border:"none",boxShadow:`0 4px 20px ${C.accent}44`},g:{background:"transparent",color:C.muted,border:`1px solid ${C.border}`},gold:{background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,color:"#fff",border:"none",boxShadow:`0 4px 20px ${C.gold}44`},d:{background:`${C.danger}18`,color:C.danger,border:`1px solid ${C.danger}44`},pu:{background:`linear-gradient(135deg,${C.purple},#6D28D9)`,color:"#fff",border:"none",boxShadow:`0 4px 20px ${C.purple}44`},wa:{background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",border:"none",boxShadow:"0 4px 18px rgba(37,211,102,0.45)"},dk:{background:C.surface,color:C.text,border:`1px solid ${C.border}`}};
  return <button className="bp" onClick={on} disabled={ld} style={{...V[v],padding:xs?"5px 10px":sm?"8px 16px":"11px 22px",borderRadius:10,cursor:ld?"wait":"pointer",fontWeight:700,fontSize:xs?10:sm?12:13,fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s",width:fu?"100%":undefined,display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center",opacity:ld?0.7:1,...st}}>{ld?<span className="sp" style={{fontSize:12}}>⟳</span>:ic&&<span>{ic}</span>}{ch}</button>;
}
function Tag({C,ch,cl,sm}){const c=cl||C.accent;return <span style={{background:`${c}18`,border:`1px solid ${c}44`,color:c,borderRadius:8,padding:sm?"2px 8px":"3px 11px",fontSize:sm?10:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>{ch}</span>;}
function Prg({C,pct,cl,h=7}){return <div style={{background:C.border,borderRadius:99,height:h,overflow:"hidden",marginTop:6}}><div style={{width:`${Math.min(Math.max(pct,0),100)}%`,height:"100%",background:`linear-gradient(90deg,${cl||C.accent},${cl||C.accent}BB)`,borderRadius:99,transition:"width 1.4s cubic-bezier(0.22,1,0.36,1)"}}/></div>;}
function Lbl({C,ch,req}){return <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:1.1,textTransform:"uppercase",marginBottom:7}}>{ch}{req&&<span style={{color:C.danger}}> *</span>}</div>;}
function FInp({C,val,on,ph,tp="text",ic,dis,ml,rows=3}){
  const base={width:"100%",padding:`11px 14px 11px ${ic?"40px":"14px"}`,borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",resize:ml?"vertical":"none",opacity:dis?0.6:1,transition:"border-color 0.2s"};
  return <div style={{position:"relative",marginBottom:14}}>{ic&&<span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none",zIndex:1}}>{ic}</span>}{ml?<textarea value={val} onChange={e=>on(e.target.value)} placeholder={ph} rows={rows} disabled={dis} style={{...base,marginBottom:0}}/>:<input type={tp} value={val} onChange={e=>on(e.target.value)} placeholder={ph} disabled={dis} style={base}/>}</div>;
}
function PHdr({C,tl,sub,act}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:12}}><div style={{animation:"fadeUp 0.4s ease"}}><div style={{fontSize:22,fontWeight:900,color:C.text,letterSpacing:-0.5,fontFamily:"Syne,sans-serif"}}>{tl}</div>{sub&&<div style={{fontSize:13,color:C.muted,marginTop:4}}>{sub}</div>}</div>{act&&<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{act}</div>}</div>;}
function SC({C,lb,val,ic,cl,sub,d=0,bg}){return <div className="ch" style={{background:bg||C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"20px 22px",animation:`fadeUp 0.5s ease ${d}s both`,transition:"all 0.25s"}}><div style={{fontSize:24,marginBottom:10}}>{ic}</div><div style={{fontSize:25,fontWeight:900,color:cl||C.accent,letterSpacing:-1,animation:"countUp 0.5s ease",fontFamily:"Syne,sans-serif"}}>{val}</div><div style={{fontSize:11,color:C.muted,marginTop:4,textTransform:"uppercase",letterSpacing:1}}>{lb}</div>{sub&&<div style={{fontSize:11,color:cl||C.accent,marginTop:6,fontWeight:600}}>{sub}</div>}</div>;}
function Modal({C,tl,onCl,ch,w=420}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onCl();}}><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:32,width:"100%",maxWidth:w,maxHeight:"90vh",overflowY:"auto",animation:"zoomIn 0.35s cubic-bezier(0.22,1,0.36,1)",boxShadow:`0 50px 100px rgba(0,0,0,0.65),0 0 0 1px ${C.accent}22`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}><div style={{fontSize:18,fontWeight:800,color:C.text,fontFamily:"Syne,sans-serif"}}>{tl}</div><button onClick={onCl} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button></div>{ch}</div></div>;}
function PinPad({C,val,on,lb}){
  const refs=[useRef(),useRef(),useRef(),useRef()];
  const hc=(i,v)=>{if(!/^\d*$/.test(v))return;const nd=[...val];nd[i]=v.slice(-1);on(nd);if(v&&i<3)refs[i+1].current?.focus();};
  const hk=(i,e)=>{if(e.key==="Backspace"&&!val[i]&&i>0){const nd=[...val];nd[i-1]="";on(nd);refs[i-1].current?.focus();}};
  return <div style={{marginBottom:18}}>{lb&&<Lbl C={C}>{lb}</Lbl>}<div style={{display:"flex",gap:12,justifyContent:"center"}}>{[0,1,2,3].map(i=><input key={i} ref={refs[i]} type="password" maxLength={1} value={val[i]} inputMode="numeric" onChange={e=>hc(i,e.target.value)} onKeyDown={e=>hk(i,e)} style={{width:58,height:58,textAlign:"center",fontSize:26,fontWeight:900,borderRadius:14,border:`2px solid ${val[i]?C.accent:C.border}`,background:C.surface,color:C.text,fontFamily:"JetBrains Mono,monospace",outline:"none",transition:"all 0.2s",boxShadow:val[i]?`0 0 0 3px ${C.accent}22`:"none"}}/>)}</div></div>;
}

// ════════════════════════════════ FINANCIAL BG ═══════════════════════════════
function FinBg({C}){
  const syms=["₿","💹","📈","🐼","💰","📊","🌍","💎","🏦","⚡","🌱","💳","🇹🇿","📱","🔐","⭐","🌾","💼"];
  const items=useRef(Array.from({length:22},(_,i)=>({s:syms[i%syms.length],x:Math.random()*100,dl:Math.random()*14,dr:7+Math.random()*11,sz:9+Math.random()*14}))).current;
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    <div style={{position:"absolute",top:"-20%",right:"-8%",width:650,height:650,borderRadius:"50%",background:`radial-gradient(circle,${C.accent}14,transparent 68%)`,animation:"orb1 16s ease-in-out infinite"}}/>
    <div style={{position:"absolute",bottom:"-18%",left:"-10%",width:550,height:550,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}0C,transparent 68%)`,animation:"orb2 20s ease-in-out infinite"}}/>
    <div style={{position:"absolute",top:"38%",left:"38%",width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle,${C.purple}08,transparent 68%)`,animation:"orb3 13s ease-in-out infinite"}}/>
    {items.map((it,i)=><div key={i} style={{position:"absolute",left:`${it.x}%`,bottom:"-5%",fontSize:it.sz,opacity:0.055,animation:`rain ${it.dr}s linear ${it.dl}s infinite`,filter:"blur(0.2px)"}}>{it.s}</div>)}
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.02}} xmlns="http://www.w3.org/2000/svg"><defs><pattern id="pg" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M 56 0 L 0 0 0 56" fill="none" stroke={C.accent} strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#pg)"/></svg>
  </div>;
}

// ════════════════════════════════════ TICKER ══════════════════════════════════
function Ticker({C}){
  const items=["📈 TSh/KES: 28.4 (+2.3%)","💹 TSh/USD: 2,650","💱 TSh/EUR: 2,890","💷 TSh/GBP: 3,380","🏦 NMB Savings: 8.5%","🌽 Maize +4.1%","🐼 Users: 284,712","⚡ TSh 42B Loans Live","📊 Scores Updated Daily","🇹🇿 Tanzania's #1 Finance App","🔐 Bank-Grade Security Active","🤖 AI Inventory v3.0 Live","💰 Revenue: TSh 140M/month"];
  return <div style={{background:`${C.accent}0E`,borderBottom:`1px solid ${C.border}`,overflow:"hidden",height:28,display:"flex",alignItems:"center",flexShrink:0}}><div style={{display:"inline-flex",animation:"ticker 55s linear infinite",whiteSpace:"nowrap",fontSize:11,color:C.accent,fontWeight:600}}>{[...items,...items,...items].map((t,i)=><span key={i} style={{padding:"0 44px"}}>{t}</span>)}</div></div>;
}

// ════════════════════════════════════ SPLASH ════════════════════════════════
function Splash({C,onDone}){
  const [pct,setPct]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setPct(p=>{if(p>=100){clearInterval(t);setTimeout(onDone,500);return 100;}return p+1.2;}),25);return()=>clearInterval(t);},[]);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Plus Jakarta Sans,sans-serif"}}>
    <FinBg C={C}/>
    <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 24px"}}>
      <div style={{fontSize:108,marginBottom:28,animation:"float 3s ease-in-out infinite",filter:`drop-shadow(0 0 50px ${C.accent}) drop-shadow(0 0 100px ${C.accent}44)`,display:"inline-block"}}>🐼</div>
      <div style={{fontSize:42,fontWeight:900,background:`linear-gradient(135deg,${C.accent},${C.gold},${C.accent})`,backgroundSize:"200% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-2,marginBottom:10,fontFamily:"Syne,sans-serif",animation:"shimmer 3s linear infinite"}}>PANDA FINANCE</div>
      <div style={{fontSize:13,color:C.muted,letterSpacing:3,textTransform:"uppercase",marginBottom:54}}>Tanzania's AI Financial Operating System</div>
      <div style={{width:300,height:3,background:C.border,borderRadius:99,overflow:"hidden",margin:"0 auto 16px"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.accent},${C.gold},${C.accent})`,backgroundSize:"200%",borderRadius:99,transition:"width 0.06s linear",animation:"shimmer 2s linear infinite"}}/></div>
      <div style={{fontSize:12,color:C.muted}}>🔐 Initializing secure environment... {Math.round(pct)}%</div>
      <div style={{marginTop:36,display:"flex",gap:28,justifyContent:"center"}}>{["🔐 256-bit AES","🛡️ Bank-Grade","🌍 East Africa","🤖 AI-Powered"].map((t,i)=><div key={t} style={{fontSize:11,color:C.muted,opacity:pct>20?1:0.2,transition:"opacity 0.6s",transitionDelay:`${i*0.15}s`}}>{t}</div>)}</div>
    </div>
  </div>;
}

// ════════════════════════════════ ONBOARDING ════════════════════════════════
function Onboarding({C,onDone}){
  const [step,setStep]=useState(0);
  const steps=[
    {icon:"🐼",tl:"Welcome to Panda Finance",sub:"Tanzania's #1 AI Financial Platform",desc:"Built by BAK for every Tanzanian — farmers, traders, youth, investors. One complete platform for all your financial needs.",ac:C.accent},
    {icon:"🔐",tl:"Bank-Grade Security",sub:"256-bit AES Encryption · KYC Verified",desc:"Biometric login support, real-time fraud detection, PIN authentication, and KYC verification protect every account 24/7.",ac:C.purple},
    {icon:"🤖",tl:"AI That Works for You",sub:"Smart · Fast · Kiswahili & English",desc:"AI credit scoring, inventory predictions, business coaching, investment matching, and financial advice built for Tanzania's economy.",ac:C.gold},
    {icon:"💳",tl:"All Money In One Wallet",sub:"M-Pesa · Airtel · NMB · CRDB · HaloPesa",desc:"Connect mobile money and bank accounts. Send, receive, save, invest, pay bills — everything in one secure digital wallet.",ac:C.pink},
    {icon:"🌍",tl:"Tanzania's Financial OS",sub:"From Dar es Salaam to East Africa",desc:"Starting with Tanzania's 60M+ people, expanding across East Africa. Real financial inclusion for farmers, traders, and entrepreneurs.",ac:C.green},
  ];
  const s=steps[step];
  return <div style={{position:"fixed",inset:0,zIndex:9998,overflow:"hidden"}}>
    <FinBg C={C}/>
    <div style={{position:"relative",zIndex:1,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{fontSize:96,marginBottom:26,animation:"float 3s ease-in-out infinite",filter:`drop-shadow(0 0 36px ${s.ac}88)`,display:"inline-block"}}>{s.icon}</div>
        <div style={{display:"inline-block",padding:"5px 18px",borderRadius:99,background:`${s.ac}20`,border:`1px solid ${s.ac}55`,color:s.ac,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:18}}>{s.sub}</div>
        <div style={{fontSize:30,fontWeight:900,color:C.text,marginBottom:16,lineHeight:1.2,letterSpacing:-0.5,fontFamily:"Syne,sans-serif"}}>{s.tl}</div>
        <div style={{fontSize:15,color:C.muted,lineHeight:1.9,marginBottom:48}}>{s.desc}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:38}}>{steps.map((_,i)=><div key={i} onClick={()=>setStep(i)} style={{width:i===step?36:8,height:8,borderRadius:99,background:i===step?s.ac:C.border,cursor:"pointer",transition:"all 0.38s cubic-bezier(0.22,1,0.36,1)"}}/>)}</div>
        <div style={{display:"flex",gap:14,justifyContent:"center"}}>
          {step>0&&<Btn C={C} v="g" on={()=>setStep(p=>p-1)}>← Back</Btn>}
          <Btn C={C} on={()=>step<steps.length-1?setStep(p=>p+1):onDone()} st={{background:`linear-gradient(135deg,${s.ac},${s.ac}CC)`,boxShadow:`0 6px 30px ${s.ac}55`,border:"none",color:"#fff",minWidth:180}}>{step<steps.length-1?"Next →":"Get Started 🚀"}</Btn>
        </div>
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════ LOGIN ════════════════════════════════════
function Login({C,onLogin,onReg}){
  const [phone,setPhone]=useState("");
  const [pin,setPin]=useState(["","","",""]);
  const [err,setErr]=useState("");
  const [ld,setLd]=useState(false);
  const go=()=>{
    const p=pin.join("");
    if(!phone.trim()){setErr("Enter your phone number.");return;}
    if(p.length<4){setErr("Enter your 4-digit PIN.");return;}
    setLd(true);setErr("");
    setTimeout(()=>{
      const clean=phone.replace(/[\s+]/g,"").replace(/^255/,"0");
      if(["0712345678","712345678"].includes(clean)&&p==="1234")onLogin();
      else{setErr("Invalid credentials. Click the demo box to auto-fill.");setLd(false);}
    },1500);
  };
  return <div style={{position:"fixed",inset:0,zIndex:9997,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
    <FinBg C={C}/>
    <div style={{position:"relative",zIndex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:28,padding:"44px 40px",width:"100%",maxWidth:440,margin:16,animation:"zoomIn 0.45s cubic-bezier(0.22,1,0.36,1)",boxShadow:`0 50px 100px rgba(0,0,0,0.55),0 0 0 1px ${C.accent}18`}}>
      <div style={{textAlign:"center",marginBottom:34}}>
        <div style={{fontSize:58,marginBottom:14,animation:"floatSm 4s ease-in-out infinite",display:"inline-block",filter:`drop-shadow(0 0 24px ${C.accent})`}}>🐼</div>
        <div style={{fontSize:26,fontWeight:900,background:`linear-gradient(135deg,${C.accent},${C.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-0.5,fontFamily:"Syne,sans-serif"}}>PANDA FINANCE</div>
        <div style={{fontSize:11,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",marginTop:6}}>Secure Login · Tanzania</div>
      </div>
      <Lbl C={C}>Phone Number</Lbl>
      <FInp C={C} val={phone} on={setPhone} ph="+255 712 345 678" ic="📱"/>
      <PinPad C={C} val={pin} on={setPin} lb="4-Digit Security PIN"/>
      {err&&<div style={{fontSize:12,color:C.danger,marginBottom:14,padding:"10px 14px",background:`${C.danger}12`,borderRadius:10,border:`1px solid ${C.danger}33`}}>⚠️ {err}</div>}
      <div onClick={()=>{setPhone("0712345678");setPin(["1","2","3","4"]);}} style={{fontSize:11,color:C.muted,marginBottom:18,padding:"10px 14px",background:`${C.accent}0E`,borderRadius:10,border:`1px solid ${C.accent}22`,cursor:"pointer"}}>
        🔑 Demo: <strong style={{color:C.accent}}>0712345678</strong> / PIN: <strong style={{color:C.accent}}>1234</strong> · <span style={{color:C.accent,textDecoration:"underline"}}>Click to auto-fill</span>
      </div>
      <Btn C={C} fu on={go} ld={ld}>{ld?"Verifying...":"Login to Panda Finance 🔐"}</Btn>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:18,fontSize:13}}>
        <span style={{color:C.muted}}>New user?</span>
        <span onClick={onReg} style={{color:C.accent,cursor:"pointer",fontWeight:700}}>Create Account →</span>
      </div>
      <div style={{textAlign:"center",marginTop:14,fontSize:11,color:C.muted}}>🛡️ 256-bit AES Encrypted · Bank-Grade Security</div>
    </div>
  </div>;
}

// ══════════════════════════════════ REGISTER ════════════════════════════════
function Register({C,onBack,onDone}){
  const [step,setStep]=useState(0);
  const [f,setF]=useState({name:"",phone:"",email:"",type:"",region:"",id:"",biz:"",pin:["","","",""],pin2:["","","",""],agree:false});
  const upd=(k,v)=>setF(x=>({...x,[k]:v}));
  const [err,setErr]=useState("");const [ld,setLd]=useState(false);
  const types=["Individual","Small Business","Farmer","Investor","Cooperative","Company","Financial Institution","Youth (18-25)"];
  const regions=["Dar es Salaam","Mwanza","Arusha","Dodoma","Mbeya","Morogoro","Tanga","Zanzibar","Kilimanjaro","Songea","Tabora","Lindi","Pwani","Other"];
  const ok=()=>{
    if(step===0){if(!f.name.trim()||f.name.length<2){setErr("Full name required.");return false;}if(!/^(\+?255|0)[67]\d{8}$/.test(f.phone.replace(/\s/g,""))){setErr("Valid Tanzanian phone required.");return false;}if(f.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)){setErr("Valid email required.");return false;}}
    if(step===1){if(!f.type){setErr("Select account type.");return false;}if(!f.region){setErr("Select your region.");return false;}if(!f.id.trim()||f.id.length<6){setErr("Valid National ID required.");return false;}}
    if(step===2){const p=f.pin.join(""),p2=f.pin2.join("");if(p.length<4){setErr("Enter complete 4-digit PIN.");return false;}if(p!==p2){setErr("PINs do not match.");return false;}if(["0000","1111","2222","1234","4321"].includes(p)){setErr("PIN too simple — choose a stronger PIN.");return false;}if(!f.agree){setErr("Must agree to Terms & Conditions.");return false;}}
    setErr("");return true;
  };
  const next=()=>{if(!ok())return;if(step<2){setStep(s=>s+1);}else{setLd(true);setTimeout(()=>{setLd(false);onDone();},2000);}};
  return <div style={{position:"fixed",inset:0,zIndex:9997,overflow:"auto",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <FinBg C={C}/>
    <div style={{position:"relative",zIndex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:26,padding:"38px 34px",width:"100%",maxWidth:470,margin:"20px auto",animation:"zoomIn 0.45s cubic-bezier(0.22,1,0.36,1)",boxShadow:`0 50px 100px rgba(0,0,0,0.55)`}}>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44,marginBottom:10}}>🐼</div><div style={{fontSize:20,fontWeight:900,color:C.text,fontFamily:"Syne,sans-serif"}}>Create Secure Account</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Step {step+1} of 3 — {["Personal Info","Account Setup","Security"][step]}</div></div>
      <div style={{display:"flex",gap:6,marginBottom:24}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:99,background:i<=step?C.accent:C.border,opacity:i<step?0.55:1,transition:"all 0.4s"}}/>)}</div>
      {err&&<div style={{fontSize:12,color:C.danger,marginBottom:14,padding:"10px 14px",background:`${C.danger}12`,borderRadius:10}}>⚠️ {err}</div>}
      {step===0&&<div style={{animation:"fadeUp 0.4s ease"}}>
        <Lbl C={C} req>Full Name</Lbl><FInp C={C} val={f.name} on={v=>upd("name",v)} ph="e.g. Amina Hassan Juma" ic="👤"/>
        <Lbl C={C} req>Tanzanian Phone Number</Lbl><FInp C={C} val={f.phone} on={v=>upd("phone",v)} ph="+255 712 345 678" ic="📱"/>
        <Lbl C={C}>Email Address (Optional)</Lbl><FInp C={C} val={f.email} on={v=>upd("email",v)} ph="amina@example.com" ic="📧"/>
      </div>}
      {step===1&&<div style={{animation:"fadeUp 0.4s ease"}}>
        <Lbl C={C} req>Account Type</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>{types.map(t=><div key={t} onClick={()=>upd("type",t)} style={{padding:"10px 12px",borderRadius:12,border:`2px solid ${f.type===t?C.accent:C.border}`,background:f.type===t?`${C.accent}14`:C.surface,cursor:"pointer",fontSize:12,fontWeight:f.type===t?800:500,color:f.type===t?C.accent:C.text,textAlign:"center",transition:"all 0.2s"}}>{t}</div>)}</div>
        <Lbl C={C} req>Region</Lbl>
        <select value={f.region} onChange={e=>upd("region",e.target.value)} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:f.region?C.text:C.muted,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:14}}><option value="">Select region...</option>{regions.map(r=><option key={r}>{r}</option>)}</select>
        <Lbl C={C} req>National ID / NIDA</Lbl><FInp C={C} val={f.id} on={v=>upd("id",v)} ph="e.g. 19900101-12345-00001-0" ic="🪪"/>
        <Lbl C={C}>Business Name (Optional)</Lbl><FInp C={C} val={f.biz} on={v=>upd("biz",v)} ph="e.g. Amina Traders Ltd" ic="🏢"/>
      </div>}
      {step===2&&<div style={{animation:"fadeUp 0.4s ease"}}>
        <PinPad C={C} val={f.pin} on={v=>upd("pin",v)} lb="Create 4-Digit PIN"/>
        <PinPad C={C} val={f.pin2} on={v=>upd("pin2",v)} lb="Confirm PIN"/>
        <div style={{background:`${C.accent}0E`,border:`1px solid ${C.accent}28`,borderRadius:12,padding:14,fontSize:12,color:C.muted,lineHeight:1.9,marginBottom:14}}>🔒 PIN encrypted with 256-bit AES — never stored in plain text<br/>🛡️ Never share your PIN with anyone, ever<br/>📱 Panda Finance will NEVER ask for your PIN</div>
        <div onClick={()=>upd("agree",!f.agree)} style={{display:"flex",gap:10,alignItems:"flex-start",cursor:"pointer",marginBottom:10}}>
          <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${f.agree?C.accent:C.border}`,background:f.agree?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.2s"}}>{f.agree&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>I agree to Panda Finance <span style={{color:C.accent}}>Terms & Conditions</span> and <span style={{color:C.accent}}>Privacy Policy</span>. All information provided is accurate and true.</div>
        </div>
      </div>}
      <div style={{display:"flex",gap:12,marginTop:20}}>
        <Btn C={C} v="g" on={()=>step===0?onBack():setStep(s=>s-1)}>← Back</Btn>
        <Btn C={C} on={next} ld={ld} st={{flex:1}}>{ld?"Creating Account...":step<2?"Continue →":"Create Account 🎉"}</Btn>
      </div>
    </div>
  </div>;
}

// ════════════════════════════════ TOAST SYSTEM ═══════════════════════════════
function Toasts({toasts,onDismiss,C}){
  return <div style={{position:"fixed",top:70,right:18,zIndex:9500,display:"flex",flexDirection:"column",gap:10,maxWidth:380,width:"calc(100% - 36px)"}}>
    {toasts.map(t=><div key={t.id} style={{background:C.card,border:`1px solid ${NOTIF_C[t.type]||C.accent}55`,borderLeft:`4px solid ${NOTIF_C[t.type]||C.accent}`,borderRadius:16,padding:"14px 16px",boxShadow:`0 16px 50px rgba(0,0,0,0.45)`,animation:t.leaving?"toastOut 0.35s ease forwards":"toastIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}} onClick={()=>onDismiss(t.id)}>
      <div style={{fontSize:22,flexShrink:0}}>{t.icon}</div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:3}}>{t.title}</div><div style={{fontSize:12,color:C.muted,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.body}</div></div>
      <button onClick={e=>{e.stopPropagation();onDismiss(t.id);}} style={{fontSize:14,color:C.muted,background:"none",border:"none",cursor:"pointer",flexShrink:0}}>✕</button>
    </div>)}
  </div>;
}

// ══════════════════════════════════ NOTIF BELL ═══════════════════════════════
function Bell({C,notifs,setNotifs,setActive}){
  const [open,setOpen]=useState(false);
  const [ring,setRing]=useState(false);
  const ref=useRef(null);
  const unread=notifs.filter(n=>!n.read).length;
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  const markAll=()=>setNotifs(n=>n.map(x=>({...x,read:true})));
  const markOne=id=>setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  return <div ref={ref} style={{position:"relative"}}>
    <button onClick={()=>{setOpen(o=>!o);if(!open){setRing(true);setTimeout(()=>setRing(false),700);}}} className={ring?"rg":""} style={{position:"relative",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:18,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
      🔔{unread>0&&<span className="bb" style={{position:"absolute",top:-5,right:-5,background:"linear-gradient(135deg,#FF3860,#FF8C00)",color:"#fff",borderRadius:99,fontSize:10,fontWeight:900,minWidth:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",border:`2px solid ${C.bg}`}}>{unread>9?"9+":unread}</span>}
    </button>
    {open&&<div style={{position:"absolute",right:0,top:"calc(100% + 12px)",width:380,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,boxShadow:"0 28px 70px rgba(0,0,0,0.6)",zIndex:700,animation:"slideDown 0.28s ease",overflow:"hidden"}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"Syne,sans-serif"}}>🔔 Notifications</div><div style={{fontSize:11,color:C.muted}}>{unread} unread</div></div>
        <div style={{display:"flex",gap:10}}>{unread>0&&<button onClick={markAll} style={{fontSize:11,color:C.accent,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif"}}>Mark all read</button>}<button onClick={()=>{setOpen(false);setActive("notifs");}} style={{fontSize:11,color:C.muted,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif"}}>See all →</button></div>
      </div>
      <div style={{maxHeight:340,overflowY:"auto"}}>{notifs.slice(0,7).map(n=><div key={n.id} onClick={()=>markOne(n.id)} style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}18`,cursor:"pointer",background:n.read?"transparent":`${NOTIF_C[n.type]||C.accent}08`,display:"flex",gap:12,alignItems:"flex-start",transition:"all 0.2s"}}><div style={{fontSize:20,flexShrink:0}}>{n.icon}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><div style={{fontSize:13,fontWeight:n.read?600:800,color:C.text,lineHeight:1.3}}>{n.title}</div>{!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:NOTIF_C[n.type]||C.accent,flexShrink:0,marginTop:4}}/>}</div><div style={{fontSize:12,color:C.muted,marginTop:3,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical"}}>{n.body}</div><div style={{fontSize:10,color:C.muted,marginTop:3,opacity:0.7}}>{n.time}</div></div></div>)}</div>
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,textAlign:"center"}}><button onClick={()=>{setOpen(false);setActive("notifs");}} style={{fontSize:13,color:C.accent,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif"}}>View All Notifications →</button></div>
    </div>}
  </div>;
}

// ═══════════════════════════════ DASHBOARD ════════════════════════════════
function Dashboard({C,balance,setActive}){
  const stats=[{lb:"Total Balance",val:fmt(balance),ic:"💰",cl:C.accent,d:0,sub:"+TSh 250K today"},{lb:"Credit Score",val:"742/1000",ic:"⭐",cl:C.purple,d:0.07,sub:"Top 15% · Excellent"},{lb:"Monthly Savings",val:"TSh 380K",ic:"🐼",cl:C.gold,d:0.14,sub:"+8.1% vs last month"},{lb:"Active Loans",val:"TSh 1.2M",ic:"🏦",cl:C.danger,d:0.21,sub:"2 loans · On track"}];
  const txns=[{n:"M-Pesa Deposit",d:"Today 09:14",a:250000,t:"cr"},{n:"Airtel Bill Pay",d:"Today 07:30",a:-45000,t:"db"},{n:"Loan Repayment",d:"Yesterday",a:-120000,t:"db"},{n:"Market Sale",d:"Yesterday",a:180000,t:"cr"},{n:"Insurance",d:"Jun 1",a:-22000,t:"db"},{n:"Vikoba Group",d:"Jun 1",a:-50000,t:"db"}];
  return <div>
    <PHdr C={C} tl="Welcome back, BAK 👋" sub="June 2026 · Tanzania Shilling (TSh)" act={<div style={{display:"flex",gap:8}}><Tag C={C} cl={C.green}>🟢 Live</Tag><Tag C={C} cl={C.gold}>🌟 Premium</Tag></div>}/>
    <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>{stats.map(s=><SC key={s.lb} C={C} {...s}/>)}</div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:16}}>
      <Card C={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"Syne,sans-serif"}}>Recent Transactions</div><button onClick={()=>setActive("wallet")} style={{fontSize:12,color:C.accent,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif"}}>View All →</button></div>
        {txns.map(t=><div key={t.n+t.d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:36,height:36,borderRadius:10,background:t.t==="cr"?`${C.accent}18`:`${C.danger}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{t.t==="cr"?"📥":"📤"}</div><div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{t.n}</div><div style={{fontSize:11,color:C.muted}}>{t.d}</div></div></div>
          <div style={{fontSize:13,fontWeight:800,color:t.t==="cr"?C.accent:C.danger,fontFamily:"JetBrains Mono,monospace"}}>{t.t==="cr"?"+":"-"}{fmt(Math.abs(t.a)).replace("TSh ","")}</div>
        </div>)}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C} ac><div style={{fontSize:12,color:C.muted,marginBottom:6,fontWeight:600}}>🤖 AI Insight</div><div style={{fontSize:13,lineHeight:1.75,color:C.text}}>Spending <strong style={{color:C.accent}}>18% lower</strong> this month. Move TSh 200K to House Goal → push to <strong style={{color:C.gold}}>66%</strong>.</div><div style={{marginTop:10}}><Btn C={C} sm on={()=>setActive("savings")}>Go to Savings →</Btn></div></Card>
        <Card C={C}><div style={{fontSize:13,fontWeight:800,marginBottom:12,color:C.text,fontFamily:"Syne,sans-serif"}}>Savings Goals</div>{[["🏠 House",62,C.accent],["🎓 Education",40,C.gold],["🚜 Equipment",25,C.purple],["🆘 Emergency",84,C.green]].map(([l,p,cl])=><div key={l} style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:C.text,fontWeight:600}}>{l}</span><span style={{color:cl,fontWeight:800}}>{p}%</span></div><Prg C={C} pct={p} cl={cl}/></div>)}</Card>
        <Card C={C} st={{padding:16}}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>⚡ Quick Actions</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{l:"Send Money",i:"💸",id:"wallet"},{l:"Get Loan",i:"🏦",id:"loans"},{l:"Invest",i:"🌱",id:"invest"},{l:"AI Help",i:"🤖",id:"assistant"}].map(a=><button key={a.l} onClick={()=>setActive(a.id)} style={{padding:"10px 6px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,cursor:"pointer",fontSize:11,fontWeight:700,color:C.text,fontFamily:"Plus Jakarta Sans,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s"}}><span style={{fontSize:20}}>{a.i}</span>{a.l}</button>)}</div></Card>
      </div>
    </div>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      <Card C={C} st={{padding:18}}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8,fontFamily:"Syne,sans-serif"}}>📊 Business Health</div><div style={{fontSize:34,fontWeight:900,color:C.green,letterSpacing:-2,fontFamily:"JetBrains Mono,monospace"}}>84<span style={{fontSize:16}}>/100</span></div><Prg C={C} pct={84} cl={C.green}/><div style={{fontSize:11,color:C.muted,marginTop:6}}>Above industry average · Trending up</div></Card>
      <Card C={C} st={{padding:18}} gold><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8,fontFamily:"Syne,sans-serif"}}>🌱 Investment Returns</div><div style={{fontSize:30,fontWeight:900,color:C.gold,letterSpacing:-1}}>+18.4%</div><div style={{fontSize:12,color:C.muted,marginTop:6}}>TSh 1.5M across 3 active investments</div><div style={{marginTop:10}}><Btn C={C} sm v="gold" on={()=>setActive("invest")}>View Portfolio</Btn></div></Card>
      <Card C={C} st={{padding:18}}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8,fontFamily:"Syne,sans-serif"}}>🧾 Tax Due Soon</div><div style={{fontSize:30,fontWeight:900,color:C.warn}}>14 Days</div><div style={{fontSize:12,color:C.muted,marginTop:6}}>VAT Filing · Est. TSh 2.1M due</div><div style={{marginTop:10}}><Btn C={C} sm v="g" on={()=>setActive("tax")}>View Tax</Btn></div></Card>
    </div>
  </div>;
}

// ════════════════════════════════ DIGITAL WALLET ════════════════════════════
function Wallet({C,balance,setBalance}){
  const [sel,setSel]=useState("M-Pesa");
  const [modal,setModal]=useState(null);
  const [amt,setAmt]=useState("");const [toPhone,setToPhone]=useState("");const [note,setNote]=useState("");const [done,setDone]=useState(false);const [ld,setLd]=useState(false);
  const providers=[{n:"M-Pesa",b:1240000,cl:"#00A550",ic:"🟢",ussd:"*150*00#"},{n:"Airtel Money",b:890000,cl:"#FF3B30",ic:"🔴",ussd:"*150*60#"},{n:"Mixx by Yas",b:320000,cl:"#007AFF",ic:"🔵",ussd:"*150*30#"},{n:"HaloPesa",b:210000,cl:"#FF9500",ic:"🟠",ussd:"*150*88#"},{n:"NMB Bank",b:1800000,cl:"#1A56DB",ic:"🏦",ussd:"App/USSD"},{n:"CRDB Bank",b:360000,cl:"#006633",ic:"🌿",ussd:"App/USSD"}];
  const confirm=()=>{
    const a=parseInt(amt.replace(/,/g,""))||0;if(a<=0)return;
    setLd(true);
    setTimeout(()=>{
      if(modal==="Deposit")setBalance(b=>b+a);
      if(modal==="Withdraw"||modal==="Transfer"||modal==="Pay Bill")setBalance(b=>Math.max(0,b-a));
      setDone(true);setLd(false);
    },1500);
  };
  const sp=providers.find(p=>p.n===sel);
  return <div>
    <PHdr C={C} tl="💳 Digital Wallet" sub="All your money in one secure place · Real-time balance"/>
    {modal&&<Modal C={C} tl={`${modal} — ${sel}`} onCl={()=>{setModal(null);setDone(false);setAmt("");}} w={430}>
      {!done?<>
        <div style={{background:`${C.accent}10`,borderRadius:12,padding:14,marginBottom:18,fontSize:13,color:C.muted}}>Balance: <strong style={{color:C.accent}}>{fmt(balance)}</strong> · Via: <strong style={{color:C.text}}>{sel}</strong></div>
        <Lbl C={C} req>Amount (TSh)</Lbl><FInp C={C} val={amt} on={setAmt} ph="e.g. 50,000" ic="💰"/>
        {modal==="Transfer"&&<><Lbl C={C} req>Recipient Phone</Lbl><FInp C={C} val={toPhone} on={setToPhone} ph="+255 712 000 000" ic="📱"/></>}
        {modal==="Pay Bill"&&<><Lbl C={C} req>Bill Account/Reference</Lbl><FInp C={C} val={toPhone} on={setToPhone} ph="Account number" ic="🔢"/></>}
        <Lbl C={C}>Note (Optional)</Lbl><FInp C={C} val={note} on={setNote} ph="e.g. Rent payment" ic="📝"/>
        <div style={{display:"flex",gap:10}}><Btn C={C} v="g" fu on={()=>{setModal(null);setDone(false);}}>Cancel</Btn><Btn C={C} fu on={confirm} ld={ld}>{ld?"Processing...":"Confirm ✓"}</Btn></div>
      </>:<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:72,marginBottom:16,animation:"zoomIn 0.4s ease"}}>✅</div>
        <div style={{fontSize:20,fontWeight:900,color:C.accent,marginBottom:8,fontFamily:"Syne,sans-serif"}}>{modal} Successful!</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:4}}>TSh {(parseInt(amt.replace(/,/g,""))||0).toLocaleString()} processed via {sel}</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:24}}>Ref: PF{Date.now().toString().slice(-8)}</div>
        <Btn C={C} fu on={()=>{setModal(null);setDone(false);setAmt("");}}>Done</Btn>
      </div>}
    </Modal>}
    <div className="g2" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
      <Card C={C} ac>
        <div style={{fontSize:12,color:C.muted,marginBottom:4,letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>Total Wallet Balance</div>
        <div style={{fontSize:42,fontWeight:900,color:C.text,letterSpacing:-2,margin:"8px 0 6px",fontFamily:"JetBrains Mono,monospace"}}>{fmt(balance)}</div>
        <div style={{fontSize:12,color:C.green,marginBottom:22,fontWeight:700}}>📈 +TSh 250,000 received today</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["Deposit","Withdraw","Transfer","Pay Bill"].map(a=><Btn key={a} C={C} sm on={()=>{setModal(a);setDone(false);setAmt("");}}>{a}</Btn>)}</div>
      </Card>
      <Card C={C} st={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <div style={{fontSize:11,color:C.muted,letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>My QR Code</div>
        <div style={{width:100,height:100,background:"white",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:58,boxShadow:`0 0 32px ${C.accent}44,0 0 64px ${C.accent}22`,animation:"glow 4s ease-in-out infinite"}}>🐼</div>
        <div style={{fontSize:11,color:C.accent,fontWeight:800}}>BAK · Panda Finance</div>
        <div style={{fontSize:10,color:C.muted,textAlign:"center"}}>Scan to pay or receive instantly</div>
      </Card>
    </div>
    <Card C={C}>
      <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:16,fontFamily:"Syne,sans-serif"}}>Connected Mobile Money & Banks</div>
      <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {providers.map(p=><div key={p.n} onClick={()=>setSel(p.n)} style={{padding:"14px",borderRadius:14,border:`2px solid ${sel===p.n?p.cl:C.border}`,background:sel===p.n?`${p.cl}12`:C.surface,cursor:"pointer",transition:"all 0.22s",boxShadow:sel===p.n?`0 0 0 3px ${p.cl}22`:"none"}}>
          <div style={{fontSize:13,fontWeight:sel===p.n?800:500,color:sel===p.n?p.cl:C.text,marginBottom:4}}>{p.ic} {p.n}</div>
          <div style={{fontSize:15,fontWeight:900,color:C.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(p.b)}</div>
          {sel===p.n&&<div style={{fontSize:10,color:p.cl,marginTop:5,fontWeight:700}}>✓ SELECTED · {p.ussd}</div>}
        </div>)}
      </div>
      {sp&&<div style={{marginTop:14,padding:"12px 14px",background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,fontSize:12,color:C.muted,display:"flex",gap:20,flexWrap:"wrap"}}>
        <span>📱 USSD: <strong style={{color:C.text}}>{sp.ussd}</strong></span>
        <span>💰 Balance: <strong style={{color:C.accent}}>{fmt(sp.b)}</strong></span>
        <span>🔒 Linked & Verified</span>
        <span>⚡ Instant Transfers</span>
      </div>}
    </Card>
  </div>;
}

// ═══════════════════════════════ CURRENCY EXCHANGE ═══════════════════════════
function Currency({C}){
  const rates={TSh:1,USD:1/2650,EUR:1/2890,GBP:1/3380,KES:1/19.5,UGX:1/0.72};
  const flags={TSh:"🇹🇿",USD:"🇺🇸",EUR:"🇪🇺",GBP:"🇬🇧",KES:"🇰🇪",UGX:"🇺🇬"};
  const [from,setFrom]=useState("TSh");const [to,setTo]=useState("USD");const [amt,setAmt]=useState("1000000");
  const result=parseFloat(amt.replace(/,/g,""))*rates[to]/rates[from];
  const rateDisplay=(1/rates[from]*rates[to]).toFixed(6);
  const pairs=[["TSh","USD"],["TSh","EUR"],["TSh","GBP"],["TSh","KES"],["USD","EUR"],["KES","TSh"]];
  return <div>
    <PHdr C={C} tl="💱 Currency Exchange" sub="Live rates · TSh ↔ USD · EUR · GBP · KES · UGX"/>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:16}}>
      <Card C={C} ac>
        <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:20,fontFamily:"Syne,sans-serif"}}>💱 Currency Converter</div>
        <Lbl C={C}>From Currency</Lbl>
        <select value={from} onChange={e=>setFrom(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:14}}>
          {Object.keys(rates).map(k=><option key={k}>{flags[k]} {k}</option>)}
        </select>
        <Lbl C={C}>Amount</Lbl>
        <FInp C={C} val={amt} on={setAmt} ph="Enter amount" ic={flags[from]}/>
        <Lbl C={C}>To Currency</Lbl>
        <select value={to} onChange={e=>setTo(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:20}}>
          {Object.keys(rates).filter(k=>k!==from).map(k=><option key={k}>{flags[k]} {k}</option>)}
        </select>
        <div style={{background:`${C.accent}12`,border:`1px solid ${C.accent}30`,borderRadius:16,padding:20,textAlign:"center"}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Converted Amount</div>
          <div style={{fontSize:36,fontWeight:900,color:C.accent,letterSpacing:-1,fontFamily:"JetBrains Mono,monospace"}}>{isNaN(result)?"—":fmtC(result,to)}</div>
          <div style={{fontSize:12,color:C.muted,marginTop:8}}>Rate: 1 {from} = {rateDisplay} {to}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4,opacity:0.7}}>Rates updated live · June 2026</div>
        </div>
        <div style={{marginTop:14}}><Btn C={C} fu>Send This Amount via Panda 💸</Btn></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:14,fontFamily:"Syne,sans-serif"}}>Live Exchange Rates (TSh)</div>
          {[["USD","🇺🇸",2650,"+0.8%"],[  "EUR","🇪🇺",2890,"+1.1%"],["GBP","🇬🇧",3380,"+0.6%"],["KES","🇰🇪",19.5,"-0.3%"],["UGX","🇺🇬",0.72,"+0.2%"]].map(([cur,fl,rate,chg])=><div key={cur} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>{fl}</span><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{cur}</div><div style={{fontSize:11,color:C.muted}}>1 {cur}</div></div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:C.text,fontFamily:"JetBrains Mono,monospace"}}>TSh {rate.toLocaleString()}</div><div style={{fontSize:11,color:chg.startsWith("+")?C.green:C.danger,fontWeight:700}}>{chg}</div></div>
          </div>)}
        </Card>
        <Card C={C} gold st={{padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>🌍 East Africa Transfer</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.8}}>Send money across Tanzania 🇹🇿, Kenya 🇰🇪, Uganda 🇺🇬, Rwanda 🇷🇼, and Zambia 🇿🇲 at the best rates with 0.5% Panda fee.</div>
          <div style={{marginTop:12}}><Btn C={C} v="gold">Send Across East Africa</Btn></div>
        </Card>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════ AI BUSINESS HUB ════════════════════════════
function BizAI({C}){
  const [msgs,setMsgs]=useState([{role:"ai",text:"Habari BAK! 🧠 I'm your AI Business Manager — powered by Claude AI.\n\nI can do anything for your business:\n• 📊 Full financial analysis & P&L statements\n• 💡 Market strategy & competitive analysis\n• 📦 Inventory optimization & demand forecasting\n• 🤝 Investor pitch decks & funding strategies\n• 📋 Business plans, contracts & proposals\n• ⚖️ Tanzania legal & TRA tax guidance\n• 🌍 East Africa market expansion strategies\n• 👥 HR, hiring, and team management\n\nWhat business challenge shall we tackle today?"}]);
  const [inp,setInp]=useState("");const [ld,setLd]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,ld]);
  const send=async()=>{
    if(!inp.trim()||ld)return;
    const msg=inp;setInp("");setMsgs(m=>[...m,{role:"user",text:msg}]);setLd(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,system:"You are an elite AI Business Manager for Panda Finance, Tanzania's #1 digital financial platform built by BAK. You have deep expertise in: Tanzania business law, TRA taxation, mobile money ecosystems, SME financing, agricultural finance, East African trade, fintech regulation, and startup growth. Help users with any business challenge — analysis, strategy, legal, financial modeling, marketing, HR, investor relations. Respond in clear, practical, actionable advice. Support Kiswahili and English naturally. Reference real Tanzania context: M-Pesa, Airtel Money, NMB, CRDB, TRA, BoT, BRELA, OSHA, SACCOs, SIDO.",messages:[{role:"user",content:msg}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"ai",text:data.content?.[0]?.text||"Sorry, please try again."}]);
    }catch{setMsgs(m=>[...m,{role:"ai",text:"Connection error. Please check your internet and try again."}]);}
    setLd(false);
  };
  const quick=["Create a full business plan","Analyze my cash flow","How to get Series A investment?","Tanzania tax planning guide","Marketing strategy for Dar es Salaam","How to register a company in Tanzania?","Demand forecast for my products","Draft an investor pitch deck"];
  return <div>
    <PHdr C={C} tl="🧠 AI Business Hub" sub="Your 24/7 AI business manager — powered by Claude AI"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>{[{ic:"📊",t:"Business Analysis",d:"P&L, cash flow, KPI deep-dives"},{ic:"💡",t:"Strategy Advisor",d:"Growth plans & market edge"},{ic:"🤝",t:"Investor Ready",d:"Pitches, projections & funding"}].map(x=><Card key={x.t} C={C} ac><div style={{fontSize:28,marginBottom:8}}>{x.ic}</div><div style={{fontWeight:800,color:C.text,fontFamily:"Syne,sans-serif"}}>{x.t}</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{x.d}</div></Card>)}</div>
    <Card C={C} st={{display:"flex",flexDirection:"column",height:520}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:12,paddingRight:4}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:"82%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?`linear-gradient(135deg,${C.accent},${C.accentDark})`:C.surface,color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.75,border:m.role==="ai"?`1px solid ${C.border}`:"none",whiteSpace:"pre-wrap",fontFamily:"Plus Jakarta Sans,sans-serif"}}>{m.text}</div>
        </div>)}
        {ld&&<div style={{display:"flex"}}><div style={{padding:"12px 16px",background:C.surface,borderRadius:18,fontSize:13,color:C.muted,border:`1px solid ${C.border}`,animation:"pulse 1.2s ease infinite"}}>🧠 AI thinking deeply...</div></div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{quick.map(q=><button key={q} onClick={()=>setInp(q)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{q}</button>)}</div>}
      <div style={{display:"flex",gap:10}}><input style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none"}} placeholder="Ask anything about your business..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><Btn C={C} on={send}>{ld?"...":"Send"}</Btn></div>
    </Card>
  </div>;
}

// ═══════════════════════════════ AI INVENTORY ════════════════════════════════
function Inventory({C}){
  const [items,setItems]=useState([
    {id:1,name:"Maize Flour 2kg",stock:142,sold:88,price:4500,cost:3200,reorder:50,alert:false,trend:"stable",cat:"Food"},
    {id:2,name:"Cooking Oil 1L",stock:12,sold:245,price:3200,cost:2400,reorder:100,alert:true,trend:"rising",cat:"Food"},
    {id:3,name:"Sugar 1kg",stock:67,sold:130,price:2800,cost:2100,reorder:80,alert:false,trend:"stable",cat:"Food"},
    {id:4,name:"Rice 5kg",stock:8,sold:198,price:12000,cost:9000,reorder:60,alert:true,trend:"rising",cat:"Food"},
    {id:5,name:"Milk 500ml",stock:55,sold:320,price:1500,cost:1100,reorder:100,alert:false,trend:"stable",cat:"Dairy"},
    {id:6,name:"Beans 1kg",stock:3,sold:167,price:3500,cost:2600,reorder:80,alert:true,trend:"rising",cat:"Food"},
    {id:7,name:"Soap Bar",stock:89,sold:210,price:800,cost:550,reorder:100,alert:false,trend:"stable",cat:"Hygiene"},
    {id:8,name:"Mobile Charger",stock:14,sold:42,price:15000,cost:9000,reorder:20,alert:false,trend:"rising",cat:"Electronics"},
  ]);
  const [modal,setModal]=useState(false);const [newI,setNewI]=useState({name:"",stock:"",price:"",cost:"",reorder:"",cat:"Food"});
  const [analysis,setAnalysis]=useState("");const [ald,setAld]=useState(false);const [view,setView]=useState("table");
  const cats=["Food","Dairy","Hygiene","Electronics","Clothing","Agriculture","Other"];
  const aiAnalyze=async()=>{
    setAld(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,system:"You are an AI inventory manager for a Tanzanian business. Give exactly 5 numbered, specific, actionable recommendations. Include reorder quantities, pricing suggestions, and demand patterns. Be direct and practical.",messages:[{role:"user",content:`Analyze this inventory for a Tanzanian shop and give 5 specific recommendations:\n${items.map(i=>`${i.name}: ${i.stock} units in stock, ${i.sold} sold, price TSh ${i.price}, cost TSh ${i.cost}, reorder point ${i.reorder}, trend: ${i.trend}, category: ${i.cat}`).join("\n")}`}]})});
      const data=await res.json();setAnalysis(data.content?.[0]?.text||"");
    }catch{setAnalysis("AI analysis unavailable. Check connection.");}
    setAld(false);
  };
  const addItem=()=>{
    if(!newI.name||!newI.stock)return;
    const st=parseInt(newI.stock)||0;
    setItems(it=>[...it,{id:Date.now(),name:newI.name,stock:st,sold:0,price:parseInt(newI.price)||0,cost:parseInt(newI.cost)||0,reorder:parseInt(newI.reorder)||20,alert:st<20,trend:"stable",cat:newI.cat||"Food"}]);
    setModal(false);setNewI({name:"",stock:"",price:"",cost:"",reorder:"",cat:"Food"});
  };
  const totalValue=items.reduce((s,i)=>s+i.stock*i.price,0);
  const lowStock=items.filter(i=>i.alert).length;
  const topSeller=items.reduce((a,b)=>a.sold>b.sold?a:b);
  return <div>
    <PHdr C={C} tl="📦 AI Inventory Manager" sub="Real-time stock tracking · AI demand forecasting · Live analytics" act={<div style={{display:"flex",gap:10}}><Btn C={C} v="g" sm on={aiAnalyze} ld={ald}>{ald?"🤖 Analyzing...":"🤖 AI Analysis"}</Btn><Btn C={C} sm on={()=>setModal(true)} ic="➕">Add Product</Btn></div>}/>
    {modal&&<Modal C={C} tl="➕ Add New Product" onCl={()=>setModal(false)}>
      <Lbl C={C} req>Product Name</Lbl><FInp C={C} val={newI.name} on={v=>setNewI(x=>({...x,name:v}))} ph="e.g. Maize Flour 2kg" ic="📦"/>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><Lbl C={C} req>Stock (units)</Lbl><FInp C={C} val={newI.stock} on={v=>setNewI(x=>({...x,stock:v}))} ph="100" ic="🔢"/></div>
        <div><Lbl C={C}>Reorder Point</Lbl><FInp C={C} val={newI.reorder} on={v=>setNewI(x=>({...x,reorder:v}))} ph="20" ic="⚠️"/></div>
        <div><Lbl C={C} req>Selling Price (TSh)</Lbl><FInp C={C} val={newI.price} on={v=>setNewI(x=>({...x,price:v}))} ph="4500" ic="💰"/></div>
        <div><Lbl C={C}>Cost Price (TSh)</Lbl><FInp C={C} val={newI.cost} on={v=>setNewI(x=>({...x,cost:v}))} ph="3000" ic="📉"/></div>
      </div>
      <Lbl C={C}>Category</Lbl>
      <select value={newI.cat} onChange={e=>setNewI(x=>({...x,cat:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:14}}>
        {cats.map(c=><option key={c}>{c}</option>)}
      </select>
      <Btn C={C} fu on={addItem}>Add Product ✓</Btn>
    </Modal>}
    <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
      <SC C={C} ic="📦" lb="Total Products" val={items.length} cl={C.accent}/>
      <SC C={C} ic="⚠️" lb="Low Stock Alerts" val={lowStock} cl={C.danger} sub={lowStock>0?"Needs attention":"All good!"}/>
      <SC C={C} ic="💰" lb="Stock Value" val={`TSh ${(totalValue/1000000).toFixed(1)}M`} cl={C.gold}/>
      <SC C={C} ic="🏆" lb="Top Seller" val={topSeller.name.split(" ").slice(0,2).join(" ")} cl={C.green} sub={`${topSeller.sold} sold`}/>
    </div>
    {analysis&&<Card C={C} ac st={{marginBottom:16}}><div style={{fontSize:14,fontWeight:800,marginBottom:10,color:C.text,fontFamily:"Syne,sans-serif"}}>🤖 AI Inventory Intelligence Report</div><div style={{fontSize:13,color:C.text,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{analysis}</div></Card>}
    <Card C={C}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Product","Category","Stock","Sold","Margin","Trend","AI Status"].map(h=><th key={h} style={{textAlign:"left",fontSize:10,color:C.muted,padding:"8px 10px",textTransform:"uppercase",letterSpacing:1.2,borderBottom:`1px solid ${C.border}`,fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>{items.map(item=>{
          const margin=item.price>0?Math.round(((item.price-item.cost)/item.price)*100):0;
          return <tr key={item.id} style={{borderBottom:`1px solid ${C.border}18`}}>
            <td style={{padding:"11px 10px",fontSize:13,color:C.text,fontWeight:600}}>{item.name}</td>
            <td style={{padding:"11px 10px"}}><Tag C={C} cl={C.muted} sm>{item.cat}</Tag></td>
            <td style={{padding:"11px 10px",fontSize:13,fontWeight:800,color:item.alert?C.danger:C.text,fontFamily:"JetBrains Mono,monospace"}}>{item.stock}</td>
            <td style={{padding:"11px 10px",fontSize:13,color:C.muted,fontFamily:"JetBrains Mono,monospace"}}>{item.sold}</td>
            <td style={{padding:"11px 10px"}}><span style={{fontSize:12,fontWeight:700,color:margin>30?C.green:margin>15?C.gold:C.danger}}>{margin}%</span></td>
            <td style={{padding:"11px 10px"}}><Tag C={C} cl={item.trend==="rising"?C.gold:C.muted} sm>{item.trend==="rising"?"📈 Rising":"📊 Stable"}</Tag></td>
            <td style={{padding:"11px 10px"}}>{item.alert?<Tag C={C} cl={C.danger} sm>⚠️ Restock Now</Tag>:<Tag C={C} cl={C.green} sm>✅ OK</Tag>}</td>
          </tr>;
        })}</tbody>
      </table>
    </Card>
  </div>;
}

// ═══════════════════════════════ INVESTMENT HUB ══════════════════════════════
function Invest({C,balance,setBalance}){
  const [tab,setTab]=useState("browse");
  const [inv,setInv]=useState(null);const [amt,setAmt]=useState("");const [done,setDone]=useState(false);
  const [mediaFiles,setMediaFiles]=useState([]);
  const [seek,setSeek]=useState({biz:"",sector:"",target:"",returns:"",stage:"",desc:"",video:"",deck:""});
  const [submitted,setSubmitted]=useState(false);const [ld,setLd]=useState(false);
  const opps=[
    {id:1,name:"Kilimo Fresh Farm",sector:"🌽 Agriculture",target:50000000,raised:36000000,returns:"18% p.a.",stage:"Series A",loc:"Morogoro",desc:"Certified organic vegetable farm supplying Dar es Salaam's top supermarkets. Expanding to 200 acres with irrigation.",min:500000,risk:"Medium",founders:"Amina & Juma",yr:2021},
    {id:2,name:"Dar Tech Hub",sector:"💻 Technology",target:120000000,raised:54000000,returns:"25% p.a.",stage:"Seed",loc:"Dar es Salaam",desc:"Premium co-working and startup incubator. 3,000 members. Hosting Tanzania's fastest-growing tech companies.",min:1000000,risk:"High",founders:"Tech Bros TZ",yr:2022},
    {id:3,name:"Coastal Fisheries Co.",sector:"🐟 Fisheries",target:30000000,raised:26400000,returns:"14% p.a.",stage:"Growth",loc:"Zanzibar",desc:"Sustainable fishing and cold-chain distribution across 6 coastal cities. Exporting to Dubai & Singapore.",min:250000,risk:"Low",founders:"Fatuma Hassan",yr:2019},
    {id:4,name:"Safari Textiles Ltd",sector:"👗 Manufacturing",target:75000000,raised:24750000,returns:"20% p.a.",stage:"Series A",loc:"Arusha",desc:"Export-quality kitenge and batik textiles. Supplying European fashion brands via fair trade partnerships.",min:1000000,risk:"Medium",founders:"Zawadi Group",yr:2020},
    {id:5,name:"SolarTZ Energy",sector:"⚡ Energy",target:200000000,raised:80000000,returns:"22% p.a.",stage:"Series B",loc:"Mwanza",desc:"Solar mini-grids powering 50,000 rural households across Lake Victoria region. Government partnership.",min:2000000,risk:"Low",founders:"EnergyTZ Ltd",yr:2018},
    {id:6,name:"Boda Pay TZ",sector:"📱 Fintech",target:90000000,raised:63000000,returns:"30% p.a.",stage:"Series A",loc:"Dar es Salaam",desc:"Digital payment and insurance platform for Tanzania's 4M+ boda boda riders. AI-powered credit scoring.",min:500000,risk:"Medium",founders:"BAK & Team",yr:2023},
  ];
  const confirmInvest=()=>{
    const a=parseInt(amt.replace(/,/g,""))||0;
    if(a<(inv?.min||0)){return;}
    setLd(true);
    setTimeout(()=>{setBalance(b=>Math.max(0,b-a));setDone(true);setLd(false);},1600);
  };
  const sectors=["All",...[...new Set(opps.map(o=>o.sector))]];
  const [sFilter,setSFilter]=useState("All");
  const filtered=sFilter==="All"?opps:opps.filter(o=>o.sector===sFilter);
  return <div>
    <PHdr C={C} tl="🌱 Investment Hub" sub="Invest in Tanzania · Seek funding · Display your business idea"/>
    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
      {["browse","seek","ideas"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 24px",borderRadius:10,border:`1px solid ${tab===t?C.accent:C.border}`,background:tab===t?`${C.accent}14`:C.surface,color:tab===t?C.accent:C.muted,fontWeight:tab===t?800:500,fontSize:13,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>
        {t==="browse"?"🔍 Browse Investments":t==="seek"?"🚀 Seek Investment":"💡 Share Your Idea"}
      </button>)}
    </div>
    {inv&&<Modal C={C} tl={`💰 Invest in ${inv.name}`} onCl={()=>{setInv(null);setDone(false);setAmt("");}}>
      {!done?<>
        <Tag C={C} cl={C.gold}>{inv.sector}</Tag>
        <div style={{fontSize:13,color:C.muted,margin:"12px 0",lineHeight:1.75}}>{inv.desc}</div>
        <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:16}}>
          {[["Returns",inv.returns,C.green],["Min. Investment",fmt(inv.min),C.accent],["Stage",inv.stage,C.purple],["Risk",inv.risk,inv.risk==="Low"?C.green:inv.risk==="High"?C.danger:C.gold],["Location",inv.loc,C.blue],["Founded",inv.yr,C.muted]].map(([k,v,cl])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13,borderBottom:`1px solid ${C.border}`}}><span style={{color:C.muted}}>{k}</span><span style={{color:cl,fontWeight:700}}>{v}</span></div>)}
        </div>
        <Lbl C={C} req>Investment Amount (TSh)</Lbl>
        <FInp C={C} val={amt} on={setAmt} ph={`Min: ${fmt(inv.min)}`} ic="💰"/>
        <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Your wallet: <strong style={{color:C.accent}}>{fmt(balance)}</strong></div>
        <div style={{display:"flex",gap:10}}><Btn C={C} v="g" fu on={()=>setInv(null)}>Cancel</Btn><Btn C={C} v="gold" fu on={confirmInvest} ld={ld}>{ld?"Processing...":"Invest Now 🚀"}</Btn></div>
      </>:<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:70,marginBottom:16,animation:"zoomIn 0.4s ease"}}>🎉</div>
        <div style={{fontSize:20,fontWeight:900,color:C.gold,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Investment Confirmed!</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24}}>You invested {fmt(parseInt(amt.replace(/,/g,""))||inv.min)} in {inv.name}</div>
        <Btn C={C} v="gold" fu on={()=>{setInv(null);setDone(false);}}>Done ✓</Btn>
      </div>}
    </Modal>}
    {tab==="browse"&&<>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
        {sectors.map(s=><button key={s} onClick={()=>setSFilter(s)} style={{padding:"6px 14px",borderRadius:99,border:`1px solid ${sFilter===s?C.accent:C.border}`,background:sFilter===s?`${C.accent}14`:C.surface,color:sFilter===s?C.accent:C.muted,fontSize:11,fontWeight:sFilter===s?700:400,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{s}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map((o,i)=>{const pct=Math.round((o.raised/o.target)*100);return <Card key={o.id} C={C} st={{animation:`fadeUp 0.4s ease ${i*0.06}s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div><div style={{fontSize:17,fontWeight:900,color:C.text,fontFamily:"Syne,sans-serif"}}>{o.name}</div><div style={{fontSize:12,color:C.muted,marginTop:3}}>📍 {o.loc} · Founded {o.yr} · {o.stage}</div></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Tag C={C} cl={C.gold}>{o.sector}</Tag><Tag C={C} cl={C.green}>{o.returns}</Tag><Tag C={C} cl={o.risk==="Low"?C.green:o.risk==="High"?C.danger:C.gold} sm>Risk: {o.risk}</Tag></div>
          </div>
          <div style={{fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.7}}>{o.desc}</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.muted}}>Funded: <strong style={{color:pct>75?C.green:C.gold}}>{pct}%</strong></span><span style={{color:C.text,fontWeight:700}}>{fmt(o.raised)} / {fmt(o.target)}</span></div>
          <Prg C={C} pct={pct} cl={pct>75?C.green:C.gold}/>
          <div style={{marginTop:14,display:"flex",gap:10,alignItems:"center"}}><Btn C={C} v="gold" on={()=>{setInv(o);setAmt("");setDone(false);}}>Invest Now 💰</Btn><span style={{fontSize:12,color:C.muted}}>Min: {fmt(o.min)}</span><span style={{fontSize:12,color:C.muted}}>Founders: {o.founders}</span></div>
        </Card>;})}
      </div>
    </>}
    {tab==="seek"&&<div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card C={C}>
        <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:16,fontFamily:"Syne,sans-serif"}}>🚀 List Your Business for Investment</div>
        {!submitted?<>
          <Lbl C={C} req>Business Name</Lbl><FInp C={C} val={seek.biz} on={v=>setSeek(f=>({...f,biz:v}))} ph="e.g. Kilimo Fresh Ltd" ic="🏢"/>
          <Lbl C={C} req>Sector</Lbl><FInp C={C} val={seek.sector} on={v=>setSeek(f=>({...f,sector:v}))} ph="Agriculture, Tech, Retail..." ic="🏷️"/>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><Lbl C={C} req>Target Funding (TSh)</Lbl><FInp C={C} val={seek.target} on={v=>setSeek(f=>({...f,target:v}))} ph="50000000" ic="💰"/></div>
            <div><Lbl C={C} req>Expected Returns</Lbl><FInp C={C} val={seek.returns} on={v=>setSeek(f=>({...f,returns:v}))} ph="18% p.a." ic="📈"/></div>
          </div>
          <Lbl C={C} req>Business Stage</Lbl>
          <select value={seek.stage} onChange={e=>setSeek(f=>({...f,stage:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:14}}>
            <option value="">Select stage...</option>
            {["Idea Stage","MVP / Prototype","Early Revenue","Growth","Scaling","Series A+"].map(s=><option key={s}>{s}</option>)}
          </select>
          <Lbl C={C} req>Business Description & Use of Funds</Lbl>
          <FInp C={C} val={seek.desc} on={v=>setSeek(f=>({...f,desc:v}))} ph="Describe your business, traction, and exactly how investment funds will be used..." ml rows={4}/>
          <Lbl C={C}>Video Pitch URL (YouTube/Vimeo)</Lbl>
          <FInp C={C} val={seek.video} on={v=>setSeek(f=>({...f,video:v}))} ph="https://youtube.com/..." ic="🎥"/>
          <Lbl C={C}>Pitch Deck URL (Google Drive/Dropbox)</Lbl>
          <FInp C={C} val={seek.deck} on={v=>setSeek(f=>({...f,deck:v}))} ph="https://drive.google.com/..." ic="📄"/>
          <Btn C={C} fu on={()=>{setLd(true);setTimeout(()=>{setLd(false);setSubmitted(true);},1800);}} ld={ld}>{ld?"Submitting...":"Submit for Review 🚀"}</Btn>
        </>:<div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:60,marginBottom:12}}>🎉</div>
          <div style={{fontSize:18,fontWeight:900,color:C.accent,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Application Submitted!</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.75,marginBottom:16}}>Your listing is under review. You'll be notified within 48 hours when it goes live for 284,000+ investors.</div>
          <Btn C={C} on={()=>setSubmitted(false)}>Submit Another</Btn>
        </div>}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C} ac>
          <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>✅ Why List on Panda Finance?</div>
          {["Access 284,000+ verified investors across East Africa","Free listing — zero upfront fees","AI-powered investor-business matching","Legal support & due diligence guidance","Regional exposure to Kenya, Uganda, Rwanda","Dedicated fundraising advisor assigned","Monthly investor newsletter featuring your business"].map(b=><div key={b} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.text}}><span style={{color:C.accent,fontWeight:900}}>✓</span>{b}</div>)}
        </Card>
        <Card C={C}><div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>📊 Platform Stats</div>{[["Total Investments","TSh 8.4B",C.accent],["Active Investors","12,440",C.gold],["Avg. Return","19% p.a.",C.green],["Success Rate","78%",C.purple],["Avg. Deal Size","TSh 45M",C.blue]].map(([k,v,cl])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.muted}}>{k}</span><span style={{color:cl,fontWeight:800}}>{v}</span></div>)}</Card>
      </div>
    </div>}
    {tab==="ideas"&&<div>
      <Card C={C} ac st={{marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>💡 Share Your Business Idea</div>
        <div style={{fontSize:13,color:C.muted}}>Post your idea in text, images, or video. Get feedback, find co-founders, attract early investors.</div>
      </Card>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[{n:"🌾 Smart Irrigation App",u:"Farmer Hassan, Morogoro",l:"🗓️ Posted 3 days ago",d:"AI-powered drip irrigation controller for small farms. Reduces water usage by 60%. Need TSh 5M seed funding.",votes:42,comments:18,tag:"Agriculture"},{n:"🚌 Boda Boda Insurance Pool",u:"Youth Group, Dar es Salaam",l:"🗓️ Posted 1 week ago",d:"Cooperative micro-insurance pool for 1000 boda boda riders. Daily TSh 500 premium covers accidents & theft.",votes:87,comments:34,tag:"Insurance"},{n:"🏪 Township E-Commerce",u:"Mama Rosa, Mwanza",l:"🗓️ Posted 2 days ago",d:"WhatsApp-based ordering system for local township markets. Already 200 active customers in pilot phase.",votes:63,comments:22,tag:"Retail"},{n:"📚 Kiswahili EdTech",u:"Teachers Collective, Dodoma",l:"🗓️ Posted 5 days ago",d:"Interactive Kiswahili learning app for primary schools. Curriculum-aligned. 50 schools ready to adopt.",votes:94,comments:41,tag:"Education"}].map((idea,i)=><Card key={i} C={C} ch onClick={()=>{}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
            <Tag C={C} cl={C.purple} sm>{idea.tag}</Tag>
            <span style={{fontSize:11,color:C.muted}}>{idea.l}</span>
          </div>
          <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4,fontFamily:"Syne,sans-serif"}}>{idea.n}</div>
          <div style={{fontSize:12,color:C.accent,fontWeight:600,marginBottom:8}}>by {idea.u}</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:12}}>{idea.d}</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Btn C={C} sm v="g">👍 {idea.votes}</Btn>
            <Btn C={C} sm v="g">💬 {idea.comments}</Btn>
            <Btn C={C} sm>💰 Invest</Btn>
          </div>
        </Card>)}
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════ LIVE MARKETPLACE ════════════════════════════
function Market({C,balance,setBalance}){
  const [cart,setCart]=useState([]);const [cat,setCat]=useState("All");const [search,setSearch]=useState("");
  const [checkout,setCheckout]=useState(false);const [done,setDone]=useState(false);const [mpesa,setMpesa]=useState("");const [ld,setLd]=useState(false);
  const [listModal,setListModal]=useState(false);const [newL,setNewL]=useState({name:"",price:"",cat:"",stock:"",desc:""});
  const [listings,setListings]=useState([
    {id:1,name:"Fresh Organic Tomatoes 1kg",seller:"Mama Amina",price:3500,cat:"🌽 Agriculture",loc:"Kariakoo",rating:4.9,stock:45,hot:true,img:"🍅",desc:"Certified organic, picked daily from Kilosa farms"},
    {id:2,name:"Handwoven Wicker Basket",seller:"Zanzibar Crafts Co.",price:25000,cat:"🎨 Crafts",loc:"Zanzibar",rating:4.9,stock:12,hot:false,img:"🧺",desc:"Traditional Swahili weaving, fair trade certified"},
    {id:3,name:"Solar LED Lamp 20W",seller:"GreenTech Tanzania",price:48000,cat:"💡 Electronics",loc:"Dar es Salaam",rating:4.7,stock:8,hot:true,img:"💡",desc:"8hr battery backup, ideal for off-grid areas"},
    {id:4,name:"Kitenge Tailored Dress",seller:"Mrembo Fashion House",price:80000,cat:"👗 Fashion",loc:"Mwanza",rating:4.9,stock:5,hot:false,img:"👗",desc:"Custom tailored, 3-day delivery anywhere in TZ"},
    {id:5,name:"Raw Forest Honey 500g",seller:"Kilosa Bee Farms",price:18000,cat:"🌿 Natural",loc:"Kilosa",rating:5.0,stock:30,hot:true,img:"🍯",desc:"Unprocessed, tested & certified natural honey"},
    {id:6,name:"Makonde Ebony Carving",seller:"Makonde Masters Guild",price:150000,cat:"🎨 Crafts",loc:"Mtwara",rating:4.9,stock:3,hot:false,img:"🗿",desc:"Authentic hand-carved Makonde art, export quality"},
    {id:7,name:"Fresh Tilapia (Sato) 1kg",seller:"Lake Victoria Fisheries",price:8000,cat:"🐟 Food",loc:"Mwanza",rating:4.7,stock:60,hot:true,img:"🐟",desc:"Freshly caught, iced and delivered same day"},
    {id:8,name:"Jua Kali Charcoal Jiko",seller:"Kariakoo Hardware",price:15000,cat:"🏠 Hardware",loc:"Dar es Salaam",rating:4.5,stock:20,hot:false,img:"🔥",desc:"Fuel-efficient design, 40% less charcoal usage"},
    {id:9,name:"Maize Flour 10kg Bulk",seller:"Grain Direct TZ",price:28000,cat:"🌽 Agriculture",loc:"Dodoma",rating:4.6,stock:200,hot:false,img:"🌽",desc:"Wholesale direct from farm, fortified with vitamins"},
    {id:10,name:"Android Smartphone 4G",seller:"Tech Bazaar Dar",price:280000,cat:"💡 Electronics",loc:"Dar es Salaam",rating:4.4,stock:15,hot:true,img:"📱",desc:"Brand new, 2yr warranty, M-Pesa payment accepted"},
    {id:11,name:"Batik Print Fabric 6yds",seller:"Karibu Textiles",price:35000,cat:"👗 Fashion",loc:"Arusha",rating:4.8,stock:40,hot:false,img:"🧣",desc:"Premium wax-print, 100% cotton, colourfast"},
    {id:12,name:"Avocado Bulk 10kg",seller:"Rungwe Farms TZ",price:22000,cat:"🌿 Natural",loc:"Mbeya",rating:4.9,stock:80,hot:true,img:"🥑",desc:"Export grade, Hass variety, organic certified"},
  ]);
  const cats=["All","🌽 Agriculture","🎨 Crafts","💡 Electronics","👗 Fashion","🐟 Food","🌿 Natural","🏠 Hardware"];
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const filtered=listings.filter(p=>(cat==="All"||p.cat===cat)&&(!search||p.name.toLowerCase().includes(search.toLowerCase())||p.seller.toLowerCase().includes(search.toLowerCase())));
  const addCart=p=>setCart(c=>{const ex=c.find(x=>x.id===p.id);return ex?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}];});
  const submitList=()=>{
    if(!newL.name||!newL.price)return;
    setListings(l=>[...l,{id:Date.now(),name:newL.name,seller:"Your Business",price:parseInt(newL.price)||0,cat:newL.cat||"🌿 Natural",loc:"Your Location",rating:5.0,stock:parseInt(newL.stock)||10,hot:false,img:"📦",desc:newL.desc||"Quality product"}]);
    setListModal(false);setNewL({name:"",price:"",cat:"",stock:"",desc:""});
  };
  const pay=()=>{
    if(!mpesa.trim())return;
    setLd(true);
    setTimeout(()=>{setBalance(b=>Math.max(0,b-total));setDone(true);setLd(false);},1800);
  };
  return <div>
    <PHdr C={C} tl="🛒 Live Marketplace" sub="Buy · Sell · Pay via Mobile Money · All of Tanzania" act={<div style={{display:"flex",gap:10,alignItems:"center"}}>{cart.length>0&&<Btn C={C} v="gold" sm on={()=>setCheckout(true)} ic="🛒">Cart ({cart.length}) · {fmt(total)}</Btn>}<Btn C={C} sm on={()=>setListModal(true)} ic="➕">List Product</Btn></div>}/>
    {checkout&&<Modal C={C} tl="🛒 Checkout — Mobile Money" onCl={()=>{setCheckout(false);setDone(false);}}>
      {!done?<>
        <div style={{maxHeight:200,overflowY:"auto",marginBottom:14}}>
          {cart.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22}}>{item.img}</span><div><div style={{fontWeight:700,color:C.text}}>{item.name}</div><div style={{color:C.muted}}>x{item.qty} · by {item.seller}</div></div></div>
            <div style={{color:C.accent,fontWeight:800,fontFamily:"JetBrains Mono,monospace"}}>{fmt(item.price*item.qty)}</div>
          </div>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:16,fontWeight:900,borderTop:`2px solid ${C.border}`,marginBottom:16}}>
          <span style={{color:C.text}}>Total</span><span style={{color:C.accent,fontFamily:"JetBrains Mono,monospace"}}>{fmt(total)}</span>
        </div>
        <Lbl C={C} req>Select Payment Method</Lbl>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{["M-Pesa","Airtel Money","HaloPesa","Panda Wallet"].map(p=><button key={p} onClick={()=>setMpesa(p)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${mpesa===p?C.accent:C.border}`,background:mpesa===p?`${C.accent}14`:C.surface,color:mpesa===p?C.accent:C.muted,fontSize:12,fontWeight:mpesa===p?700:400,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{p}</button>)}</div>
        <div style={{display:"flex",gap:10}}><Btn C={C} v="g" fu on={()=>setCheckout(false)}>Cancel</Btn><Btn C={C} fu on={pay} ld={ld}>{ld?"Processing...":"Pay Now 💳"}</Btn></div>
      </>:<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:70,marginBottom:12,animation:"zoomIn 0.4s ease"}}>✅</div>
        <div style={{fontSize:18,fontWeight:900,color:C.accent,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Payment Successful!</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Paid {fmt(total)} via {mpesa}. Sellers notified. Expected delivery: 1-3 days.</div>
        <Btn C={C} fu on={()=>{setCheckout(false);setCart([]);setDone(false);}}>Done 🎉</Btn>
      </div>}
    </Modal>}
    {listModal&&<Modal C={C} tl="➕ List Your Product" onCl={()=>setListModal(false)}>
      <Lbl C={C} req>Product Name</Lbl><FInp C={C} val={newL.name} on={v=>setNewL(f=>({...f,name:v}))} ph="e.g. Fresh Tomatoes 1kg" ic="📦"/>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><Lbl C={C} req>Price (TSh)</Lbl><FInp C={C} val={newL.price} on={v=>setNewL(f=>({...f,price:v}))} ph="3500" ic="💰"/></div>
        <div><Lbl C={C} req>Stock (units)</Lbl><FInp C={C} val={newL.stock} on={v=>setNewL(f=>({...f,stock:v}))} ph="50" ic="📦"/></div>
      </div>
      <Lbl C={C} req>Category</Lbl>
      <select value={newL.cat} onChange={e=>setNewL(f=>({...f,cat:e.target.value}))} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none",marginBottom:14}}><option value="">Select...</option>{cats.slice(1).map(c=><option key={c}>{c}</option>)}</select>
      <Lbl C={C}>Product Description</Lbl><FInp C={C} val={newL.desc} on={v=>setNewL(f=>({...f,desc:v}))} ph="Describe your product..." ml rows={3}/>
      <div style={{display:"flex",gap:10}}><Btn C={C} v="g" fu on={()=>setListModal(false)}>Cancel</Btn><Btn C={C} fu on={submitList}>List Now ✓</Btn></div>
    </Modal>}
    <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{position:"relative",flex:1,minWidth:200}}><span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, sellers..." style={{width:"100%",padding:"10px 14px 10px 38px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none"}}/></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"7px 14px",borderRadius:99,border:`1px solid ${cat===c?C.accent:C.border}`,background:cat===c?`${C.accent}14`:C.surface,color:cat===c?C.accent:C.muted,fontSize:11,fontWeight:cat===c?700:400,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{c}</button>)}</div>
    </div>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {filtered.map((p,i)=><div key={p.id} className="mc" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18,cursor:"pointer",transition:"all 0.25s",animation:`fadeUp 0.4s ease ${i*0.05}s both`,position:"relative",boxShadow:`0 4px 20px rgba(0,0,0,0.1)`}}>
        {p.hot&&<div style={{position:"absolute",top:12,right:12,background:"linear-gradient(135deg,#FF3860,#FF8C00)",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:99,letterSpacing:0.5}}>🔥 HOT</div>}
        <div style={{fontSize:48,marginBottom:10,textAlign:"center",filter:`drop-shadow(0 4px 12px rgba(0,0,0,0.2))`}}>{p.img}</div>
        <div style={{marginBottom:8}}><Tag C={C} cl={C.muted} sm>{p.cat}</Tag></div>
        <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:4,lineHeight:1.3,fontFamily:"Syne,sans-serif"}}>{p.name}</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:2}}>by {p.seller}</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>📍 {p.loc} · ⭐ {p.rating}</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:10,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.desc}</div>
        <div style={{fontSize:20,fontWeight:900,color:C.accent,marginBottom:12,fontFamily:"JetBrains Mono,monospace"}}>{fmt(p.price)}</div>
        <Btn C={C} fu sm on={()=>addCart(p)} ic="🛒">Add to Cart</Btn>
        <div style={{fontSize:10,color:C.muted,marginTop:7}}>📦 {p.stock} in stock · Mobile money accepted</div>
      </div>)}
    </div>
  </div>;
}

// ═════════════════════════ REMAINING SCREENS (compact) ═══════════════════════
function Savings({C}){
  const [goals,setGoals]=useState([
    {id:1,icon:"🏠",label:"House",target:50000000,saved:31000000,monthly:500000,color:"#00D4AA"},{id:2,icon:"🎓",label:"Education",target:10000000,saved:4000000,monthly:200000,color:"#FFD700"},
    {id:3,icon:"🚜",label:"Farm Equipment",target:8000000,saved:2000000,monthly:150000,color:"#A78BFA"},{id:4,icon:"🚗",label:"Vehicle",target:25000000,saved:3500000,monthly:300000,color:"#38BDF8"},
    {id:5,icon:"🆘",label:"Emergency Fund",target:5000000,saved:4200000,monthly:100000,color:"#34D399"},{id:6,icon:"🏢",label:"Business",target:20000000,saved:4800000,monthly:400000,color:"#FB923C"},
  ]);
  const [modal,setModal]=useState(false);const [ng,setNg]=useState({icon:"🎯",label:"",target:"",monthly:""});
  const total=goals.reduce((s,g)=>s+g.saved,0);
  return <div>
    <PHdr C={C} tl="🐼 Smart Savings" sub="AI-powered goal savings & automation" act={<Btn C={C} on={()=>setModal(true)} ic="➕">New Goal</Btn>}/>
    {modal&&<Modal C={C} tl="✨ Create Savings Goal" onCl={()=>setModal(false)}>
      <Lbl C={C}>Icon</Lbl><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{["🏠","🚗","🎓","✈️","💍","🏢","🌾","📱","🎯","💊","⛵","🏖️"].map(e=><div key={e} onClick={()=>setNg(g=>({...g,icon:e}))} style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`2px solid ${ng.icon===e?C.accent:C.border}`,cursor:"pointer",background:ng.icon===e?`${C.accent}14`:C.surface,transition:"all 0.2s"}}>{e}</div>)}</div>
      <Lbl C={C} req>Goal Name</Lbl><FInp C={C} val={ng.label} on={v=>setNg(g=>({...g,label:v}))} ph="e.g. Family Home" ic="🏷️"/>
      <Lbl C={C} req>Target Amount (TSh)</Lbl><FInp C={C} val={ng.target} on={v=>setNg(g=>({...g,target:v}))} ph="50000000" ic="💰"/>
      <Lbl C={C}>Monthly Contribution</Lbl><FInp C={C} val={ng.monthly} on={v=>setNg(g=>({...g,monthly:v}))} ph="500000" ic="📅"/>
      <Btn C={C} fu on={()=>{if(!ng.label||!ng.target)return;setGoals(gs=>[...gs,{id:Date.now(),icon:ng.icon,label:ng.label,target:parseInt(ng.target)||0,saved:0,monthly:parseInt(ng.monthly)||0,color:C.accent}]);setModal(false);setNg({icon:"🎯",label:"",target:"",monthly:""});}}>Create Goal ✨</Btn>
    </Modal>}
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
      <SC C={C} ic="⚡" lb="Auto-Save Rate" val="10%" cl={C.accent} sub="Per transaction"/>
      <SC C={C} ic="💰" lb="Total Saved" val={`TSh ${(total/1000000).toFixed(1)}M`} cl={C.gold} sub={`${goals.length} active goals`}/>
      <Card C={C} ac st={{padding:20}}><div style={{fontSize:12,color:C.muted,marginBottom:6,fontWeight:600}}>🤖 AI Tip</div><div style={{fontSize:13,color:C.text,lineHeight:1.7}}>Emergency Fund only <strong style={{color:C.danger}}>16% from target</strong>. Boost by TSh 50K/month!</div></Card>
    </div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
      {goals.map((g,i)=>{const pct=Math.min(Math.round((g.saved/g.target)*100),100);const mo=g.monthly>0?Math.ceil((g.target-g.saved)/g.monthly):null;return <Card key={g.id} C={C} st={{animation:`fadeUp 0.5s ease ${i*0.06}s both`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:46,height:46,borderRadius:13,background:`${g.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{g.icon}</div><div><div style={{fontWeight:800,fontSize:14,color:C.text,fontFamily:"Syne,sans-serif"}}>{g.label}</div>{mo&&<div style={{fontSize:11,color:C.muted}}>~{mo} months left</div>}</div></div>
          <Tag C={C} cl={pct>=90?C.green:pct>=50?g.color:C.muted}>{pct}%</Tag>
        </div>
        <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{fmt(g.saved)} of {fmt(g.target)}</div>
        <Prg C={C} pct={pct} cl={g.color}/>
        <div style={{marginTop:12}}><Btn C={C} sm fu>Add Funds +</Btn></div>
      </Card>;})}
    </div>
  </div>;
}

function Credit({C}){
  const score=742;
  const factors=[{lb:"Mobile Money Activity",sc:185,mx:200,ic:"📱",cl:C.accent},{lb:"Savings Behavior",sc:162,mx:200,ic:"🐼",cl:C.gold},{lb:"Business Revenue",sc:148,mx:200,ic:"📈",cl:C.purple},{lb:"Loan Repayment History",sc:140,mx:200,ic:"🏦",cl:C.blue},{lb:"Cash Flow Consistency",sc:107,mx:200,ic:"💹",cl:C.green}];
  const hist=[{m:"Jan",s:698},{m:"Feb",s:710},{m:"Mar",s:718},{m:"Apr",s:725},{m:"May",s:735},{m:"Jun",s:742}];
  const max=Math.max(...hist.map(h=>h.s));const min=Math.min(...hist.map(h=>h.s));
  return <div>
    <PHdr C={C} tl="📊 AI Credit Score" sub="Your financial trustworthiness · Updated daily by AI"/>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1.7fr",gap:18,marginBottom:16}}>
      <Card C={C} ac st={{textAlign:"center"}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:20,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>Panda Credit Score™</div>
        <div style={{width:180,height:180,borderRadius:"50%",border:`10px solid ${C.accent}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",animation:"glow 3s ease-in-out infinite",background:`radial-gradient(circle,${C.accent}14,transparent)`}}>
          <div style={{fontSize:52,fontWeight:900,color:C.accent,lineHeight:1,fontFamily:"JetBrains Mono,monospace"}}>{score}</div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>out of 1000</div>
        </div>
        <Tag C={C} cl={C.green}>⭐ EXCELLENT</Tag>
        <Prg C={C} pct={(score/1000)*100}/>
        <div style={{fontSize:11,color:C.muted,marginTop:14,lineHeight:1.8}}>Top 15% of all users<br/>+15 points this month</div>
        <div style={{marginTop:12,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}><Tag C={C} cl={C.purple} sm>KYC ✓</Tag><Tag C={C} cl={C.blue} sm>M-Pesa ✓</Tag><Tag C={C} cl={C.green} sm>NMB ✓</Tag></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:16,color:C.text,fontFamily:"Syne,sans-serif"}}>Score Breakdown</div>
          {factors.map((f,i)=><div key={f.lb} style={{marginBottom:14,animation:`fadeUp 0.5s ease ${i*0.07}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,marginBottom:5}}><span style={{color:C.text,display:"flex",gap:8,alignItems:"center"}}><span>{f.ic}</span>{f.lb}</span><span style={{color:f.cl,fontWeight:800,fontFamily:"JetBrains Mono,monospace"}}>{f.sc}<span style={{color:C.muted,fontWeight:400}}>/{f.mx}</span></span></div>
            <Prg C={C} pct={(f.sc/f.mx)*100} cl={f.cl}/>
          </div>)}
        </Card>
        <Card C={C} st={{padding:18}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:C.text,fontFamily:"Syne,sans-serif"}}>📈 Score History (6 months)</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:70}}>
            {hist.map((h,i)=><div key={h.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",background:`${C.accent}99`,borderRadius:"4px 4px 0 0",height:`${((h.s-min+30)/(max-min+30))*100}%`,minHeight:8,transition:"height 1s ease",position:"relative"}}>
                {i===hist.length-1&&<div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",fontSize:10,color:C.accent,fontWeight:700,whiteSpace:"nowrap"}}>{h.s}</div>}
              </div>
              <div style={{fontSize:10,color:C.muted}}>{h.m}</div>
            </div>)}
          </div>
        </Card>
      </div>
    </div>
    <Card C={C} ac>
      <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>🤖 AI Tips to Improve Your Score</div>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {["Pay loan installments 3+ days early — boosts repayment score by up to 12 points.","Keep TSh 200K+ in savings consistently for 90 days to raise savings score.","Use mobile money for 80%+ of business transactions to improve activity tracking.","File VAT returns on time every quarter to strengthen compliance score."].map((t,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 12px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,fontSize:12,color:C.text,lineHeight:1.6}}><span style={{color:C.accent,flexShrink:0,fontWeight:900,fontSize:14}}>0{i+1}</span>{t}</div>)}
      </div>
    </Card>
  </div>;
}

function Books({C}){
  const [recs,setRecs]=useState([{tp:"Sale",desc:"Market Sales — Goods",amt:"+450,000",date:"Today"},{tp:"Expense",desc:"Stock Purchase",amt:"-180,000",date:"Today"},{tp:"Sale",desc:"Online Order",amt:"+95,000",date:"Yesterday"},{tp:"Expense",desc:"Transport",amt:"-35,000",date:"Yesterday"},{tp:"Sale",desc:"Wholesale Deal",amt:"+820,000",date:"Jun 1"},{tp:"Expense",desc:"Salaries",amt:"-650,000",date:"Jun 1"}]);
  return <div>
    <PHdr C={C} tl="📒 AI Bookkeeping" sub="Automated accounting · Kiswahili & English · TRA-ready" act={<div style={{display:"flex",gap:10}}><Btn C={C} v="g" sm>📤 Export PDF</Btn><Btn C={C} sm ic="➕">Add Entry</Btn></div>}/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      <SC C={C} ic="📈" lb="Total Revenue" val="TSh 8.4M" cl={C.accent} sub="+22% vs last month"/>
      <SC C={C} ic="📉" lb="Total Expenses" val="TSh 3.1M" cl={C.danger} sub="-8% vs last month"/>
      <SC C={C} ic="💰" lb="Net Profit" val="TSh 5.3M" cl={C.gold} sub="63% margin · Excellent"/>
    </div>
    <Card C={C}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Type","Description","Date","Amount (TSh)"].map(h=><th key={h} style={{textAlign:"left",fontSize:10,color:C.muted,padding:"8px 10px",textTransform:"uppercase",letterSpacing:1.2,borderBottom:`1px solid ${C.border}`,fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>{recs.map((r,i)=><tr key={i}><td style={{padding:"11px 10px"}}><Tag C={C} cl={r.tp==="Sale"?C.accent:C.danger} sm>{r.tp}</Tag></td><td style={{padding:"11px 10px",fontSize:13,color:C.text,fontWeight:600}}>{r.desc}</td><td style={{padding:"11px 10px",fontSize:12,color:C.muted}}>{r.date}</td><td style={{padding:"11px 10px",fontSize:13,fontWeight:800,color:r.tp==="Sale"?C.accent:C.danger,fontFamily:"JetBrains Mono,monospace"}}>{r.amt}</td></tr>)}</tbody>
      </table>
    </Card>
  </div>;
}

function CashFlow({C}){
  const mo=["Jan","Feb","Mar","Apr","May","Jun"];const inc=[3200,4100,3800,5200,4700,6100];const exp=[1800,2100,2000,2800,2400,2900];const mx=Math.max(...inc);
  return <div>
    <PHdr C={C} tl="💹 Cash Flow" sub="AI detects leaks, opportunities & anomalies in real-time"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      <SC C={C} ic="📈" lb="Monthly Income" val="TSh 6.1M" cl={C.accent} sub="+29% vs last month"/>
      <SC C={C} ic="📉" lb="Monthly Expenses" val="TSh 2.9M" cl={C.danger} sub="-12% vs last month"/>
      <SC C={C} ic="💰" lb="Net Cash Flow" val="TSh 3.2M" cl={C.gold} sub="Strongest ever!"/>
    </div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
      <Card C={C}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:18,color:C.text,fontFamily:"Syne,sans-serif"}}>6-Month Cash Flow Overview</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,height:160}}>
          {mo.map((m,i)=><div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:130}}>
              <div style={{flex:1,background:`${C.accent}CC`,borderRadius:"4px 4px 0 0",height:`${(inc[i]/mx)*100}%`,transition:"height 1.2s ease"}}/>
              <div style={{flex:1,background:`${C.danger}CC`,borderRadius:"4px 4px 0 0",height:`${(exp[i]/mx)*100}%`,transition:"height 1.2s ease"}}/>
            </div>
            <div style={{fontSize:10,color:C.muted}}>{m}</div>
          </div>)}
        </div>
        <div style={{display:"flex",gap:16,marginTop:12,fontSize:12,color:C.muted}}>
          <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:C.accent,borderRadius:2}}/>Income</span>
          <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:C.danger,borderRadius:2}}/>Expenses</span>
        </div>
      </Card>
      <Card C={C} ac>
        <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>🤖 AI Leak Detection</div>
        {["Transport costs 18% above industry average — review vendor contracts","Weekend sales underperforming by 22% — run Saturday promotions","Inventory holding cost too high — reduce maize flour reorder qty by 30%","Cash tied up in AR for 45+ days — enforce payment terms"].map((r,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:12,color:C.text,lineHeight:1.6}}><span style={{color:C.warn,flexShrink:0}}>⚡</span>{r}</div>)}
      </Card>
    </div>
  </div>;
}

function Analytics({C}){
  return <div>
    <PHdr C={C} tl="📈 Business Analytics" sub="AI-powered real-time business intelligence"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      <SC C={C} ic="❤️" lb="Business Health Score" val="84/100" cl={C.green} sub="Top 20% · Improving"/>
      <SC C={C} ic="💹" lb="Profit Margin" val="63%" cl={C.gold} sub="+8% vs last quarter"/>
      <SC C={C} ic="📈" lb="Revenue Growth MoM" val="+22%" cl={C.accent} sub="Consistent 6 months"/>
    </div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Card C={C}>
        <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:14,fontFamily:"Syne,sans-serif"}}>🤖 AI Business Recommendations</div>
        {["Agriculture is your best-selling category — increase stock by 30% before rainy season.","Friday revenue is 34% higher. Schedule major promotions for Thursday–Friday.","Returning customers spend 2.3x more. Launch a Panda loyalty card program.","3 products account for 65% of revenue — protect supply chain for these items.","Social media referrals growing 40% MoM — double down on WhatsApp marketing."].map((r,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`,alignItems:"flex-start"}}><Tag C={C} cl={C.accent} sm>💡</Tag><div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{r}</div></div>)}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>Top Revenue Sources</div>{[["Market Sales",68,C.accent],["Online Orders",19,C.gold],["Wholesale",13,C.purple]].map(([l,p,cl])=><div key={l} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:C.text,fontWeight:600}}>{l}</span><span style={{color:cl,fontWeight:800}}>{p}%</span></div><Prg C={C} pct={p} cl={cl}/></div>)}</Card>
        <Card C={C} gold><div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10,fontFamily:"Syne,sans-serif"}}>🏆 Performance Awards</div>{["📈 Revenue Growth Champion — June 2026","🐼 Panda Loyalty Partner — Top 10%","🌍 East Africa Ready — Certified"].map(a=><div key={a} style={{fontSize:12,color:C.text,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>{a}</div>)}</Card>
      </div>
    </div>
  </div>;
}

function Loans({C,balance,setBalance}){
  const [modal,setModal]=useState(null);const [done,setDone]=useState(false);const [ld,setLd]=useState(false);
  const offers=[{lender:"NMB Bank",amount:5000000,rate:"12% p.a.",term:"12 mo",score:"Good",cl:C.blue},{lender:"CRDB SACCOS",amount:2000000,rate:"9% p.a.",term:"6 mo",score:"Excellent",cl:C.green},{lender:"Selcom Fintech",amount:500000,rate:"15% p.a.",term:"3 mo",score:"Good",cl:C.purple},{lender:"Panda Micro ⭐",amount:250000,rate:"7% p.a.",term:"1 mo",score:"Best Match",cl:C.gold}];
  return <div>
    <PHdr C={C} tl="🏦 Microloan Market" sub="AI-matched loans · Best rates · Instant approval"/>
    {modal&&<Modal C={C} tl={`Apply — ${modal.lender}`} onCl={()=>{setModal(null);setDone(false);}}>
      {!done?<>
        <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:16}}>
          {[["Amount",fmt(modal.amount)],["Rate",modal.rate],["Term",modal.term],["Score Required",modal.score]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13,borderBottom:`1px solid ${C.border}`}}><span style={{color:C.muted}}>{k}</span><span style={{color:C.text,fontWeight:700}}>{v}</span></div>)}
        </div>
        <div style={{fontSize:13,color:C.muted,marginBottom:16,lineHeight:1.7}}>Your credit score of <strong style={{color:C.accent}}>742</strong> qualifies you for this loan. Funds will be disbursed to your Panda Wallet within 24 hours.</div>
        <div style={{display:"flex",gap:10}}><Btn C={C} v="g" fu on={()=>setModal(null)}>Cancel</Btn><Btn C={C} fu on={()=>{setLd(true);setTimeout(()=>{setBalance(b=>b+modal.amount);setDone(true);setLd(false);},1800);}} ld={ld}>{ld?"Processing...":"Apply Now ✓"}</Btn></div>
      </>:<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:70,marginBottom:16,animation:"zoomIn 0.4s ease"}}>🎉</div>
        <div style={{fontSize:20,fontWeight:900,color:C.accent,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Loan Approved!</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:24}}>{fmt(modal.amount)} disbursed to your Panda Wallet from {modal.lender}</div>
        <Btn C={C} fu on={()=>{setModal(null);setDone(false);}}>Done ✓</Btn>
      </div>}
    </Modal>}
    <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
      {offers.map((o,i)=><Card key={o.lender} C={C} ac={o.score==="Best Match"} st={{animation:`fadeUp 0.4s ease ${i*0.08}s both`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontWeight:800,fontSize:15,color:C.text,fontFamily:"Syne,sans-serif"}}>{o.lender}</div><Tag C={C} cl={o.cl}>{o.score}</Tag></div>
        <div style={{fontSize:28,fontWeight:900,color:C.accent,letterSpacing:-1,fontFamily:"JetBrains Mono,monospace",marginBottom:10}}>{fmt(o.amount)}</div>
        <div style={{display:"flex",gap:14,marginBottom:14,fontSize:12,color:C.muted}}><span>📅 {o.term}</span><span>📊 {o.rate}</span></div>
        <Btn C={C} fu on={()=>{setModal(o);setDone(false);}}>Apply Now →</Btn>
      </Card>)}
    </div>
  </div>;
}

function Insurance({C}){
  const products=[{ic:"🌾",n:"Crop Insurance",d:"Drought, floods, crop failure",p:"TSh 15K/season",color:C.green},{ic:"🐄",n:"Livestock Insurance",d:"Disease, theft, accidental death",p:"TSh 22K/yr",color:C.gold},{ic:"❤️",n:"Health Insurance",d:"Full medical cover for family",p:"TSh 45K/yr",color:C.pink},{ic:"🏢",n:"Business Insurance",d:"Assets, stock & liability cover",p:"TSh 60K/yr",color:C.blue}];
  return <div>
    <PHdr C={C} tl="🛡️ Insurance Center" sub="Affordable protection for every Tanzanian · Instant claims"/>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
      {products.map((p,i)=><Card key={p.n} C={C} st={{animation:`fadeUp 0.4s ease ${i*0.07}s both`}}>
        <div style={{fontSize:40,marginBottom:12}}>{p.ic}</div>
        <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>{p.n}</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.6}}>{p.d}</div>
        <Tag C={C} cl={p.color}>{p.p}</Tag>
        <div style={{marginTop:14}}><Btn C={C}>Get Covered ✓</Btn></div>
      </Card>)}
    </div>
  </div>;
}

function Tax({C}){
  return <div>
    <PHdr C={C} tl="🧾 Tax Assistant" sub="TRA-integrated · Auto tax tracking · Filing reminders" act={<Btn C={C}>Generate TRA Report</Btn>}/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      <SC C={C} ic="💰" lb="Annual Revenue" val="TSh 84M" cl={C.accent}/>
      <SC C={C} ic="📋" lb="Tax Obligations" val="TSh 12.6M" cl={C.danger} sub="FY2026 estimate"/>
      <SC C={C} ic="✅" lb="Paid to TRA" val="TSh 8.4M" cl={C.green} sub="TSh 4.2M remaining"/>
    </div>
    <Card C={C}>
      <div style={{fontSize:14,fontWeight:800,marginBottom:14,color:C.text,fontFamily:"Syne,sans-serif"}}>📅 Tax Calendar & Deadlines</div>
      {[{e:"VAT Filing (Monthly)",d:"June 20, 2026",s:"Urgent",cl:C.danger},{e:"Income Tax Quarterly",d:"July 1, 2026",s:"Upcoming",cl:C.warn},{e:"PAYE Monthly Submission",d:"June 30, 2026",s:"Upcoming",cl:C.warn},{e:"Corporate Tax Annual",d:"June 30, 2026",s:"Upcoming",cl:C.gold},{e:"Withholding Tax",d:"July 7, 2026",s:"Pending",cl:C.muted}].map(r=><div key={r.e} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
        <div><div style={{fontWeight:700,color:C.text,fontSize:13}}>{r.e}</div><div style={{fontSize:12,color:C.muted}}>{r.d}</div></div>
        <Tag C={C} cl={r.cl} sm>{r.s}</Tag>
      </div>)}
    </Card>
  </div>;
}

function Farmer({C}){
  const services=[{ic:"🌽",n:"Crop Loans",d:"Financing for harvest season, pay after sale"},{ic:"🌱",n:"Seed Financing",d:"Quality certified seeds, deferred payment"},{ic:"💊",n:"Fertilizer Finance",d:"Buy inputs now, repay after harvest"},{ic:"🚜",n:"Equipment Finance",d:"Lease or buy tractors, irrigation systems"},{ic:"☔",n:"Weather Insurance",d:"Drought, flood and crop failure protection"},{ic:"🛒",n:"Market Access Hub",d:"Connect directly with buyers at fair prices"}];
  return <div>
    <PHdr C={C} tl="🌾 Farmer Hub" sub="Complete financial ecosystem for Tanzania's 15M+ farmers"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {services.map((s,i)=><Card key={s.n} C={C} st={{animation:`fadeUp 0.4s ease ${i*0.07}s both`}}>
        <div style={{fontSize:34,marginBottom:10}}>{s.ic}</div>
        <div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>{s.n}</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.6}}>{s.d}</div>
        <Btn C={C} sm fu>Apply Now →</Btn>
      </Card>)}
    </div>
  </div>;
}

function Vikoba({C}){
  const groups=[{n:"Mama Lishe Group",mb:12,b:4800000,cy:"Monthly",prog:68},{n:"Youth Entrepreneurs TZ",mb:20,b:12000000,cy:"Weekly",prog:45},{n:"Kilimo Savings Circle",mb:8,b:2100000,cy:"Monthly",prog:82}];
  return <div>
    <PHdr C={C} tl="👥 Vikoba" sub="Digital community savings, lending & investment groups" act={<Btn C={C} ic="➕">Create Group</Btn>}/>
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {groups.map((g,i)=><Card key={g.n} C={C} st={{animation:`fadeUp 0.4s ease ${i*0.09}s both`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div><div style={{fontWeight:800,fontSize:16,color:C.text,fontFamily:"Syne,sans-serif"}}>{g.n}</div><div style={{fontSize:13,color:C.muted,marginTop:4}}>👥 {g.mb} members · 🔄 {g.cy} cycle</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:900,color:C.accent,fontFamily:"JetBrains Mono,monospace"}}>{fmt(g.b)}</div><div style={{fontSize:11,color:C.muted}}>Group Balance</div></div>
        </div>
        <div style={{margin:"12px 0 4px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3,color:C.muted}}><span>Cycle Progress</span><span style={{color:C.accent,fontWeight:700}}>{g.prog}%</span></div><Prg C={C} pct={g.prog}/></div>
        <div style={{height:1,background:C.border,margin:"14px 0"}}/>
        <div style={{display:"flex",gap:10}}><Btn C={C} v="g" sm>View Details</Btn><Btn C={C} sm>Contribute 💰</Btn><Btn C={C} v="g" sm>Request Loan</Btn></div>
      </Card>)}
    </div>
  </div>;
}

function Edu({C}){
  const courses=[{ic:"💰",tl:"Misingi ya Akiba",sub:"Savings Fundamentals",lg:"🇹🇿",ls:8,prog:65},{ic:"📈",tl:"Kuwekeza kwa Busara",sub:"Smart Investing",lg:"🇹🇿",ls:12,prog:0},{ic:"📊",tl:"Business Budgeting 101",sub:"For SME Owners",lg:"🇬🇧",ls:10,prog:30},{ic:"🌾",tl:"Fedha kwa Wakulima",sub:"Finance for Farmers",lg:"🇹🇿",ls:6,prog:0},{ic:"🧾",tl:"Tax Management TZ",sub:"TRA & Compliance",lg:"🇬🇧",ls:5,prog:80},{ic:"🔒",tl:"Usalama wa Kidijitali",sub:"Digital Safety & Scams",lg:"🇹🇿",ls:7,prog:0},{ic:"📱",tl:"Mobile Money Mastery",sub:"M-Pesa Advanced",lg:"🇹🇿",ls:4,prog:100},{ic:"🌍",tl:"East Africa Trade",sub:"Cross-border Business",lg:"🇬🇧",ls:9,prog:15}];
  return <div>
    <PHdr C={C} tl="🎓 Financial Education" sub="Free courses in Kiswahili & English · AI-powered learning"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {courses.map((c,i)=><Card key={c.tl} C={C} st={{animation:`fadeUp 0.4s ease ${i*0.06}s both`}}>
        <div style={{fontSize:30,marginBottom:8}}>{c.ic}</div>
        <div style={{fontWeight:800,fontSize:14,color:C.text,fontFamily:"Syne,sans-serif"}}>{c.tl}</div>
        <div style={{fontSize:12,color:C.muted,margin:"4px 0 10px"}}>{c.sub}</div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}><Tag C={C} cl={C.muted} sm>{c.lg} · {c.ls} Lessons</Tag>{c.prog===100&&<Tag C={C} cl={C.green} sm>✅ Done</Tag>}{c.prog>0&&c.prog<100&&<Tag C={C} cl={C.accent} sm>{c.prog}%</Tag>}</div>
        {c.prog>0&&c.prog<100&&<Prg C={C} pct={c.prog} h={5}/>}
        <div style={{marginTop:12}}><Btn C={C} fu sm>{c.prog===100?"Review Again":c.prog>0?"Continue →":"Start Course"}</Btn></div>
      </Card>)}
    </div>
  </div>;
}

function Support({C}){
  const [tab,setTab]=useState("chat");
  const [msgs,setMsgs]=useState([{role:"ai",text:"Habari! 🆘 I'm your Panda Financial Support Advisor.\n\nI can help with:\n• 🚨 Emergency financial assistance\n• 💳 Debt counseling & restructuring\n• 🔐 Fraud & scam recovery\n• 🏦 Loan hardship programs\n• 📋 Government grants & subsidies\n• 📱 Mobile money disputes\n\nAre you in a financial emergency right now?"}]);
  const [inp,setInp]=useState("");const [ld,setLd]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,ld]);
  const send=async()=>{
    if(!inp.trim()||ld)return;
    const msg=inp;setInp("");setMsgs(m=>[...m,{role:"user",text:msg}]);setLd(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"You are a compassionate financial support advisor for Panda Finance Tanzania. Help people in financial difficulty — debt, fraud, crisis, mobile money disputes, emergency loans. Be empathetic, practical, give real help. Reference Tanzania-specific resources (TRA, BoT, TCRA, Tanzania Police). Support Kiswahili and English.",messages:[{role:"user",content:msg}]})});
      const data=await res.json();setMsgs(m=>[...m,{role:"ai",text:data.content?.[0]?.text||"Error."}]);
    }catch{setMsgs(m=>[...m,{role:"ai",text:"Connection error. Please try again."}]);}
    setLd(false);
  };
  return <div>
    <PHdr C={C} tl="🆘 Financial Help Center" sub="Emergency support · Debt counseling · Website building"/>
    <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
      {[["chat","💬 AI Support"],["resources","📋 Resources"],["website","🌐 Build Website"]].map(([t,l])=><button key={t} onClick={()=>setTab(t)} style={{padding:"9px 20px",borderRadius:10,border:`1px solid ${tab===t?C.accent:C.border}`,background:tab===t?`${C.accent}14`:C.surface,color:tab===t?C.accent:C.muted,fontWeight:tab===t?800:500,fontSize:13,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{l}</button>)}
    </div>
    {tab==="chat"&&<Card C={C} st={{display:"flex",flexDirection:"column",height:500}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}><div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?`linear-gradient(135deg,${C.danger},#FF8C00)`:C.surface,color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.75,border:m.role==="ai"?`1px solid ${C.border}`:"none",whiteSpace:"pre-wrap"}}>{m.text}</div></div>)}
        {ld&&<div style={{display:"flex"}}><div style={{padding:"12px 16px",background:C.surface,borderRadius:18,fontSize:13,color:C.muted,border:`1px solid ${C.border}`,animation:"pulse 1.2s ease infinite"}}>💬 Advisor thinking...</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",gap:10}}><input style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none"}} placeholder="Describe your financial situation..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><Btn C={C} v="d" on={send}>{ld?"...":"Send"}</Btn></div>
    </Card>}
    {tab==="resources"&&<div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
      {[{ic:"🏦",t:"Emergency Microloans",d:"Instant loans up to TSh 500K within 24hrs for emergencies.",a:"Apply Now"},{ic:"🛡️",t:"Fraud Recovery",d:"Report scams & fraudulent transactions. 48hr investigation.",a:"Report Fraud"},{ic:"💳",t:"Debt Restructuring",d:"Struggling with repayments? Negotiate new terms with advisors.",a:"Get Help"},{ic:"📋",t:"Government Grants",d:"Tanzania government SME grants and agricultural subsidies.",a:"View Grants"},{ic:"⚖️",t:"Free Legal Aid",d:"Free legal consultation for financial disputes and contracts.",a:"Consult"},{ic:"🤝",t:"Community Support",d:"Connect with Vikoba groups and peer lending communities.",a:"Join Now"}].map(r=><Card key={r.t} C={C}><div style={{fontSize:32,marginBottom:10}}>{r.ic}</div><div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>{r.t}</div><div style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.6}}>{r.d}</div><Btn C={C}>{r.a}</Btn></Card>)}
    </div>}
    {tab==="website"&&<div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card C={C} ac>
        <div style={{fontSize:44,marginBottom:14,animation:"floatSm 4s ease-in-out infinite"}}>🌐</div>
        <div style={{fontSize:21,fontWeight:900,color:C.text,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Get a Professional Website for Your Business</div>
        <div style={{fontSize:14,color:C.muted,lineHeight:1.95,marginBottom:20}}>Built by <strong style={{color:C.accent}}>BAK</strong> — Tanzania's leading web developer.<br/><br/>🚀 Fast, modern, mobile-first websites<br/>💳 M-Pesa & mobile money integration<br/>🛒 Online store & product catalog<br/>📊 Business dashboard & admin panel<br/>🌍 Kiswahili & English support<br/>⚡ Delivered in 7–14 business days</div>
        <div style={{background:C.surface,borderRadius:14,padding:16,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>Packages</div>
          {[["Basic Site","TSh 300,000","3 pages, mobile-ready, fast"],["Business Pro","TSh 600,000","Full site + M-Pesa + admin panel"],["E-Commerce","TSh 1,200,000","Online store + payments + analytics"]].map(([n,p,d])=><div key={n} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><div><div style={{fontWeight:700,color:C.text}}>{n}</div><div style={{color:C.muted,fontSize:11}}>{d}</div></div><div style={{color:C.accent,fontWeight:800,fontFamily:"JetBrains Mono,monospace"}}>{p}</div></div>)}
        </div>
        <a href="https://wa.me/255653426979?text=Hello%20BAK!%20I%20need%20a%20website%20for%20my%20business.%20I%20found%20you%20on%20Panda%20Finance." target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
          <Btn C={C} v="wa" fu ic="💬">WhatsApp BAK: +255 653 426 979</Btn>
        </a>
        <div style={{fontSize:11,color:C.muted,marginTop:10,textAlign:"center"}}>Tap to open WhatsApp · Responds within 2 hours</div>
        <div style={{fontSize:11,color:C.accent,marginTop:4,textAlign:"center",fontWeight:700}}>🎁 Panda Finance users — 20% discount!</div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}><div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>✅ BAK's Portfolio</div>{["🐼 Panda Finance — Tanzania's AI Financial OS","🛒 E-commerce stores with M-Pesa payments","🍽️ Restaurant & hotel booking systems","🌾 Agricultural market & farmer platforms","🏫 School & hospital management systems","🏛️ NGO, government & corporate portals","📱 Mobile apps — Android & iOS"].map(p=><div key={p} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.text}}><span style={{color:C.accent}}>✓</span>{p}</div>)}</Card>
        <Card C={C} ac><div style={{fontSize:32,marginBottom:8}}>📱</div><div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>Direct Contact</div><div style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:14}}>WhatsApp is the fastest way. Send your business details and get a quote within 2 hours. <strong style={{color:C.accent}}>Always available</strong>.</div><a href="https://wa.me/255653426979" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><Btn C={C} v="wa" fu>💬 Chat on WhatsApp</Btn></a></Card>
      </div>
    </div>}
  </div>;
}

// ══════════════════════════════ AI ASSISTANT ═════════════════════════════════
function Assistant({C}){
  const [msgs,setMsgs]=useState([{role:"ai",text:"Habari BAK! 🐼 Mimi ni AI Assistant wako wa Panda Finance — powered by Claude AI.\n\nNinaweza kukusaidia na:\n• 💰 Akiba, uwekezaji, mikopo\n• 🌾 Kilimo na bima\n• 📊 Mashauri ya biashara\n• 🔐 Usalama wa kidijitali\n• 🌍 Biashara ya Afrika Mashariki\n\nHow can I help you today?"}]);
  const [inp,setInp]=useState("");const [ld,setLd]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,ld]);
  const send=async()=>{
    if(!inp.trim()||ld)return;
    const msg=inp;setInp("");setMsgs(m=>[...m,{role:"user",text:msg}]);setLd(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are the AI Financial Assistant for Panda Finance, Tanzania's #1 AI-powered digital financial platform built by BAK. Help users with savings, loans, investments, farming finance, mobile money (M-Pesa, Airtel Money), credit scores, business advice, and general financial education. Be warm, practical, and concise. Support Kiswahili and English naturally. Use Tanzania-specific context: NMB, CRDB, TRA, BoT, SACCOs, SIDO, mobile money, East African trade.",messages:[{role:"user",content:msg}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"ai",text:data.content?.[0]?.text||"Samahani, please try again."}]);
    }catch{setMsgs(m=>[...m,{role:"ai",text:"Connection error. Please check your internet and try again."}]);}
    setLd(false);
  };
  const quick=["Improve my credit score fast","Best savings tips for youth in TZ","How to get a microloan quickly?","Explain M-Pesa investment options","Nikusaidie kuhusu akiba zangu","How to start a business in Tanzania?","Best investment with TSh 500K","Explain Vikoba digital savings"];
  return <div>
    <PHdr C={C} tl="🤖 AI Financial Assistant" sub="Powered by Claude AI · Kiswahili & English · 24/7"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      {[{ic:"💬",t:"Bilingual Support",d:"Kiswahili & English"},{ic:"🧠",t:"Deep Financial AI",d:"Savings, loans, investments"},{ic:"⚡",t:"Instant Responses",d:"24/7 availability"}].map(x=><Card key={x.t} C={C} ac><div style={{fontSize:28,marginBottom:8}}>{x.ic}</div><div style={{fontWeight:800,color:C.text,fontFamily:"Syne,sans-serif"}}>{x.t}</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{x.d}</div></Card>)}
    </div>
    <Card C={C} st={{display:"flex",flexDirection:"column",height:520}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:12,paddingRight:4}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?`linear-gradient(135deg,${C.accent},${C.accentDark})`:C.surface,color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.8,border:m.role==="ai"?`1px solid ${C.border}`:"none",whiteSpace:"pre-wrap",fontFamily:"Plus Jakarta Sans,sans-serif"}}>{m.text}</div>
        </div>)}
        {ld&&<div style={{display:"flex"}}><div style={{padding:"12px 16px",background:C.surface,borderRadius:18,fontSize:13,color:C.muted,border:`1px solid ${C.border}`,animation:"pulse 1.2s ease infinite"}}>🤖 Thinking...</div></div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{quick.map(q=><button key={q} onClick={()=>setInp(q)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s"}}>{q}</button>)}</div>}
      <div style={{display:"flex",gap:10}}><input style={{flex:1,padding:"12px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none"}} placeholder="Ask anything in Kiswahili or English..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><Btn C={C} on={send}>{ld?"...":"Send"}</Btn></div>
    </Card>
  </div>;
}

// ═══════════════════════════ NOTIFICATIONS SCREEN ════════════════════════════
function Notifs({C,notifs,setNotifs}){
  const [filter,setFilter]=useState("all");const [search,setSearch]=useState("");
  const unread=notifs.filter(n=>!n.read).length;
  const filtered=notifs.filter(n=>{
    const mc=filter==="all"||n.cat===filter||n.type===filter;
    const ms=!search||n.title.toLowerCase().includes(search.toLowerCase())||n.body.toLowerCase().includes(search.toLowerCase());
    return mc&&ms;
  });
  const markAll=()=>setNotifs(n=>n.map(x=>({...x,read:true})));
  const markOne=id=>setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  const dismiss=id=>setNotifs(n=>n.filter(x=>x.id!==id));
  return <div>
    <PHdr C={C} tl="🔔 Notifications" sub={`${unread} unread · ${notifs.length} total alerts`} act={<div style={{display:"flex",gap:10}}>{unread>0&&<Btn C={C} v="g" sm on={markAll}>✓ Mark All Read</Btn>}<Btn C={C} v="d" sm on={()=>setNotifs([])}>🗑 Clear All</Btn></div>}/>
    <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      {[{lb:"Unread",val:unread,ic:"🔴",cl:C.danger},{lb:"Security",val:notifs.filter(n=>n.cat==="security").length,ic:"🔐",cl:C.orange},{lb:"Money Alerts",val:notifs.filter(n=>["wallet","loan"].includes(n.cat)).length,ic:"💰",cl:C.accent},{lb:"AI Insights",val:notifs.filter(n=>n.cat==="ai").length,ic:"🤖",cl:C.blue}].map(s=><SC key={s.lb} C={C} {...s}/>)}
    </div>
    <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{position:"relative",flex:1,minWidth:200}}><span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notifications..." style={{width:"100%",padding:"10px 14px 10px 38px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"Plus Jakarta Sans,sans-serif",outline:"none"}}/></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["all","wallet","security","ai","loan","inventory","credit"].map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 14px",borderRadius:99,border:`1px solid ${filter===c?C.accent:C.border}`,background:filter===c?`${C.accent}14`:C.surface,color:filter===c?C.accent:C.muted,fontSize:11,fontWeight:filter===c?700:400,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s",textTransform:"capitalize"}}>{c}</button>)}</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {filtered.length===0?<Card C={C} st={{textAlign:"center",padding:40}}><div style={{fontSize:48,marginBottom:12}}>🔔</div><div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6,fontFamily:"Syne,sans-serif"}}>No notifications found</div><div style={{fontSize:13,color:C.muted}}>{search?"Try different search":"All caught up! 🎉"}</div></Card>
      :filtered.map((n,i)=>{const col=NOTIF_C[n.type]||C.accent;return <div key={n.id} className="ch" onClick={()=>markOne(n.id)} style={{background:n.read?C.card:`${col}0A`,border:`1px solid ${n.read?C.border:col+"44"}`,borderLeft:`4px solid ${n.read?C.border:col}`,borderRadius:16,padding:"15px 18px",transition:"all 0.25s",cursor:"pointer",animation:`fadeUp 0.4s ease ${i*0.04}s both`,display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{width:46,height:46,borderRadius:14,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{n.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:4}}>
            <div style={{fontSize:14,fontWeight:n.read?600:800,color:C.text,fontFamily:"Syne,sans-serif"}}>{n.title}</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>{!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:col}}/>}<span style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{n.time}</span></div>
          </div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{n.body}</div>
          <div style={{marginTop:8,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{background:`${col}18`,border:`1px solid ${col}44`,color:col,borderRadius:6,padding:"2px 10px",fontSize:10,fontWeight:700,textTransform:"capitalize"}}>{n.cat}</span>
            {!n.read&&<button onClick={e=>{e.stopPropagation();markOne(n.id);}} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif"}}>Mark read</button>}
            <button onClick={e=>{e.stopPropagation();dismiss(n.id);}} style={{fontSize:11,color:C.danger,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",marginLeft:"auto"}}>✕ Dismiss</button>
          </div>
        </div>
      </div>;})}
    </div>
    <Card C={C} st={{marginTop:20}}>
      <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:14,fontFamily:"Syne,sans-serif"}}>⚙️ Notification Preferences</div>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {[{lb:"Security Alerts",d:"Login, PIN changes, fraud",on:true,cl:C.orange},{lb:"Wallet Activity",d:"Deposits, withdrawals",on:true,cl:C.accent},{lb:"Loan Updates",d:"Offers, due dates",on:true,cl:C.gold},{lb:"AI Insights",d:"Business tips",on:true,cl:C.blue},{lb:"Inventory Alerts",d:"Low stock warnings",on:true,cl:C.danger},{lb:"Investment Updates",d:"Portfolio performance",on:false,cl:C.green},{lb:"Tax Reminders",d:"TRA filing deadlines",on:true,cl:C.warn},{lb:"Community",d:"Vikoba updates",on:false,cl:C.purple}].map((s,i)=>{
          const [on,setOn]=useState(s.on);
          return <div key={s.lb} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface}}>
            <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{s.lb}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.d}</div></div>
            <div onClick={()=>setOn(o=>!o)} style={{width:46,height:25,borderRadius:99,background:on?s.cl:C.border,cursor:"pointer",position:"relative",transition:"all 0.3s",flexShrink:0,marginLeft:12}}>
              <div style={{width:21,height:21,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:on?23:2,transition:"left 0.3s",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}/>
            </div>
          </div>;
        })}
      </div>
    </Card>
  </div>;
}

// ═══════════════════════════════ REVENUE MODEL ════════════════════════════════
function Revenue({C}){
  const streams=[{ic:"💳",n:"Transaction Fees",d:"0.5%–2% per wallet transaction",mo:"TSh 48M",pct:34},{ic:"🏦",n:"Loan Commission",d:"3%–8% of every loan facilitated",mo:"TSh 38M",pct:27},{ic:"⭐",n:"Premium Subscriptions",d:"TSh 15K–50K/month for AI tools",mo:"TSh 22M",pct:16},{ic:"📈",n:"Investment Marketplace",d:"2% on completed investment deals",mo:"TSh 14M",pct:10},{ic:"🛒",n:"Marketplace Commission",d:"1.5% on every product sale",mo:"TSh 8M",pct:6},{ic:"🛡️",n:"Insurance Commission",d:"15%–20% of premium collected",mo:"TSh 6M",pct:4},{ic:"🎓",n:"Education Premium",d:"Advanced financial course fees",mo:"TSh 4M",pct:3}];
  const alloc=[{n:"Product Dev & AI",pct:30,cl:C.accent,ic:"🤖"},{n:"Infrastructure & Ops",pct:25,cl:C.gold,ic:"⚙️"},{n:"Marketing & Growth",pct:20,cl:C.purple,ic:"📣"},{n:"Customer Support",pct:10,cl:C.pink,ic:"🆘"},{n:"Legal & Compliance",pct:8,cl:C.green,ic:"⚖️"},{n:"Community Impact",pct:7,cl:C.orange,ic:"🌍"}];
  return <div>
    <PHdr C={C} tl="💰 Revenue Model" sub="How Panda Finance earns · Revenue structure · Where money goes"/>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
      <SC C={C} ic="📈" lb="Monthly Revenue" val="TSh 140M" cl={C.accent} sub="+24% MoM growth"/>
      <SC C={C} ic="🎯" lb="Annual Target 2026" val="TSh 2.4B" cl={C.gold} sub="On track · Q2 strong"/>
      <SC C={C} ic="👥" lb="Active Paying Users" val="284,712" cl={C.purple} sub="+8,400 this week"/>
    </div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card C={C}>
        <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:16,fontFamily:"Syne,sans-serif"}}>💸 Revenue Streams</div>
        {streams.map((s,i)=><div key={s.n} style={{marginBottom:14,animation:`fadeUp 0.4s ease ${i*0.06}s both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.ic} {s.n}</div><div style={{fontSize:11,color:C.muted}}>{s.d}</div></div>
            <div style={{textAlign:"right",marginLeft:12,flexShrink:0}}><div style={{fontSize:12,fontWeight:900,color:C.accent,fontFamily:"JetBrains Mono,monospace"}}>{s.mo}</div><div style={{fontSize:10,color:C.muted}}>{s.pct}%</div></div>
          </div>
          <Prg C={C} pct={s.pct*2.6} cl={C.accent}/>
        </div>)}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}>
          <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:16,fontFamily:"Syne,sans-serif"}}>📊 Revenue Allocation</div>
          {alloc.map((a,i)=><div key={a.n} style={{marginBottom:12,animation:`fadeUp 0.4s ease ${i*0.07}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span style={{color:C.text,fontWeight:600}}>{a.ic} {a.n}</span><span style={{color:a.cl,fontWeight:800}}>{a.pct}%</span></div>
            <Prg C={C} pct={a.pct*3} cl={a.cl}/>
          </div>)}
        </Card>
        <Card C={C} ac>
          <div style={{fontSize:32,marginBottom:10}}>🏦</div>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:8,fontFamily:"Syne,sans-serif"}}>Revenue Collection Account</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.8,marginBottom:14}}>All platform revenue is collected to:<br/><strong style={{color:C.accent}}>BAK — Panda Finance Ltd</strong><br/>NMB Bank · Dar es Salaam<br/>Account: PF-0000-2026-BAK</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>🌍 <strong style={{color:C.text}}>7% Community Impact:</strong> Free financial literacy, emergency microloans for disaster-hit farmers, and subsidized banking for youth under 25 in rural Tanzania.</div>
        </Card>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════ PROFILE ═════════════════════════════════════
function Profile({C,balance}){
  return <div>
    <PHdr C={C} tl="👤 My Profile" sub="Your secure digital financial identity" act={<Btn C={C} v="g">Edit Profile</Btn>}/>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:18}}>
      <Card C={C} ac st={{textAlign:"center"}}>
        <div style={{width:88,height:88,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.gold})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:34,fontWeight:900,color:"#fff",animation:"glow 4s ease-in-out infinite",boxShadow:`0 0 40px ${C.accent}44`}}>B</div>
        <div style={{fontWeight:900,fontSize:24,color:C.text,fontFamily:"Syne,sans-serif"}}>BAK</div>
        <div style={{fontSize:13,color:C.muted,margin:"4px 0 12px"}}>Builder · Founder · Innovator</div>
        <Tag C={C} cl={C.gold}>🌟 Premium Member</Tag>
        <div style={{height:1,background:C.border,margin:"16px 0"}}/>
        <div style={{fontSize:11,color:C.muted,lineHeight:2.1}}>🏗️ Built by BAK<br/>🌍 Tanzania's Financial OS<br/>🐼 Panda Finance Founder<br/>📱 Est. June 2026</div>
        <div style={{marginTop:14}}><a href="https://wa.me/255653426979" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn C={C} v="wa" fu ic="💬">WhatsApp BAK</Btn></a></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:14,color:C.text,fontFamily:"Syne,sans-serif"}}>Personal Information</div>
          {[["Full Name","BAK",C.text],["Region","Dar es Salaam, Tanzania",C.text],["Occupation","Tech Entrepreneur & Developer",C.text],["Account Type","Business Owner",C.text],["Member Since","June 2026",C.text],["KYC Status","✅ Fully Verified",C.green],["Security Level","🔐 Maximum",C.accent]].map(([k,v,cl])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}18`,fontSize:13}}><span style={{color:C.muted}}>{k}</span><span style={{fontWeight:700,color:cl||C.text}}>{v}</span></div>)}
        </Card>
        <Card C={C}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:14,color:C.text,fontFamily:"Syne,sans-serif"}}>Financial Summary</div>
          {[["Wallet Balance",fmt(balance),C.accent],["Credit Score","742/1000 ⭐",C.purple],["Total Savings","TSh 44.7M",C.gold],["Active Loans","2 Loans",C.danger],["Investments","3 Active (+18.4%)",C.green],["Security","256-bit AES Encrypted",C.blue]].map(([k,v,cl])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}18`,fontSize:13}}><span style={{color:C.muted}}>{k}</span><span style={{fontWeight:800,color:cl}}>{v}</span></div>)}
        </Card>
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{ic:"📱",t:"Mobile Security",d:"Biometric + PIN",cl:C.green},{ic:"🔔",t:"Notifications",d:"10 unread",cl:C.gold},{ic:"🌍",t:"Language",d:"English + Kiswahili",cl:C.blue},{ic:"⚙️",t:"Account Settings",d:"Manage preferences",cl:C.muted}].map(x=><div key={x.t} style={{padding:"14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{fontSize:20,marginBottom:6}}>{x.ic}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>{x.t}</div>
            <div style={{fontSize:11,color:x.cl,marginTop:2,fontWeight:600}}>{x.d}</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════ ADMIN PANEL ══════════════════════════════════
function Admin({C}){
  const stats=[{lb:"Total Users",val:"284,712",ic:"👥",cl:C.accent},{lb:"Transactions Today",val:"12,844",ic:"💳",cl:C.gold},{lb:"Active Loans",val:"TSh 4.2B",ic:"🏦",cl:C.purple},{lb:"Platform Revenue",val:"TSh 180M",ic:"💰",cl:C.green}];
  const sections=[{t:"User Management",items:["View All Users","KYC Verification Queue","Suspend / Ban Account","User Analytics & Cohorts","Fraud Investigations"]},{t:"Transaction Control",items:["Monitor Live Transactions","Flag Suspicious Activity","Reverse Transactions","AML Reports","Settlement Management"]},{t:"Loan Oversight",items:["Active Loan Portfolio","Default Management","Approve Applications","Lender Partner Management","Credit Score Calibration"]},{t:"System Administration",items:["Security & Audit Logs","API Rate Management","Platform Configuration","Backup & Disaster Recovery","Performance Monitoring"]}];
  return <div>
    <PHdr C={C} tl="⚙️ Admin Panel" sub="Full platform management · Security · Analytics" act={<Tag C={C} cl={C.danger} sm>🔐 Admin Access</Tag>}/>
    <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      {stats.map((s,i)=><SC key={s.lb} C={C} {...s} d={i*0.07}/>)}
    </div>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:14}}>
      {sections.map(section=><Card key={section.t} C={C}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text,fontFamily:"Syne,sans-serif"}}>{section.t}</div>
        {section.items.map(item=><div key={item} style={{padding:"10px 12px",borderRadius:10,background:C.surface,marginBottom:6,fontSize:13,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${C.border}`,color:C.text,transition:"all 0.2s"}}>{item}<span style={{color:C.muted,fontSize:16}}>›</span></div>)}
      </Card>)}
    </div>
    <Card C={C} ac>
      <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,fontFamily:"Syne,sans-serif"}}>📊 Platform Health Dashboard</div>
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[["API Uptime","99.98%",C.green],["Fraud Rate","0.02%",C.green],["Avg Response","124ms",C.accent],["Security Score","A+",C.gold]].map(([k,v,cl])=><div key={k} style={{textAlign:"center",padding:"14px",background:C.surface,borderRadius:12,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:22,fontWeight:900,color:cl,fontFamily:"JetBrains Mono,monospace"}}>{v}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{k}</div>
        </div>)}
      </div>
    </Card>
  </div>;
}

// ════════════════════════════ SCREENS REGISTRY ════════════════════════════════
const SCREENS={
  dashboard:Dashboard,wallet:Wallet,savings:Savings,credit:Credit,
  bizai:BizAI,books:Books,inventory:Inventory,cashflow:CashFlow,analytics:Analytics,
  loans:Loans,invest:Invest,insurance:Insurance,tax:Tax,currency:Currency,
  market:Market,farmer:Farmer,vikoba:Vikoba,edu:Edu,support:Support,
  assistant:Assistant,notifs:Notifs,revenue:Revenue,profile:Profile,admin:Admin,
};

// ═════════════════════════ SIDEBAR COMPONENT ══════════════════════════════════
function Sidebar({C,active,setActive,dark,setDark}){
  return <>
    <div style={{padding:"22px 20px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
      <div style={{fontSize:17,fontWeight:900,background:`linear-gradient(135deg,${C.accent},${C.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-0.5,fontFamily:"Syne,sans-serif"}}>🐼 PANDA FINANCE</div>
      <div style={{fontSize:9,color:C.muted,letterSpacing:2.5,textTransform:"uppercase",marginTop:4}}>Tanzania's Financial OS</div>
    </div>
    <div style={{padding:"10px 10px",flex:1,overflowY:"auto"}}>
      {NAV.map(section=><div key={section.s}>
        <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:"uppercase",padding:"8px 10px 3px",fontWeight:800}}>{section.s}</div>
        {section.items.map(item=><div key={item.id} className="ni" onClick={()=>setActive(item.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:active===item.id?800:400,color:active===item.id?C.accent:C.muted,background:active===item.id?`${C.accent}12`:"transparent",border:`1px solid ${active===item.id?C.accent+"30":"transparent"}`,marginBottom:2,transition:"all 0.2s"}}>
          <span style={{fontSize:15,flexShrink:0}}>{item.ic}</span>
          <span style={{flex:1}}>{item.l}</span>
          {active===item.id&&<span style={{width:6,height:6,borderRadius:"50%",background:C.accent,flexShrink:0}}/>}
        </div>)}
      </div>)}
    </div>
    <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted,lineHeight:2,flexShrink:0}}>
      <div style={{fontWeight:900,color:C.accent,fontSize:12,fontFamily:"Syne,sans-serif"}}>🏗️ Built by BAK</div>
      <div>🐼 Panda Finance v3.0</div>
      <div>© 2026 · Tanzania · All Rights Reserved</div>
      <a href="https://wa.me/255653426979" target="_blank" rel="noopener noreferrer" style={{color:"#25D366",fontWeight:800,textDecoration:"none",display:"block",marginTop:4}}>💬 Contact BAK</a>
    </div>
  </>;
}

// ══════════════════════════════ ROOT APP ══════════════════════════════════════
export default function App(){
  const [stage,setStage]=useState("splash");
  const [dark,setDark]=useState(true);
  const [active,setActive]=useState("dashboard");
  const [navOpen,setNavOpen]=useState(false);
  const [balance,setBalance]=useState(4820000);
  const [notifs,setNotifs]=useState(INIT_N);
  const [toasts,setToasts]=useState([]);
  const C=dark?DARK:LIGHT;
  const Screen=SCREENS[active]||Dashboard;
  const unread=notifs.filter(n=>!n.read).length;

  // Live toast system — fires at intervals to simulate real-time alerts
  useEffect(()=>{
    if(stage!=="app")return;
    let idx=0;
    const fire=()=>{
      const n={...LIVE_TOASTS[idx%LIVE_TOASTS.length],id:Date.now(),leaving:false};
      setToasts(ts=>[...ts,n]);
      setNotifs(ns=>[{...n,time:"Just now",read:false,cat:n.type},...ns.slice(0,29)]);
      setTimeout(()=>setToasts(ts=>ts.map(t=>t.id===n.id?{...t,leaving:true}:t)),5000);
      setTimeout(()=>setToasts(ts=>ts.filter(t=>t.id!==n.id)),5400);
      idx++;
    };
    const first=setTimeout(fire,10000);
    const interval=setInterval(fire,50000);
    return()=>{clearTimeout(first);clearInterval(interval);};
  },[stage]);

  const dismissToast=id=>setToasts(ts=>ts.filter(t=>t.id!==id));
  const currentNav=NAV.flatMap(s=>s.items).find(i=>i.id===active);

  return <div style={{fontFamily:"Plus Jakarta Sans,sans-serif",background:C.bg,color:C.text,minHeight:"100vh"}}>
    <style>{CSS}</style>

    {stage==="splash"&&<Splash C={C} onDone={()=>setStage("onboarding")}/>}
    {stage==="onboarding"&&<Onboarding C={C} onDone={()=>setStage("login")}/>}
    {stage==="login"&&<Login C={C} onLogin={()=>setStage("app")} onReg={()=>setStage("register")}/>}
    {stage==="register"&&<Register C={C} onBack={()=>setStage("login")} onDone={()=>setStage("app")}/>}

    {stage==="app"&&<div style={{display:"flex",minHeight:"100vh",position:"relative"}}>
      <FinBg C={C}/>
      <Toasts toasts={toasts} onDismiss={dismissToast} C={C}/>

      {/* Mobile overlay */}
      {navOpen&&<div onClick={()=>setNavOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:149,backdropFilter:"blur(5px)"}}/>}

      {/* Desktop Sidebar */}
      <div className="dsk" style={{width:248,minHeight:"100vh",background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,zIndex:150,overflowY:"auto"}}>
        <Sidebar C={C} active={active} setActive={setActive} dark={dark} setDark={setDark}/>
      </div>

      {/* Mobile Sidebar */}
      <div style={{width:260,minHeight:"100vh",background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,zIndex:150,overflowY:"auto",transform:navOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1)",boxShadow:navOpen?"12px 0 50px rgba(0,0,0,0.55)":"none"}}>
        <Sidebar C={C} active={active} setActive={id=>{setActive(id);setNavOpen(false);}} dark={dark} setDark={setDark}/>
      </div>

      {/* Main content */}
      <div className="mw" style={{marginLeft:248,flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,minWidth:0}}>

        {/* Topbar */}
        <div style={{background:`${C.surface}F0`,borderBottom:`1px solid ${C.border}`,padding:"10px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(16px)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setNavOpen(n=>!n)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:17,color:C.text,fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all 0.2s",display:"flex",alignItems:"center"}}>
              {navOpen?"✕":"☰"}
            </button>
            {currentNav&&<div style={{fontSize:14,fontWeight:700,color:C.text,display:"flex",alignItems:"center",gap:6}}><span>{currentNav.ic}</span><span className="hide-mob">{currentNav.l}</span></div>}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>setDark(d=>!d)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:12,cursor:"pointer",fontFamily:"Plus Jakarta Sans,sans-serif",fontWeight:700,transition:"all 0.2s"}} className="hide-mob">{dark?"☀️ Light":"🌙 Dark"}</button>
            <Bell C={C} notifs={notifs} setNotifs={setNotifs} setActive={setActive}/>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,fontFamily:"JetBrains Mono,monospace"}} className="hide-mob">{fmt(balance)}</div>
            <div onClick={()=>setActive("profile")} style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff",flexShrink:0,cursor:"pointer",boxShadow:`0 0 16px ${C.accent}44`}}>B</div>
          </div>
        </div>

        <Ticker C={C}/>

        {/* Page content */}
        <div style={{padding:"28px",flex:1,overflowY:"auto"}}>
          <Screen key={active} C={C} balance={balance} setBalance={setBalance} notifs={notifs} setNotifs={setNotifs} setActive={setActive}/>
        </div>
      </div>
    </div>}
  </div>;
}
