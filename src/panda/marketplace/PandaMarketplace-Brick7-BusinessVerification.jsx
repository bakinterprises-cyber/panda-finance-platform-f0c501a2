import { useState } from "react";

// ============================================================
// 🧱 BRICK 7 — BUSINESS VERIFICATION SYSTEM
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export BusinessVerification from this file
//     Props: { sellerId, onBack, onVerified, onNavigate }
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
    arrowLeft:   <><line x1="19" y1="12" x2="5" y2="12" {...s}/><polyline points="12 19 5 12 12 5" {...s}/></>,
    shield:      <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    shieldOff:   <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/></>,
    check:       <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    upload:      <><polyline points="16 16 12 12 8 16" {...s}/><line x1="12" y1="12" x2="12" y2="21" {...s}/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" {...s}/></>,
    camera:      <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    fileText:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><polyline points="14 2 14 8 20 8" {...s}/><line x1="16" y1="13" x2="8" y2="13" {...s}/><line x1="16" y1="17" x2="8" y2="17" {...s}/><polyline points="10 9 9 9 8 9" {...s}/></>,
    briefcase:   <><rect x="2" y="7" width="20" height="14" rx="2" {...s}/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s}/></>,
    mapPin:      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    phone:       <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    clock:       <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    chevronRight:<><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:   <><polyline points="18 15 12 9 6 15" {...s}/></>,
    award:       <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    lock:        <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    info:        <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    zap:         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    star:        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    home:        <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:     <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:     <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:      <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    refresh:     <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
    alertCircle: <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "profile" }) {
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
// 🔌 BACKEND SWAP POINT #1 — SELLER VERIFICATION STATUS
// Replace with: supabase.from('seller_verifications')
//   .select('*').eq('seller_id', sellerId).single()
// 🔐 SECURITY — All document uploads go to Supabase Storage
//   with Row Level Security. Never expose raw docs to frontend.
//   KYC verification done in Supabase Edge Function only.
// ============================================================
const MOCK_VERIFICATION = {
  sellerId:       "SEL-001",
  sellerName:     "Tech Master Store",
  sellerInitials: "TM",
  sellerColor:    "#1D4ED8",
  currentLevel:   "bronze",   // none | bronze | silver | gold | elite
  trustScore:     68,
  status:         "in_progress", // none | in_progress | pending | verified | rejected
  submittedAt:    "2 days ago",
  steps: {
    phone:    { done:true,  label:"Phone Verified"         },
    email:    { done:true,  label:"Email Verified"         },
    nida:     { done:true,  label:"NIDA ID Verified"       },
    selfie:   { done:true,  label:"Selfie Verified"        },
    brela:    { done:false, label:"BRELA Registration"     },
    tin:      { done:false, label:"TIN Number"             },
    address:  { done:false, label:"Business Address"       },
    bank:     { done:false, label:"Bank Account Linked"    },
  },
};

// Verification levels & their benefits
const VERIFICATION_LEVELS = [
  {
    id:       "bronze",
    label:    "Bronze Seller",
    color:    "#CD7F32",
    bg:       "#FDF3E7",
    icon:     "shield",
    requires: ["Phone","Email","NIDA ID","Selfie"],
    benefits: ["List up to 10 products","Basic Trust Badge","Marketplace access"],
    trustBoost: "+15 Trust Score",
  },
  {
    id:       "silver",
    label:    "Silver Seller",
    color:    "#A8A9AD",
    bg:       "#F5F5F5",
    icon:     "shield",
    requires: ["Bronze","TIN Number","Business Address"],
    benefits: ["List up to 50 products","Silver Trust Badge","Priority search ranking","Escrow access"],
    trustBoost: "+25 Trust Score",
  },
  {
    id:       "gold",
    label:    "Gold Seller",
    color:    T.gold,
    bg:       T.goldLight,
    icon:     "award",
    requires: ["Silver","BRELA Registration","Bank Account"],
    benefits: ["Unlimited products","Gold Verified Badge","Top search placement","Lower escrow fees","Loan eligibility"],
    trustBoost: "+35 Trust Score",
  },
  {
    id:       "elite",
    label:    "Elite Seller",
    color:    T.purple,
    bg:       T.purpleBg,
    icon:     "star",
    requires: ["Gold","6 months activity","98%+ Trust Score"],
    benefits: ["Elite Badge","Featured placement","Dedicated support","Investment access","Panda Capital eligible"],
    trustBoost: "+25 Trust Score",
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — DOCUMENT UPLOAD STEPS
// Each step uploads to Supabase Storage via Edge Function
// 🔐 SECURITY — Documents stored encrypted in private bucket
//   Access controlled by RLS policies
//   KYC verified by third-party service via Edge Function:
//   - NIDA: Tanzania National ID Authority API
//   - BRELA: Business Registrations and Licensing Agency API
//   - TIN: Tanzania Revenue Authority API
// ============================================================
const VERIFICATION_STEPS = [
  {
    id:       "phone",
    label:    "Phone Number",
    desc:     "Verify your Tanzanian phone number via OTP",
    icon:     "phone",
    color:    T.green,
    required: true,
    level:    "bronze",
    // 🔐 SECURITY — OTP generated and verified in Edge Function only
    // 🔌 BACKEND — supabase.functions.invoke('send-otp', { phone })
  },
  {
    id:       "nida",
    label:    "NIDA National ID",
    desc:     "Upload your Tanzania National ID (front & back)",
    icon:     "user",
    color:    T.blue,
    required: true,
    level:    "bronze",
    // 🔐 SECURITY — NIDA verification via Edge Function
    // 🔌 BACKEND — supabase.functions.invoke('verify-nida', { nida_number, dob })
  },
  {
    id:       "selfie",
    label:    "Selfie Verification",
    desc:     "Take a selfie holding your ID for liveness check",
    icon:     "camera",
    color:    T.purple,
    required: true,
    level:    "bronze",
    // 🔐 SECURITY — Liveness check via third-party KYC API in Edge Function
    // 🔌 BACKEND — supabase.functions.invoke('verify-selfie', { image_url })
  },
  {
    id:       "tin",
    label:    "TIN Number",
    desc:     "Enter your Tanzania Revenue Authority TIN number",
    icon:     "fileText",
    color:    T.amber,
    required: true,
    level:    "silver",
    // 🔐 SECURITY — TRA verification via Edge Function
    // 🔌 BACKEND — supabase.functions.invoke('verify-tin', { tin_number })
  },
  {
    id:       "address",
    label:    "Business Address",
    desc:     "Provide and verify your physical business address",
    icon:     "mapPin",
    color:    T.red,
    required: true,
    level:    "silver",
    // 🔌 BACKEND — supabase.from('seller_addresses').insert({ ... })
  },
  {
    id:       "brela",
    label:    "BRELA Registration",
    desc:     "Upload your BRELA business registration certificate",
    icon:     "briefcase",
    color:    T.gold,
    required: true,
    level:    "gold",
    // 🔐 SECURITY — BRELA verification via Edge Function
    // 🔌 BACKEND — supabase.functions.invoke('verify-brela', { reg_number })
  },
  {
    id:       "bank",
    label:    "Bank Account",
    desc:     "Link your NMB, CRDB, or other Tanzanian bank account",
    icon:     "wallet",
    color:    T.navy,
    required: true,
    level:    "gold",
    // 🔐 SECURITY — Bank details never stored in frontend
    // 🔌 BACKEND — supabase.functions.invoke('link-bank', { account_number, bank_code })
  },
];

// ============================================================
// 🧱 MAIN COMPONENT — BusinessVerification
// ============================================================
export default function App({
  // 👤 AUTH — replace with real seller from supabase.auth.getUser()
  seller       = MOCK_VERIFICATION,

  // 🧭 NAVIGATE
  onBack       = () => {},    // → previous screen
  onVerified   = () => {},    // → Brick 4 SellerProfile (refreshed)
  onStepPress  = () => {},    // → individual verification step screen
}) {
  const [activeStep,   setActiveStep]   = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [stepDone,     setStepDone]     = useState({ phone:true, email:true, nida:true, selfie:true });
  const [expandLevel,  setExpandLevel]  = useState("gold");
  const [toast,        setToast]        = useState(null);
  const [submitted,    setSubmitted]    = useState(false);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const completedSteps = Object.values(stepDone).filter(Boolean).length;
  const totalSteps     = VERIFICATION_STEPS.length;
  const progress       = Math.round((completedSteps / totalSteps) * 100);

  const handleStepUpload = (stepId) => {
    setActiveStep(stepId);
    setUploading(true);
    // 🔌 BACKEND — supabase.functions.invoke('verify-step', { step: stepId, seller_id: seller.sellerId })
    // 🔐 SECURITY — All verification happens server-side only
    setTimeout(() => {
      setUploading(false);
      setStepDone(prev => ({ ...prev, [stepId]: true }));
      setActiveStep(null);
      showToast(`${VERIFICATION_STEPS.find(s => s.id === stepId)?.label} verified!`, T.green);
    }, 2000);
  };

  const handleSubmit = () => {
    // 🔌 BACKEND — supabase.from('seller_verifications').update({ status: 'pending', submitted_at: new Date() })
    //   .eq('seller_id', seller.sellerId)
    setSubmitted(true);
    showToast("Application submitted! Review takes 24–48 hours.", T.gold);
  };

  const getLevelStatus = (levelId) => {
    const order = ["bronze","silver","gold","elite"];
    const current = order.indexOf(seller.currentLevel);
    const target  = order.indexOf(levelId);
    if (target < current) return "completed";
    if (target === current) return "active";
    return "locked";
  };

  // ── STEP MODAL ──────────────────────────────────────────────
  const StepModal = ({ step }) => (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }} onClick={() => !uploading && setActiveStep(null)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 24px" }}/>

        {/* Step header */}
        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:18,
            background:step.color+"14", border:`1px solid ${step.color}22`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={step.icon} size={26} color={step.color}/>
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:T.textMain }}>{step.label}</div>
            <div style={{ fontSize:12, color:T.textMute, marginTop:3 }}>{step.desc}</div>
          </div>
        </div>

        {/* Security note */}
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}22`,
          borderRadius:14, padding:"12px 16px", marginBottom:20,
          display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="lock" size={16} color={T.green}/>
          <div style={{ fontSize:12, color:T.green, lineHeight:1.6, fontWeight:600 }}>
            {/* 🔐 SECURITY note shown to user */}
            Your documents are encrypted and stored securely. Panda Finance never shares your personal information with third parties.
          </div>
        </div>

        {/* Upload area */}
        {!uploading ? (
          <>
            <div style={{
              border:`2px dashed ${step.color}44`, borderRadius:20,
              padding:"32px 20px", textAlign:"center", marginBottom:20,
              background:step.color+"06", cursor:"pointer",
            }} onClick={() => handleStepUpload(step.id)}>
              <div style={{ width:52, height:52, borderRadius:16,
                background:step.color+"18",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 14px" }}>
                <Icon name="upload" size={26} color={step.color}/>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:T.textMain,
                marginBottom:6 }}>
                {step.id === "selfie" ? "Open Camera" :
                 step.id === "phone"  ? "Verify via OTP" :
                 step.id === "tin" || step.id === "brela" ? "Enter Number" :
                 "Upload Document"}
              </div>
              <div style={{ fontSize:12, color:T.textMute }}>
                {step.id === "selfie"
                  ? "Take a clear selfie holding your ID"
                  : step.id === "phone"
                  ? "We'll send a 6-digit code to your number"
                  : "Tap to upload · JPG, PNG or PDF · Max 10MB"}
              </div>
            </div>
            <button onClick={() => handleStepUpload(step.id)} style={{
              width:"100%", padding:"15px 0", borderRadius:18,
              background:`linear-gradient(135deg,${step.color},${step.color}CC)`,
              border:"none", color:"#fff", fontSize:14, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${step.color}44`,
            }}>
              <Icon name={step.id === "selfie" ? "camera" : "upload"} size={17} color="#fff"/>
              {step.id === "phone" ? "Send OTP" :
               step.id === "selfie" ? "Open Camera" : "Upload & Verify"}
            </button>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ width:72, height:72, borderRadius:"50%",
              background:step.color+"14", border:`2px solid ${step.color}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 16px", animation:"spin 1s linear infinite" }}>
              <Icon name="refresh" size={32} color={step.color}/>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>Verifying...</div>
            <div style={{ fontSize:12, color:T.textMute }}>
              {/* 🔐 SECURITY — verification happens in Edge Function */}
              Securely checking your information. Please wait.
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── SUCCESS STATE ────────────────────────────────────────────
  if (submitted) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
      `}</style>
      <div style={{ textAlign:"center", width:"100%" }}>
        <div style={{ width:100, height:100, borderRadius:"50%",
          background:`linear-gradient(135deg,${T.gold}22,${T.gold}44)`,
          border:`3px solid ${T.gold}55`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 24px",
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <Icon name="shield" size={50} color={T.gold}/>
        </div>
        <div style={{ fontSize:24, fontWeight:900, color:T.textMain,
          marginBottom:8, letterSpacing:-0.5 }}>Application Submitted!</div>
        <div style={{ fontSize:14, color:T.textMute, lineHeight:1.7,
          marginBottom:28 }}>
          Your verification is under review. Our team will verify your documents within 24–48 hours. You'll receive a notification once approved.
        </div>
        {/* Review timeline */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, marginBottom:24, textAlign:"left" }}>
          {[
            { label:"Documents Submitted", time:"Just now",   done:true,  color:T.green  },
            { label:"Under Review",        time:"1–2 hours",  done:false, color:T.amber  },
            { label:"Verification Check",  time:"24 hours",   done:false, color:T.blue   },
            { label:"Decision Made",       time:"48 hours",   done:false, color:T.purple },
          ].map((item, i) => (
            <div key={item.label} style={{ display:"flex", gap:14,
              marginBottom:i<3?16:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:32, height:32, borderRadius:"50%",
                  background: item.done ? T.green : item.color+"14",
                  border:`2px solid ${item.done ? T.green : item.color+"33"}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {item.done
                    ? <Icon name="check" size={14} color="#fff"/>
                    : <Icon name="clock" size={14} color={item.color}/>
                  }
                </div>
                {i<3 && <div style={{ width:2, height:20, background:T.border, marginTop:4 }}/>}
              </div>
              <div style={{ paddingTop:5 }}>
                <div style={{ fontSize:13, fontWeight:800, color:T.textMain }}>{item.label}</div>
                <div style={{ fontSize:11, color:T.textMute }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{
          width:"100%", padding:"15px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
          border:"none", color:"#fff", fontSize:14, fontWeight:900,
          cursor:"pointer", boxShadow:`0 6px 20px ${T.navy}44`,
        }}>Back to Store</button>
      </div>
    </div>
  );

  return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:110,
    }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {activeStep && <StepModal step={VERIFICATION_STEPS.find(s => s.id === activeStep)}/>}

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
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:15, fontWeight:800, color:T.textMain }}>
          Business Verification
        </div>
        <div style={{ width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="info" size={17} color={T.navy}/>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── HERO CARD ── */}
        <div style={{
          background:`linear-gradient(135deg,${T.navy} 0%,${T.navyMid} 100%)`,
          borderRadius:24, padding:"24px", marginBottom:16,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, opacity:0.05,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"18px 18px" }}/>
          <div style={{ position:"absolute", top:-30, right:-30,
            width:140, height:140, borderRadius:"50%",
            background:"rgba(255,255,255,0.04)" }}/>

          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:16, position:"relative" }}>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
                fontWeight:700, letterSpacing:0.8, marginBottom:6 }}>
                VERIFICATION STATUS
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:"#fff",
                letterSpacing:-0.4, marginBottom:4 }}>{seller.sellerName}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                background:"rgba(201,150,10,0.25)", border:"1px solid rgba(201,150,10,0.4)",
                borderRadius:10, padding:"3px 10px" }}>
                <Icon name="award" size={11} color={T.goldMid}/>
                <span style={{ fontSize:11, fontWeight:800,
                  color:T.goldMid, textTransform:"capitalize" }}>
                  {seller.currentLevel} Seller
                </span>
              </div>
            </div>
            {/* Trust Score ring */}
            <div style={{ width:64, height:64, borderRadius:"50%",
              background:`conic-gradient(${T.green} ${seller.trustScore * 3.6}deg, rgba(255,255,255,0.15) 0deg)`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:54, height:54, borderRadius:"50%",
                background:"rgba(11,31,75,0.8)",
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:16, fontWeight:900,
                  color:T.green, lineHeight:1 }}>{seller.trustScore}</span>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)" }}>Trust</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:700,
                color:"rgba(255,255,255,0.8)" }}>
                Verification Progress
              </span>
              <span style={{ fontSize:12, fontWeight:900,
                color:"rgba(255,255,255,0.9)" }}>{completedSteps}/{totalSteps} steps</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.15)",
              borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99,
                width:`${progress}%`,
                background:`linear-gradient(90deg,${T.green},${T.goldMid})`,
                transition:"width 0.6s ease" }}/>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)",
              marginTop:6 }}>{progress}% complete</div>
          </div>
        </div>

        {/* ── CURRENT STATUS BANNER ── */}
        {seller.status === "in_progress" && (
          <div style={{ background:T.amberBg, border:`1px solid ${T.amber}33`,
            borderRadius:16, padding:"13px 16px", marginBottom:16,
            display:"flex", gap:10, alignItems:"center" }}>
            <Icon name="alertCircle" size={18} color={T.amber}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800,
                color:T.amber }}>Verification In Progress</div>
              <div style={{ fontSize:11, color:T.amber+"99" }}>
                Submitted {seller.submittedAt} · Under review
              </div>
            </div>
            <Icon name="clock" size={16} color={T.amber}/>
          </div>
        )}

        {/* ── VERIFICATION LEVELS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            marginBottom:14, letterSpacing:-0.3 }}>
            Verification Levels
          </div>
          {VERIFICATION_LEVELS.map((level, i) => {
            const status   = getLevelStatus(level.id);
            const expanded = expandLevel === level.id;
            return (
              <div key={level.id} style={{ marginBottom:10 }}>
                <div style={{
                  background: status==="completed" ? T.greenBg
                    : status==="active" ? level.bg
                    : T.card,
                  border:`1.5px solid ${
                    status==="completed" ? T.green+"44"
                    : status==="active" ? level.color+"44"
                    : T.border}`,
                  borderRadius:20, overflow:"hidden",
                  boxShadow: status==="active" ? T.shadowMd : T.shadow,
                }}>
                  {/* Level header */}
                  <div onClick={() => setExpandLevel(expanded ? null : level.id)}
                    style={{ display:"flex", gap:14, alignItems:"center",
                      padding:"16px 18px", cursor:"pointer" }}>
                    <div style={{ width:48, height:48, borderRadius:15,
                      background: status==="completed" ? T.green+"18"
                        : status==="active" ? level.color+"18" : T.navyLight,
                      border:`1.5px solid ${
                        status==="completed" ? T.green+"33"
                        : status==="active" ? level.color+"33" : T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0 }}>
                      <Icon name={level.icon} size={22}
                        color={status==="completed" ? T.green
                          : status==="active" ? level.color : T.textMute}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center",
                        gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:14, fontWeight:900,
                          color: status==="completed" ? T.green
                            : status==="active" ? level.color : T.textMute }}>
                          {level.label}
                        </span>
                        {status === "completed" && (
                          <div style={{ width:20, height:20, borderRadius:"50%",
                            background:T.green, display:"flex",
                            alignItems:"center", justifyContent:"center" }}>
                            <Icon name="check" size={11} color="#fff"/>
                          </div>
                        )}
                        {status === "active" && (
                          <div style={{ background:level.color+"18",
                            border:`1px solid ${level.color}33`,
                            borderRadius:7, padding:"1px 7px",
                            fontSize:10, fontWeight:800, color:level.color }}>
                            Current
                          </div>
                        )}
                        {status === "locked" && (
                          <Icon name="lock" size={13} color={T.textMute}/>
                        )}
                      </div>
                      <div style={{ fontSize:11, fontWeight:700,
                        color: status==="active" ? level.color+"99" : T.textMute }}>
                        {level.trustBoost} · {level.requires.length} requirements
                      </div>
                    </div>
                    <Icon name={expanded ? "chevronUp" : "chevronDown"}
                      size={16} color={T.textMute}/>
                  </div>

                  {/* Expanded content */}
                  {expanded && (
                    <div style={{ padding:"0 18px 18px",
                      borderTop:`1px solid ${T.border}`,
                      animation:"fadeUp 0.2s ease" }}>
                      {/* Requirements */}
                      <div style={{ marginTop:14, marginBottom:14 }}>
                        <div style={{ fontSize:11, fontWeight:800,
                          color:T.textMute, textTransform:"uppercase",
                          letterSpacing:0.7, marginBottom:8 }}>Requirements</div>
                        {level.requires.map(req => (
                          <div key={req} style={{ display:"flex", gap:8,
                            alignItems:"center", marginBottom:6 }}>
                            <div style={{ width:18, height:18, borderRadius:"50%",
                              background:level.color+"14",
                              display:"flex", alignItems:"center",
                              justifyContent:"center" }}>
                              <Icon name="check" size={10} color={level.color}/>
                            </div>
                            <span style={{ fontSize:12, color:T.textMid,
                              fontWeight:600 }}>{req}</span>
                          </div>
                        ))}
                      </div>
                      {/* Benefits */}
                      <div>
                        <div style={{ fontSize:11, fontWeight:800,
                          color:T.textMute, textTransform:"uppercase",
                          letterSpacing:0.7, marginBottom:8 }}>Benefits</div>
                        {level.benefits.map(ben => (
                          <div key={ben} style={{ display:"flex", gap:8,
                            alignItems:"center", marginBottom:6 }}>
                            <Icon name="zap" size={12} color={level.color}/>
                            <span style={{ fontSize:12, color:T.textMid,
                              fontWeight:600 }}>{ben}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── VERIFICATION STEPS ── */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
            marginBottom:6, letterSpacing:-0.3 }}>
            Verification Steps
          </div>
          <div style={{ fontSize:12, color:T.textMute, marginBottom:14 }}>
            Complete steps to unlock higher verification levels
          </div>

          <div style={{ background:T.card, borderRadius:22,
            border:`1px solid ${T.border}`, overflow:"hidden",
            boxShadow:T.shadow }}>
            {VERIFICATION_STEPS.map((step, i) => {
              const isDone = !!stepDone[step.id];
              return (
                <div key={step.id} onClick={() => !isDone && setActiveStep(step.id)}
                  style={{
                    display:"flex", gap:14, alignItems:"center",
                    padding:"16px 20px",
                    borderBottom: i < VERIFICATION_STEPS.length-1
                      ? `1px solid ${T.border}` : "none",
                    cursor: isDone ? "default" : "pointer",
                    background: isDone ? T.greenBg+"44" : T.white,
                    transition:"background 0.18s",
                  }}>
                  {/* Icon */}
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0,
                    background: isDone ? T.green+"18" : step.color+"14",
                    border:`1.5px solid ${isDone ? T.green+"33" : step.color+"22"}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={isDone ? "check" : step.icon} size={20}
                      color={isDone ? T.green : step.color}/>
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center",
                      gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:800,
                        color: isDone ? T.green : T.textMain }}>{step.label}</span>
                      <div style={{ fontSize:9, fontWeight:800,
                        background: step.level==="bronze" ? "#FDF3E7"
                          : step.level==="silver" ? "#F5F5F5"
                          : step.level==="gold" ? T.goldLight : T.purpleBg,
                        color: step.level==="bronze" ? "#CD7F32"
                          : step.level==="silver" ? "#A8A9AD"
                          : step.level==="gold" ? T.gold : T.purple,
                        borderRadius:6, padding:"1px 6px",
                        textTransform:"uppercase", letterSpacing:0.3 }}>
                        {step.level}
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:T.textMute,
                      overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{step.desc}</div>
                  </div>
                  {/* Status */}
                  {isDone ? (
                    <div style={{ width:28, height:28, borderRadius:"50%",
                      background:T.green, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="check" size={14} color="#fff"/>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center",
                      gap:6, flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700,
                        color:step.color }}>Start</span>
                      <Icon name="chevronRight" size={14} color={step.color}/>
                    </div>
                  )}
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
          <div style={{ width:48, height:48, borderRadius:14,
            background:T.blue+"18", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="lock" size={24} color={T.blue}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:900, color:T.navy, marginBottom:4 }}>
              Bank-Grade Security
            </div>
            <div style={{ fontSize:11, color:T.textMute, lineHeight:1.6 }}>
              {/* 🔐 SECURITY — shown to reassure users */}
              All documents are encrypted with AES-256. Verification done by certified KYC partners. Your data is never sold or shared.
            </div>
          </div>
        </div>

      </div>

      {/* ── STICKY SUBMIT BUTTON ── */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"14px 20px 28px",
        boxShadow:"0 -4px 24px rgba(11,31,75,0.1)",
        zIndex:150,
      }}>
        {completedSteps >= 4 ? (
          <button onClick={handleSubmit} style={{
            width:"100%", padding:"15px 0", borderRadius:18,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:15, fontWeight:900,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>
            <Icon name="shield" size={18} color="#fff"/>
            Submit for Verification
          </button>
        ) : (
          <div>
            <div style={{ background:T.navyLight, border:`1px solid ${T.border}`,
              borderRadius:18, padding:"14px 20px",
              display:"flex", alignItems:"center", gap:10 }}>
              <Icon name="info" size={16} color={T.textMute}/>
              <span style={{ fontSize:13, color:T.textMute, fontWeight:600 }}>
                Complete {4 - completedSteps} more step{4 - completedSteps > 1 ? "s" : ""} to submit for Bronze verification
              </span>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="profile"/>
    </div>
  );
}
