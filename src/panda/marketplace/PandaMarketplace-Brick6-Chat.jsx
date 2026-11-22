import { useState, useEffect, useRef } from "react";

// ============================================================
// 🧱 BRICK 6 — MARKETPLACE CHAT (BUYER ↔ SELLER)
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 📦  Assembly: export MarketplaceChat from this file
//     Props: { currentUser, onBack, onProductPress,
//              onSellerPress, onPayNow }
// ============================================================

// ─── Design Tokens ────────────────────────────────────────────
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
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
    image:        <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" {...s}/><circle cx="8.5" cy="8.5" r="1.5" {...s}/><polyline points="21 15 16 10 5 21" {...s}/></>,
    mic:          <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...s}/><path d="M19 10v2a7 7 0 0 1-14 0v-2" {...s}/><line x1="12" y1="19" x2="12" y2="23" {...s}/><line x1="8" y1="23" x2="16" y2="23" {...s}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></>,
    video:        <><polygon points="23 7 16 12 23 17 23 7" {...s}/><rect x="1" y="5" width="15" height="14" rx="2" {...s}/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    checkDouble:  <><polyline points="18 6 9 17 4 12" stroke={color} strokeWidth="2" fill="none"/><polyline points="22 6 13 17" stroke={color} strokeWidth="2" fill="none"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    smile:        <><circle cx="12" cy="12" r="10" {...s}/><path d="M8 13s1.5 2 4 2 4-2 4-2" {...s}/><line x1="9" y1="9" x2="9.01" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    paperclip:    <><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" {...s}/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    more:         <><circle cx="12" cy="12" r="1" fill={color} stroke="none"/><circle cx="19" cy="12" r="1" fill={color} stroke="none"/><circle cx="5" cy="12" r="1" fill={color} stroke="none"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    laptop:       <><rect x="2" y="3" width="20" height="14" rx="2" {...s}/><line x1="2" y1="17" x2="22" y2="17" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "messages" }) {
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
// 🔌 BACKEND SWAP POINT #1 — CHAT CONVERSATIONS LIST
// Replace with: supabase.from('conversations')
//   .select('*,seller(*),last_message(*)')
//   .eq('buyer_id', currentUser.id)
//   .order('updated_at', { ascending: false })
// Real-time: supabase.channel('conversations')
//   .on('postgres_changes', { event: '*',
//        schema: 'public', table: 'conversations',
//        filter: `buyer_id=eq.${currentUser.id}` },
//     payload => updateConversations(payload))
//   .subscribe()
// ============================================================
const MOCK_CONVERSATIONS = [
  {
    id:"CONV-001", sellerId:"SEL-001",
    sellerName:"Tech Master Store", sellerInitials:"TM", sellerColor:"#1D4ED8",
    verified:true, trustScore:98, online:true,
    lastMessage:"Yes we have it in stock! Do you want me to reserve one for you?",
    lastMessageTime:"2m ago", unread:2,
    product:{ name:"iPhone 15 Pro Max 256GB", price:1650000, icon:"laptop" },
  },
  {
    id:"CONV-002", sellerId:"SEL-002",
    sellerName:"Fashion Hub", sellerInitials:"FH", sellerColor:"#6D28D9",
    verified:true, trustScore:96, online:false,
    lastMessage:"We can deliver to Mwanza within 3 days for TSh 8,000 extra.",
    lastMessageTime:"1h ago", unread:0,
    product:{ name:"Designer Handbag Collection", price:180000, icon:"laptop" },
  },
  {
    id:"CONV-003", sellerId:"SEL-003",
    sellerName:"Car Empire", sellerInitials:"CE", sellerColor:"#C0392B",
    verified:true, trustScore:95, online:true,
    lastMessage:"The Toyota Harrier is available for a test drive this weekend.",
    lastMessageTime:"3h ago", unread:1,
    product:{ name:"Toyota Harrier 2020", price:38000000, icon:"truck" },
  },
  {
    id:"CONV-004", sellerId:"SEL-004",
    sellerName:"Home Essentials", sellerInitials:"HE", sellerColor:"#0A7B4B",
    verified:false, trustScore:88, online:false,
    lastMessage:"Thank you for your order! We have shipped your items.",
    lastMessageTime:"1d ago", unread:0,
    product:{ name:"Premium Sofa Set 5-Seater", price:850000, icon:"laptop" },
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — CHAT MESSAGES
// Replace with: supabase.from('messages')
//   .select('*').eq('conversation_id', conversationId)
//   .order('created_at', { ascending: true })
// Real-time: supabase.channel(`messages:${conversationId}`)
//   .on('postgres_changes', { event: 'INSERT',
//        schema: 'public', table: 'messages',
//        filter: `conversation_id=eq.${conversationId}` },
//     payload => setMessages(prev => [...prev, payload.new]))
//   .subscribe()
// ============================================================
const MOCK_MESSAGES = {
  "CONV-001": [
    { id:1,  senderId:"SEL-001", text:"Hello! Welcome to Tech Master Store. How can I help you today?",                        time:"10:00 AM", read:true,  type:"text"    },
    { id:2,  senderId:"ME",      text:"Hi! I'm interested in the iPhone 15 Pro Max 256GB. Is it original?",                   time:"10:02 AM", read:true,  type:"text"    },
    { id:3,  senderId:"SEL-001", text:"Yes! All our phones are 100% original with full manufacturer warranty. 12 months!",    time:"10:03 AM", read:true,  type:"text"    },
    { id:4,  senderId:"ME",      text:"Great! What's the best price you can give me?",                                         time:"10:05 AM", read:true,  type:"text"    },
    { id:5,  senderId:"SEL-001", text:"For you, I can do TSh 1,600,000. That's already TSh 200,000 below market price!",     time:"10:06 AM", read:true,  type:"text"    },
    { id:6,  senderId:"SEL-001", type:"product", product:{ name:"iPhone 15 Pro Max 256GB", price:1600000, original:1800000, icon:"laptop" }, time:"10:06 AM", read:true },
    { id:7,  senderId:"ME",      text:"Can you do TSh 1,550,000? I'll pay immediately via Panda Wallet.",                    time:"10:08 AM", read:true,  type:"text"    },
    { id:8,  senderId:"SEL-001", text:"Deal! TSh 1,550,000 via Panda Escrow. I'll reserve it for you right now.",           time:"10:09 AM", read:true,  type:"text"    },
    { id:9,  senderId:"SEL-001", type:"escrow",  amount:1550000, product:"iPhone 15 Pro Max 256GB",                           time:"10:10 AM", read:true                  },
    { id:10, senderId:"ME",      text:"Perfect! Let me confirm the payment now.",                                              time:"10:11 AM", read:true,  type:"text"    },
    { id:11, senderId:"SEL-001", text:"Yes we have it in stock! Do you want me to reserve one for you?",                     time:"10:15 AM", read:false, type:"text"    },
  ],
};

const QUICK_REPLIES = [
  "Is this available?",
  "What's the best price?",
  "Can you deliver?",
  "Is it original?",
  "I'll pay via Panda Wallet",
  "Can I negotiate?",
];

// ============================================================
// 🧱 MAIN COMPONENT — MarketplaceChat
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"ME", name:"BAK", initials:"B", color:T.navy },

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onProductPress  = () => {},   // → Brick 3 ProductDetails
  onSellerPress   = () => {},   // → Brick 4 SellerProfile
  onPayNow        = () => {},   // → 💰 PandaWallet escrow payment
}) {
  const [view,          setView]          = useState("list");   // "list" | "chat"
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState(MOCK_MESSAGES["CONV-001"] || []);
  const [inputText,     setInputText]     = useState("");
  const [searchText,    setSearchText]    = useState("");
  const [typing,        setTyping]        = useState(false);
  const [showQuickReply,setShowQuickReply]= useState(true);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [escrowModal,   setEscrowModal]   = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior:"smooth" });
    }
  }, [messages]);

  const openChat = (conv) => {
    setActiveConv(conv);
    setMessages(MOCK_MESSAGES[conv.id] || []);
    // Mark as read
    // 🔌 BACKEND — supabase.from('messages').update({ read: true })
    //   .eq('conversation_id', conv.id).eq('read', false)
    setConversations(cs => cs.map(c =>
      c.id === conv.id ? { ...c, unread: 0 } : c
    ));
    setView("chat");
    setShowQuickReply(true);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = {
      id:        messages.length + 1,
      senderId:  "ME",
      text:      text.trim(),
      time:      new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }),
      read:      false,
      type:      "text",
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setShowQuickReply(false);

    // 🔌 BACKEND — supabase.from('messages').insert({
    //   conversation_id: activeConv.id,
    //   sender_id: currentUser.id,
    //   text: text.trim(),
    //   type: 'text'
    // })

    // Simulate seller typing then replying
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id:       prev.length + 1,
        senderId: activeConv.sellerId,
        text:     "Thank you for your message! I will get back to you shortly.",
        time:     new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }),
        read:     false,
        type:     "text",
      }]);
    }, 2000);
  };

  const filteredConvs = conversations.filter(c =>
    c.sellerName.toLowerCase().includes(searchText.toLowerCase()) ||
    c.product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  // ── ESCROW MODAL ──────────────────────────────────────────
  const EscrowModal = ({ data }) => (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }} onClick={() => setEscrowModal(null)}>
      <div onClick={e => e.stopPropagation()} style={{
        background:T.white, borderRadius:"28px 28px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:430,
        animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ width:40, height:4, borderRadius:99,
          background:T.border, margin:"0 auto 24px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <Icon name="shield" size={20} color={T.gold}/>
          <span style={{ fontSize:18, fontWeight:900, color:T.textMain }}>
            Panda Escrow Payment
          </span>
        </div>
        <div style={{ fontSize:13, color:T.textMute, marginBottom:20 }}>
          Your payment is held safely until you confirm delivery
        </div>
        {/* Product */}
        <div style={{ background:T.bg, borderRadius:16, padding:14,
          marginBottom:16, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:48, height:48, borderRadius:13, background:T.navyLight,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="laptop" size={24} color={T.navy+"44"}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
              marginBottom:3 }}>{data.product}</div>
            <div style={{ fontSize:16, fontWeight:900, color:T.navy,
              fontFamily:"monospace" }}>{fmt(data.amount)}</div>
          </div>
        </div>
        {/* Escrow steps */}
        <div style={{ marginBottom:20 }}>
          {[
            { n:1, label:"You Pay",              desc:"Via Panda Wallet", done:true  },
            { n:2, label:"Panda Holds Money",    desc:"Safe escrow",      done:false },
            { n:3, label:"You Confirm Delivery", desc:"After you receive",done:false },
            { n:4, label:"Seller Gets Paid",     desc:"Released to seller",done:false },
          ].map((step,i) => (
            <div key={step.n} style={{ display:"flex", gap:12, marginBottom:i<3?12:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{
                  width:32, height:32, borderRadius:"50%",
                  background: step.done ? T.green : T.navyLight,
                  border:`2px solid ${step.done ? T.green : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0,
                }}>
                  {step.done
                    ? <Icon name="check" size={14} color="#fff"/>
                    : <span style={{ fontSize:12, fontWeight:900,
                        color:T.textMute }}>{step.n}</span>
                  }
                </div>
                {i < 3 && <div style={{ width:2, height:16,
                  background:T.border, marginTop:4 }}/>}
              </div>
              <div style={{ paddingTop:5 }}>
                <div style={{ fontSize:13, fontWeight:800,
                  color:T.textMain }}>{step.label}</div>
                <div style={{ fontSize:11, color:T.textMute }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => {
          setEscrowModal(null);
          // 💰 WALLET — connect to PandaWallet.initiateEscrow()
          onPayNow(data);
        }} style={{
          width:"100%", padding:"16px 0", borderRadius:18,
          background:`linear-gradient(135deg,${T.gold},#A07008)`,
          border:"none", color:"#fff", fontSize:15, fontWeight:900,
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:8,
          boxShadow:`0 8px 24px ${T.gold}44`,
        }}>
          <Icon name="lock" size={16} color="#fff"/>
          Pay {fmt(data.amount)} via Escrow
        </button>
        <div style={{ marginTop:12, textAlign:"center", fontSize:11,
          color:T.textMute, display:"flex", alignItems:"center",
          justifyContent:"center", gap:5 }}>
          <Icon name="shield" size={12} color={T.textMute}/>
          Protected by Panda Escrow
        </div>
      </div>
    </div>
  );

  // ── CONVERSATIONS LIST VIEW ───────────────────────────────
  if (view === "list") return (
    <div style={{
      background:T.bg, minHeight:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:90,
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes typing  { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {/* Top Bar */}
      <div style={{
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
        padding:"14px 20px 12px", position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${T.border}`,
        boxShadow:"0 2px 12px rgba(11,31,75,0.05)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:T.navy,
              letterSpacing:-0.5 }}>Messages</div>
            {totalUnread > 0 && (
              <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>
                {totalUnread} unread message{totalUnread>1?"s":""}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ width:40, height:40, borderRadius:12,
              background:T.navyLight, border:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="more" size={18} color={T.navy}/>
            </button>
          </div>
        </div>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:10,
          background:T.navyLight, border:`1px solid ${T.border}`,
          borderRadius:14, padding:"10px 14px" }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search conversations..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
        </div>
      </div>

      {/* Conversation list */}
      <div style={{ padding:"8px 0" }}>
        {filteredConvs.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:72, height:72, borderRadius:"50%",
              background:T.navyLight, border:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 16px" }}>
              <Icon name="message" size={32} color={T.border}/>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain, marginBottom:8 }}>
              No conversations yet
            </div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Start chatting with sellers to negotiate deals
            </div>
          </div>
        ) : filteredConvs.map((conv, i) => (
          <div key={conv.id} onClick={() => openChat(conv)}
            style={{
              display:"flex", gap:14, alignItems:"center",
              padding:"14px 20px", cursor:"pointer",
              borderBottom:`1px solid ${T.border}`,
              background: conv.unread > 0 ? `${T.navy}04` : T.white,
              transition:"background 0.18s",
              animation:`fadeUp 0.25s ease ${i*0.05}s both`,
            }}>
            {/* Avatar */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{
                width:54, height:54, borderRadius:17,
                background:`linear-gradient(135deg,${conv.sellerColor}22,${conv.sellerColor}44)`,
                border:`2px solid ${conv.sellerColor}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:900, color:conv.sellerColor,
              }}>{conv.sellerInitials}</div>
              {/* Online indicator */}
              <div style={{
                position:"absolute", bottom:1, right:1,
                width:14, height:14, borderRadius:"50%",
                background: conv.online ? T.green : T.textMute,
                border:`2.5px solid ${T.white}`,
              }}/>
              {/* Verified */}
              {conv.verified && (
                <div style={{
                  position:"absolute", top:-3, right:-3,
                  width:18, height:18, borderRadius:"50%",
                  background:T.blue, border:`2px solid ${T.white}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon name="shield" size={9} color="#fff"/>
                </div>
              )}
            </div>
            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:3 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:14, fontWeight: conv.unread>0 ? 900 : 700,
                    color:T.textMain }}>{conv.sellerName}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:3,
                    background:T.greenBg, borderRadius:6, padding:"1px 5px" }}>
                    <div style={{ width:4, height:4, borderRadius:"50%",
                      background:T.green }}/>
                    <span style={{ fontSize:9, fontWeight:800,
                      color:T.green }}>{conv.trustScore}</span>
                  </div>
                </div>
                <span style={{ fontSize:11, color:T.textMute,
                  fontWeight: conv.unread>0 ? 700 : 400 }}>
                  {conv.lastMessageTime}
                </span>
              </div>
              {/* Product pill */}
              <div style={{ display:"flex", alignItems:"center", gap:4,
                background:T.navyLight, borderRadius:7,
                padding:"2px 8px", marginBottom:5,
                width:"fit-content", maxWidth:"80%" }}>
                <Icon name={conv.product.icon} size={10} color={T.textMid}/>
                <span style={{ fontSize:10, fontWeight:700, color:T.textMid,
                  overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap" }}>{conv.product.name}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center" }}>
                <span style={{ fontSize:12, color: conv.unread>0 ? T.textMain : T.textMute,
                  fontWeight: conv.unread>0 ? 600 : 400,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                  maxWidth:"80%" }}>{conv.lastMessage}</span>
                {conv.unread > 0 && (
                  <div style={{ minWidth:20, height:20, borderRadius:99,
                    background:T.navy, display:"flex", alignItems:"center",
                    justifyContent:"center", padding:"0 5px", flexShrink:0 }}>
                    <span style={{ fontSize:10, fontWeight:900,
                      color:"#fff" }}>{conv.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="messages"/>
    </div>
  );

  // ── CHAT VIEW ─────────────────────────────────────────────
  return (
    <div style={{
      background:T.bg, height:"100vh", color:T.textMain,
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes dot1    { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes dot2    { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes dot3    { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
      `}</style>

      {escrowModal && <EscrowModal data={escrowModal}/>}

      {/* Chat Top Bar */}
      <div style={{
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        padding:"12px 16px", borderBottom:`1px solid ${T.border}`,
        boxShadow:"0 2px 12px rgba(11,31,75,0.05)",
        display:"flex", gap:12, alignItems:"center",
        flexShrink:0,
      }}>
        <button onClick={() => setView("list")} style={{
          width:38, height:38, borderRadius:11, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={17} color={T.navy}/>
        </button>
        {/* Seller info — 🧭 NAVIGATE → onSellerPress() → Brick 4 */}
        <div onClick={() => onSellerPress(activeConv.sellerId)}
          style={{ display:"flex", gap:10, alignItems:"center",
            flex:1, cursor:"pointer" }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:42, height:42, borderRadius:13,
              background:`linear-gradient(135deg,${activeConv.sellerColor}22,${activeConv.sellerColor}44)`,
              border:`2px solid ${activeConv.sellerColor}33`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:900, color:activeConv.sellerColor,
            }}>{activeConv.sellerInitials}</div>
            <div style={{
              position:"absolute", bottom:0, right:0,
              width:12, height:12, borderRadius:"50%",
              background: activeConv.online ? T.green : T.textMute,
              border:`2px solid ${T.white}`,
            }}/>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:14, fontWeight:800,
                color:T.textMain }}>{activeConv.sellerName}</span>
              {activeConv.verified && (
                <div style={{ width:16, height:16, borderRadius:"50%",
                  background:T.blue, display:"flex", alignItems:"center",
                  justifyContent:"center" }}>
                  <Icon name="shield" size={8} color="#fff"/>
                </div>
              )}
            </div>
            <div style={{ fontSize:11, color: activeConv.online ? T.green : T.textMute,
              fontWeight:600 }}>
              {activeConv.online ? "Online now" : "Offline"} · Trust {activeConv.trustScore}
            </div>
          </div>
        </div>
        {/* Call/Video actions */}
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ width:36, height:36, borderRadius:10,
            background:T.greenBg, border:`1px solid ${T.green}22`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="phone" size={16} color={T.green}/>
          </button>
          <button style={{ width:36, height:36, borderRadius:10,
            background:T.purpleBg, border:`1px solid ${T.purple}22`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="video" size={16} color={T.purple}/>
          </button>
        </div>
      </div>

      {/* Product context bar — 🧭 NAVIGATE → onProductPress() → Brick 3 */}
      <div onClick={() => onProductPress(activeConv.product)}
        style={{
          background:T.navyLight, borderBottom:`1px solid ${T.border}`,
          padding:"10px 16px", display:"flex", gap:10, alignItems:"center",
          cursor:"pointer", flexShrink:0,
        }}>
        <div style={{ width:36, height:36, borderRadius:10, background:T.white,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name={activeConv.product.icon} size={18} color={T.navy+"44"}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
            overflow:"hidden", textOverflow:"ellipsis",
            whiteSpace:"nowrap" }}>{activeConv.product.name}</div>
          <div style={{ fontSize:11, fontWeight:900, color:T.navy,
            fontFamily:"monospace" }}>{fmt(activeConv.product.price)}</div>
        </div>
        <Icon name="chevronRight" size={14} color={T.textMute}/>
      </div>

      {/* Messages area */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>

        {/* Escrow protection notice */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6,
            background:T.greenBg, border:`1px solid ${T.green}22`,
            borderRadius:12, padding:"6px 14px" }}>
            <Icon name="shield" size={12} color={T.green}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.green }}>
              Protected by Panda Escrow
            </span>
          </div>
        </div>

        {messages.map((msg, i) => {
          const isMe = msg.senderId === "ME";
          const showTime = i === 0 ||
            messages[i-1].senderId !== msg.senderId;

          if (msg.type === "product") return (
            <div key={msg.id} style={{
              display:"flex", justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom:12, animation:"fadeUp 0.2s ease",
            }}>
              <div onClick={() => onProductPress(msg.product)}
                style={{
                  maxWidth:"75%", background:T.white,
                  border:`1px solid ${T.border}`,
                  borderRadius: isMe ? "18px 6px 18px 18px" : "6px 18px 18px 18px",
                  overflow:"hidden", cursor:"pointer",
                  boxShadow:T.shadow,
                }}>
                <div style={{ height:90, background:T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={msg.product.icon} size={40} color={T.navy+"33"}/>
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                    marginBottom:4 }}>{msg.product.name}</div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(msg.product.price)}</span>
                    {msg.product.original && (
                      <span style={{ fontSize:11, color:T.textMute,
                        textDecoration:"line-through",
                        fontFamily:"monospace" }}>{fmt(msg.product.original)}</span>
                    )}
                  </div>
                  <button onClick={e => { e.stopPropagation(); onProductPress(msg.product); }}
                    style={{ marginTop:8, width:"100%", padding:"7px 0",
                      borderRadius:10, background:T.navyLight,
                      border:`1px solid ${T.border}`,
                      fontSize:11, fontWeight:800, color:T.navy }}>
                    View Product
                  </button>
                </div>
              </div>
            </div>
          );

          if (msg.type === "escrow") return (
            <div key={msg.id} style={{
              display:"flex", justifyContent:"center",
              marginBottom:16, animation:"fadeUp 0.2s ease",
            }}>
              <div style={{
                background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
                borderRadius:20, padding:"16px 20px", maxWidth:"85%",
                position:"relative", overflow:"hidden",
              }}>
                <div style={{ position:"absolute", inset:0, opacity:0.05,
                  backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
                  backgroundSize:"12px 12px" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:8,
                  marginBottom:10, position:"relative" }}>
                  <Icon name="shield" size={16} color={T.gold}/>
                  <span style={{ fontSize:12, fontWeight:900, color:T.gold }}>
                    Panda Escrow Request
                  </span>
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)",
                  marginBottom:6, position:"relative" }}>{msg.product}</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#fff",
                  fontFamily:"monospace", marginBottom:14,
                  position:"relative" }}>{fmt(msg.amount)}</div>
                <button onClick={() => setEscrowModal({ amount:msg.amount, product:msg.product })}
                  style={{
                    width:"100%", padding:"11px 0", borderRadius:14,
                    background:`linear-gradient(135deg,${T.gold},#A07008)`,
                    border:"none", color:"#fff", fontSize:13, fontWeight:900,
                    cursor:"pointer", display:"flex", alignItems:"center",
                    justifyContent:"center", gap:7,
                    boxShadow:`0 4px 16px ${T.gold}44`,
                    position:"relative",
                  }}>
                  <Icon name="lock" size={14} color="#fff"/>
                  {/* 💰 WALLET → PandaWallet.initiateEscrow() */}
                  Pay with Panda Escrow
                </button>
              </div>
            </div>
          );

          // Regular text message
          return (
            <div key={msg.id} style={{
              display:"flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom: 8,
              animation:"fadeUp 0.15s ease",
            }}>
              {!isMe && showTime && (
                <div style={{ width:28, height:28, borderRadius:9, flexShrink:0,
                  background:`linear-gradient(135deg,${activeConv.sellerColor}22,${activeConv.sellerColor}44)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:900, color:activeConv.sellerColor,
                  marginRight:8, alignSelf:"flex-end" }}>
                  {activeConv.sellerInitials[0]}
                </div>
              )}
              {!isMe && !showTime && <div style={{ width:36 }}/>}
              <div style={{ maxWidth:"72%" }}>
                <div style={{
                  background: isMe
                    ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
                    : T.white,
                  color: isMe ? "#fff" : T.textMain,
                  borderRadius: isMe ? "18px 6px 18px 18px" : "6px 18px 18px 18px",
                  padding:"11px 14px",
                  fontSize:13, lineHeight:1.55,
                  border: isMe ? "none" : `1px solid ${T.border}`,
                  boxShadow: isMe ? `0 4px 14px ${T.navy}33` : T.shadow,
                }}>
                  {msg.text}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginTop:3 }}>
                  <span style={{ fontSize:10, color:T.textMute }}>{msg.time}</span>
                  {isMe && (
                    <Icon name={msg.read ? "checkDouble" : "check"}
                      size={12} color={msg.read ? T.blue : T.textMute}/>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display:"flex", gap:8, alignItems:"flex-end",
            marginBottom:8, animation:"fadeUp 0.2s ease" }}>
            <div style={{ width:28, height:28, borderRadius:9,
              background:`linear-gradient(135deg,${activeConv.sellerColor}22,${activeConv.sellerColor}44)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:900, color:activeConv.sellerColor }}>
              {activeConv.sellerInitials[0]}
            </div>
            <div style={{ background:T.white, border:`1px solid ${T.border}`,
              borderRadius:"6px 18px 18px 18px", padding:"12px 16px",
              display:"flex", gap:4, alignItems:"center", boxShadow:T.shadow }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                  background:T.textMute,
                  animation:`dot${i+1} 1.2s ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef}/>
      </div>

      {/* Quick replies */}
      {showQuickReply && (
        <div style={{ padding:"0 16px 8px", overflowX:"auto",
          display:"flex", gap:8, flexShrink:0 }}>
          {QUICK_REPLIES.map(reply => (
            <button key={reply} onClick={() => sendMessage(reply)} style={{
              padding:"7px 14px", borderRadius:99, whiteSpace:"nowrap",
              background:T.white, border:`1px solid ${T.border}`,
              fontSize:12, fontWeight:700, color:T.textMid,
              cursor:"pointer", flexShrink:0, transition:"all 0.18s",
            }}>
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        padding:"10px 16px 28px",
        display:"flex", gap:10, alignItems:"flex-end",
        flexShrink:0,
      }}>
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ width:40, height:40, borderRadius:12,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="paperclip" size={17} color={T.textMid}/>
          </button>
          <button style={{ width:40, height:40, borderRadius:12,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="image" size={17} color={T.textMid}/>
          </button>
        </div>
        <div style={{ flex:1, background:T.navyLight, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"10px 14px",
          display:"flex", alignItems:"center", gap:8 }}>
          <input
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key==="Enter" && sendMessage(inputText)}
            placeholder="Type a message..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}
          />
          <button style={{ width:28, height:28, borderRadius:8, background:"none",
            border:"none", display:"flex", alignItems:"center",
            justifyContent:"center" }}>
            <Icon name="smile" size={18} color={T.textMute}/>
          </button>
        </div>
        <button onClick={() => sendMessage(inputText)} style={{
          width:44, height:44, borderRadius:14, flexShrink:0,
          background: inputText.trim()
            ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
            : T.navyLight,
          border: inputText.trim() ? "none" : `1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s",
          boxShadow: inputText.trim() ? `0 4px 16px ${T.navy}44` : "none",
        }}>
          {inputText.trim()
            ? <Icon name="send" size={18} color="#fff"/>
            : <Icon name="mic" size={18} color={T.textMute}/>
          }
        </button>
      </div>
    </div>
  );
}
