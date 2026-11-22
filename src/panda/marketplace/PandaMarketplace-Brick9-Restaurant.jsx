import { useState } from "react";

// ============================================================
// 🧱 BRICK 9 — RESTAURANT ORDERING SYSTEM
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 💰  Wallet hooks marked with:        // 💰 WALLET
// 🔐  Security notes marked with:      // 🔐 SECURITY
// 📦  Assembly: export RestaurantOrdering from this file
//     Props: { restaurantId, currentUser, onBack,
//              onTrackOrder, onChatSeller, onWalletPay }
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
  orange:    "#EA580C",
  orangeBg:  "#FFF7ED",
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
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} stroke="none"/>,
    starEmpty:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="1.4"/>,
    clock:        <><circle cx="12" cy="12" r="10" {...s}/><polyline points="12 6 12 12 16 14" {...s}/></>,
    truck:        <><rect x="1" y="3" width="15" height="13" {...s}/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...s}/><circle cx="5.5" cy="18.5" r="2.5" {...s}/><circle cx="18.5" cy="18.5" r="2.5" {...s}/></>,
    mapPin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...s}/><circle cx="12" cy="10" r="3" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    minus:        <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke={color} strokeWidth="1.4"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...s}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...s}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    robot:        <><rect x="3" y="11" width="18" height="10" rx="2" {...s}/><path d="M12 11V7" {...s}/><circle cx="12" cy="5" r="2" {...s}/><line x1="8" y1="15" x2="8" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="15" x2="16" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    utensils:     <><line x1="3" y1="2" x2="3" y2="22" {...s}/><path d="M7 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" {...s}/><path d="M21 2v22" {...s}/><path d="M21 7H7" {...s}/></>,
    fire:         <><path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4 0 0-1-4-1-8z" fill={color} stroke={color} strokeWidth="0.5"/></>,
    leaf:         <><path d="M17 8C8 10 5.9 16.17 3.82 22.5L2 22l1-10a9 9 0 0 1 9-9 8.41 8.41 0 0 1 5.82 2.29l.18-1.29" {...s}/></>,
    coffee:       <><path d="M18 8h1a4 4 0 0 1 0 8h-1" {...s}/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" {...s}/><line x1="6" y1="1" x2="6" y2="4" {...s}/><line x1="10" y1="1" x2="10" y2="4" {...s}/><line x1="14" y1="1" x2="14" y2="4" {...s}/></>,
    cake:         <><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" {...s}/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" {...s}/><line x1="2" y1="21" x2="22" y2="21" {...s}/><line x1="7" y1="8" x2="7" y2="11" {...s}/><line x1="12" y1="8" x2="12" y2="11" {...s}/><line x1="17" y1="8" x2="17" y2="11" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...s}/><line x1="12" y1="8" x2="12" y2="12" {...s}/><line x1="12" y1="16" x2="12.01" y2="16" {...s}/></>,
    award:        <><circle cx="12" cy="8" r="6" {...s}/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" {...s}/></>,
    percent:      <><line x1="19" y1="5" x2="5" y2="19" {...s}/><circle cx="6.5" cy="6.5" r="2.5" {...s}/><circle cx="17.5" cy="17.5" r="2.5" {...s}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "discover" }) {
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
// 🔌 BACKEND SWAP POINT #1 — RESTAURANT DATA
// Replace with: supabase.from('restaurants')
//   .select('*,reviews(*),menu_categories(*,menu_items(*))')
//   .eq('id', restaurantId).single()
// ============================================================
const MOCK_RESTAURANT = {
  id:           "REST-001",
  name:         "Mama Fatuma Kitchen",
  tagline:      "Authentic Tanzanian flavours — cooked fresh daily",
  cuisine:      "Tanzanian · Swahili · Local",
  rating:       4.8,
  reviewCount:  1240,
  deliveryTime: "25–40 min",
  deliveryFee:  3000,
  minOrder:     15000,
  distance:     "1.2 km",
  openNow:      true,
  trustScore:   96,
  verified:     true,
  promo:        "20% OFF on orders above TSh 30,000",
  badges:       ["Halal Certified","Top Rated","Fast Delivery"],
  color:        T.orange,
  initials:     "MF",
};

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — MENU DATA
// Replace with: supabase.from('menu_categories')
//   .select('*,menu_items(*)')
//   .eq('restaurant_id', restaurantId)
//   .eq('available', true).order('sort_order')
// ============================================================
const MOCK_MENU = [
  {
    id:"cat-1", label:"Popular", icon:"fire",
    items: [
      { id:1, name:"Ugali na Nyama Choma",    desc:"Traditional ugali with grilled goat meat, kachumbari & chili sauce",       price:18000, original:22000, calories:"850 kcal", tags:["Halal","Spicy"],     rating:4.9, orders:2840, icon:"fire",     popular:true  },
      { id:2, name:"Pilau ya Kuku",           desc:"Fragrant spiced rice with tender chicken, served with raita",              price:16000, original:null,  calories:"720 kcal", tags:["Halal"],             rating:4.8, orders:1920, icon:"utensils", popular:true  },
      { id:3, name:"Biryani Mchanganyiko",   desc:"Mixed meat biryani with beef, chicken & vegetables, authentic spices",    price:22000, original:28000, calories:"950 kcal", tags:["Halal","Spicy"],     rating:4.9, orders:3100, icon:"fire",     popular:true  },
    ],
  },
  {
    id:"cat-2", label:"Starters", icon:"leaf",
    items: [
      { id:4, name:"Sambusa za Nyama",        desc:"Crispy beef sambusa, 4 pieces, served with tamarind chutney",             price:6000,  original:null,  calories:"320 kcal", tags:["Halal"],             rating:4.7, orders:980,  icon:"leaf",     popular:false },
      { id:5, name:"Maandazi ya Asali",       desc:"Fresh Swahili donuts drizzled with honey & coconut milk",                price:4000,  original:null,  calories:"240 kcal", tags:["Vegetarian"],        rating:4.6, orders:760,  icon:"cake",     popular:false },
      { id:6, name:"Kachumbari Salad",        desc:"Fresh tomato, onion & coriander salad with lemon dressing",              price:5000,  original:null,  calories:"90 kcal",  tags:["Vegetarian","Vegan"],rating:4.5, orders:540,  icon:"leaf",     popular:false },
    ],
  },
  {
    id:"cat-3", label:"Main Course", icon:"utensils",
    items: [
      { id:7, name:"Mchuzi wa Samaki",        desc:"Coconut fish curry with whole red snapper, served with rice",             price:24000, original:null,  calories:"680 kcal", tags:["Halal"],             rating:4.8, orders:1340, icon:"utensils", popular:false },
      { id:8, name:"Mbuzi wa Kupika",         desc:"Slow-cooked goat stew with tomatoes & spices, served with chapati",     price:20000, original:25000, calories:"780 kcal", tags:["Halal","Spicy"],     rating:4.7, orders:890,  icon:"utensils", popular:false },
      { id:9, name:"Chips Kuku",              desc:"Crispy golden chips with flame-grilled chicken & homemade sauce",        price:14000, original:null,  calories:"820 kcal", tags:["Halal"],             rating:4.6, orders:2100, icon:"fire",     popular:true  },
    ],
  },
  {
    id:"cat-4", label:"Drinks", icon:"coffee",
    items: [
      { id:10, name:"Juice ya Embe",          desc:"Fresh mango juice, no added sugar, chilled",                             price:4000,  original:null,  calories:"180 kcal", tags:["Vegan","Fresh"],     rating:4.8, orders:1560, icon:"coffee",   popular:false },
      { id:11, name:"Chai ya Tangawizi",      desc:"Spiced ginger tea with fresh milk — Swahili style",                     price:3000,  original:null,  calories:"120 kcal", tags:["Halal"],             rating:4.9, orders:2200, icon:"coffee",   popular:true  },
      { id:12, name:"Uji wa Mtama",           desc:"Warm millet porridge with coconut milk & cinnamon",                     price:5000,  original:null,  calories:"290 kcal", tags:["Vegan","Traditional"],rating:4.7,orders:680,  icon:"coffee",   popular:false },
    ],
  },
  {
    id:"cat-5", label:"Desserts", icon:"cake",
    items: [
      { id:13, name:"Halua ya Nazi",          desc:"Coconut halwa — traditional Zanzibar sweet, served warm",               price:6000,  original:null,  calories:"380 kcal", tags:["Vegetarian","Sweet"], rating:4.9, orders:920,  icon:"cake",     popular:true  },
      { id:14, name:"Kaimati na Asali",       desc:"Fried dough balls in honey syrup, 6 pieces",                            price:5000,  original:null,  calories:"420 kcal", tags:["Vegetarian"],         rating:4.7, orders:640,  icon:"cake",     popular:false },
    ],
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — DELIVERY ADDRESSES
// Replace with: supabase.from('user_addresses')
//   .select('*').eq('user_id', currentUser.id)
//   .order('is_default', { ascending: false })
// ============================================================
const MOCK_ADDRESSES = [
  { id:1, label:"Home",   address:"Sinza, Dar es Salaam",         default:true  },
  { id:2, label:"Office", address:"Kariakoo, Dar es Salaam",      default:false },
];

const TAG_COLORS = {
  "Halal":        { color:T.green,  bg:T.greenBg   },
  "Vegetarian":   { color:T.green,  bg:T.greenBg   },
  "Vegan":        { color:T.green,  bg:T.greenBg   },
  "Spicy":        { color:T.red,    bg:T.redBg     },
  "Fresh":        { color:T.blue,   bg:T.blueBg    },
  "Traditional":  { color:T.gold,   bg:T.goldLight },
  "Sweet":        { color:T.purple, bg:T.purpleBg  },
};

// ============================================================
// 🧱 MAIN COMPONENT — RestaurantOrdering
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"user-001", name:"BAK", initials:"B" },
  restaurant      = MOCK_RESTAURANT,
  menu            = MOCK_MENU,
  addresses       = MOCK_ADDRESSES,

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onTrackOrder    = () => {},   // → Brick 8 Logistics Tracking
  onChatSeller    = () => {},   // → Brick 6 Marketplace Chat
  // 💰 WALLET
  onWalletPay     = () => {},   // → PandaWallet.initiateEscrow()
}) {
  const [activeCategory, setActiveCategory] = useState("cat-1");
  const [cart,           setCart]           = useState({});
  const [cartOpen,       setCartOpen]       = useState(false);
  const [checkoutOpen,   setCheckoutOpen]   = useState(false);
  const [orderPlaced,    setOrderPlaced]    = useState(false);
  const [wishlist,       setWishlist]       = useState({});
  const [searchText,     setSearchText]     = useState("");
  const [specialNote,    setSpecialNote]    = useState("");
  const [selectedAddr,   setSelectedAddr]   = useState(0);
  const [toast,          setToast]          = useState(null);
  const [aiOpen,         setAiOpen]         = useState(false);
  const [aiInput,        setAiInput]        = useState("");
  const [aiMessages,     setAiMessages]     = useState([
    { role:"ai", text:"Habari! I'm Panda AI 🐼 I can help you find the perfect meal. What are you in the mood for today?" }
  ]);
  const [aiLoading,      setAiLoading]      = useState(false);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // Cart helpers
  const addToCart = (item) => {
    setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    showToast(`${item.name} added to cart`, T.green);
  };

  const removeFromCart = (item) => {
    setCart(c => {
      const qty = (c[item.id] || 0) - 1;
      if (qty <= 0) { const n = { ...c }; delete n[item.id]; return n; }
      return { ...c, [item.id]: qty };
    });
  };

  const cartItems = menu.flatMap(cat => cat.items)
    .filter(item => cart[item.id] > 0)
    .map(item => ({ ...item, qty: cart[item.id] }));

  const cartCount    = Object.values(cart).reduce((s, n) => s + n, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const qualifyPromo = cartSubtotal >= 30000;
  const discount     = qualifyPromo ? Math.round(cartSubtotal * 0.2) : 0;
  const deliveryFee  = cartSubtotal >= restaurant.minOrder ? restaurant.deliveryFee : restaurant.deliveryFee + 2000;
  const total        = cartSubtotal - discount + deliveryFee;

  const allItems = menu.flatMap(cat => cat.items);
  const filtered = searchText
    ? allItems.filter(i => i.name.toLowerCase().includes(searchText.toLowerCase()))
    : null;

  // AI Food Assistant
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(m => [...m, { role:"user", text:userMsg }]);
    setAiLoading(true);

    // 🔌 BACKEND — API call goes through Supabase Edge Function
    // 🔐 SECURITY — Anthropic API key stored in Edge Function only
    // Replace with: const res = await supabase.functions.invoke('ai-food-assistant', {
    //   body: { message: userMsg, restaurant_id: restaurant.id,
    //           menu: menu, user_id: currentUser.id }
    // })
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:200,
          system:`You are Panda AI, a friendly food assistant for ${restaurant.name}, a Tanzanian restaurant. 
          Menu items: ${menu.flatMap(c=>c.items).map(i=>`${i.name} (${fmt(i.price)})`).join(', ')}.
          Keep responses short, helpful, and friendly. Recommend specific dishes. Use some Swahili greetings.`,
          messages:[{ role:"user", content:userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Samahani, let me help you find something delicious!";
      setAiMessages(m => [...m, { role:"ai", text:reply }]);
    } catch {
      setAiMessages(m => [...m, { role:"ai", text:"Samahani! I'm having trouble connecting. Try asking me about our popular dishes!" }]);
    }
    setAiLoading(false);
  };

  // ── ORDER SUCCESS ────────────────────────────────────────────
  if (orderPlaced) return (
    <div style={{
      background:T.bg, minHeight:"100vh",
      fontFamily:"'Inter','Plus Jakarta Sans','Segoe UI',sans-serif",
      maxWidth:430, margin:"0 auto",
      display:"flex", alignItems:"center",
      justifyContent:"center", padding:24,
    }}>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; }
        button { font-family:inherit; cursor:pointer; border:none; }
      `}</style>
      <div style={{ width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:"56px", marginBottom:16,
          animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🍽️</div>
        <div style={{ fontSize:24, fontWeight:900, color:T.textMain,
          marginBottom:8, letterSpacing:-0.5 }}>Order Placed!</div>
        <div style={{ fontSize:13, color:T.textMute, lineHeight:1.7,
          marginBottom:6 }}>
          Your order from {restaurant.name} has been received and payment is held in Panda Escrow.
        </div>
        <div style={{ display:"inline-block", background:T.navyLight,
          borderRadius:10, padding:"7px 18px",
          fontSize:14, fontWeight:900, color:T.navy,
          fontFamily:"monospace", letterSpacing:1, marginBottom:28 }}>
          ORD-{Math.floor(100000 + Math.random()*900000)}
        </div>
        {/* ETA */}
        <div style={{ background:T.card, borderRadius:22, padding:"20px",
          border:`1px solid ${T.border}`, boxShadow:T.shadow, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-around" }}>
            {[
              { label:"Preparing",  time:"10 min",  color:T.amber  },
              { label:"On The Way", time:"20 min",  color:T.blue   },
              { label:"Delivered",  time:"40 min",  color:T.green  },
            ].map((step,i) => (
              <div key={step.label} style={{ textAlign:"center" }}>
                <div style={{ width:44, height:44, borderRadius:"50%",
                  background:step.color+"14", border:`2px solid ${step.color}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 8px" }}>
                  <Icon name={i===0?"utensils":i===1?"truck":"check"}
                    size={18} color={step.color}/>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:T.textMain }}>{step.label}</div>
                <div style={{ fontSize:10, color:T.textMute }}>{step.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onBack} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:T.navyLight, border:`1px solid ${T.border}`,
            fontSize:13, fontWeight:800, color:T.textMid,
          }}>Back to Menu</button>
          {/* 🧭 NAVIGATE → Brick 8 Logistics Tracking */}
          <button onClick={onTrackOrder} style={{
            flex:1, padding:"14px 0", borderRadius:16,
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            border:"none", color:"#fff", fontSize:13, fontWeight:900,
            boxShadow:`0 6px 20px ${T.gold}44`,
          }}>Track Order</button>
        </div>
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
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input,textarea  { font-family:inherit; }
        input::placeholder,textarea::placeholder { color:${T.textMute}; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:110, left:"50%", transform:"translateX(-50%)",
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

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:998,
          background:"rgba(11,31,75,0.5)", backdropFilter:"blur(6px)",
          display:"flex", justifyContent:"flex-end" }}
          onClick={() => setCartOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width:"100%", maxWidth:430, background:T.white,
            height:"100%", overflowY:"auto",
            animation:"slideIn 0.3s ease",
            display:"flex", flexDirection:"column",
          }}>
            {/* Cart header */}
            <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${T.border}`,
              display:"flex", justifyContent:"space-between", alignItems:"center",
              position:"sticky", top:0, background:T.white, zIndex:1 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:T.textMain }}>Your Order</div>
                <div style={{ fontSize:12, color:T.textMute }}>
                  {cartCount} item{cartCount!==1?"s":""} · {restaurant.name}
                </div>
              </div>
              <button onClick={() => setCartOpen(false)} style={{
                width:36, height:36, borderRadius:10, background:T.navyLight,
                border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="x" size={16} color={T.textMute}/>
              </button>
            </div>

            {/* Promo banner */}
            {!qualifyPromo && (
              <div style={{ background:T.orangeBg, borderBottom:`1px solid ${T.orange}22`,
                padding:"10px 20px", display:"flex", gap:8, alignItems:"center" }}>
                <Icon name="percent" size={14} color={T.orange}/>
                <span style={{ fontSize:12, fontWeight:700, color:T.orange }}>
                  Add {fmt(30000 - cartSubtotal)} more for 20% OFF!
                </span>
              </div>
            )}
            {qualifyPromo && (
              <div style={{ background:T.greenBg, borderBottom:`1px solid ${T.green}22`,
                padding:"10px 20px", display:"flex", gap:8, alignItems:"center" }}>
                <Icon name="award" size={14} color={T.green}/>
                <span style={{ fontSize:12, fontWeight:700, color:T.green }}>
                  20% discount applied! You save {fmt(discount)}
                </span>
              </div>
            )}

            {/* Cart items */}
            <div style={{ flex:1, padding:"8px 20px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontSize:"48px", marginBottom:12 }}>🍽️</div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
                    marginBottom:8 }}>Cart is empty</div>
                  <div style={{ fontSize:13, color:T.textMute }}>
                    Add delicious items from the menu
                  </div>
                </div>
              ) : cartItems.map((item, i) => (
                <div key={item.id} style={{ display:"flex", gap:12,
                  padding:"14px 0",
                  borderBottom:i < cartItems.length-1 ? `1px solid ${T.border}` : "none",
                  alignItems:"center" }}>
                  <div style={{ width:52, height:52, borderRadius:14,
                    background:T.orangeBg, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={item.icon} size={24} color={T.orange}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
                      marginBottom:3, overflow:"hidden",
                      textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                    <div style={{ fontSize:13, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(item.price)}</div>
                  </div>
                  {/* Qty controls */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                    <button onClick={() => removeFromCart(item)} style={{
                      width:30, height:30, borderRadius:9,
                      background:T.navyLight, border:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <Icon name="minus" size={13} color={T.textMid}/>
                    </button>
                    <span style={{ fontSize:15, fontWeight:900,
                      color:T.textMain, minWidth:20, textAlign:"center" }}>
                      {item.qty}
                    </span>
                    <button onClick={() => addToCart(item)} style={{
                      width:30, height:30, borderRadius:9,
                      background:`linear-gradient(135deg,${T.orange},#C44A09)`,
                      border:"none",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <Icon name="plus" size={13} color="#fff"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special instructions */}
            {cartItems.length > 0 && (
              <div style={{ padding:"0 20px 16px" }}>
                <textarea value={specialNote}
                  onChange={e => setSpecialNote(e.target.value)}
                  placeholder="Special instructions (e.g. no chili, extra sauce...)"
                  rows={2} style={{ width:"100%", background:T.navyLight,
                    border:`1.5px solid ${T.border}`, borderRadius:14,
                    padding:"12px 14px", color:T.textMain,
                    fontSize:12, outline:"none", resize:"none",
                    boxSizing:"border-box" }}/>
              </div>
            )}

            {/* Order summary */}
            {cartItems.length > 0 && (
              <div style={{ padding:"0 20px 28px", borderTop:`1px solid ${T.border}` }}>
                <div style={{ marginTop:16, marginBottom:16 }}>
                  {[
                    ["Subtotal",  fmt(cartSubtotal)],
                    ["Discount",  qualifyPromo ? `-${fmt(discount)}` : "–"],
                    ["Delivery",  fmt(deliveryFee)],
                  ].map(([l,v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between",
                      padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
                      <span style={{ fontSize:13, color:T.textMute }}>{l}</span>
                      <span style={{ fontSize:13, fontWeight:800,
                        color: l==="Discount" && qualifyPromo ? T.green : T.textMain,
                        fontFamily:"monospace" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between",
                    padding:"12px 0" }}>
                    <span style={{ fontSize:16, fontWeight:900, color:T.textMain }}>Total</span>
                    <span style={{ fontSize:17, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(total)}</span>
                  </div>
                </div>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{
                  width:"100%", padding:"16px 0", borderRadius:18,
                  background:`linear-gradient(135deg,${T.gold},#A07008)`,
                  border:"none", color:"#fff", fontSize:15, fontWeight:900,
                  cursor:"pointer", display:"flex", alignItems:"center",
                  justifyContent:"center", gap:8,
                  boxShadow:`0 6px 20px ${T.gold}44`,
                }}>
                  <Icon name="zap" size={18} color="#fff"/>
                  Checkout · {fmt(total)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:999,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setCheckoutOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"28px 24px 40px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 24px" }}/>
            <div style={{ fontSize:18, fontWeight:900, color:T.textMain,
              marginBottom:20 }}>Confirm Order</div>

            {/* Delivery address */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMute,
                textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>
                Deliver To
              </div>
              {addresses.map(addr => (
                <div key={addr.id} onClick={() => setSelectedAddr(addr.id)}
                  style={{ display:"flex", gap:12, alignItems:"center",
                    padding:"12px 16px", borderRadius:14, marginBottom:8,
                    border:`1.5px solid ${selectedAddr===addr.id ? T.navy : T.border}`,
                    background:selectedAddr===addr.id ? T.navyLight : T.white,
                    cursor:"pointer" }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:selectedAddr===addr.id ? T.navy : T.navyLight,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="mapPin" size={16}
                      color={selectedAddr===addr.id ? "#fff" : T.textMid}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800,
                      color:T.textMain }}>{addr.label}</div>
                    <div style={{ fontSize:11, color:T.textMute }}>{addr.address}</div>
                  </div>
                  {selectedAddr===addr.id && (
                    <div style={{ width:20, height:20, borderRadius:"50%",
                      background:T.navy,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="check" size={11} color="#fff"/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order total */}
            <div style={{ background:T.bg, borderRadius:16, padding:"14px 16px",
              marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginBottom:8 }}>
                <span style={{ fontSize:13, color:T.textMute }}>
                  {cartCount} item{cartCount!==1?"s":""} · {restaurant.name}
                </span>
                <span style={{ fontSize:13, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(cartSubtotal)}</span>
              </div>
              {qualifyPromo && (
                <div style={{ display:"flex", justifyContent:"space-between",
                  marginBottom:8 }}>
                  <span style={{ fontSize:13, color:T.green }}>Promo Discount</span>
                  <span style={{ fontSize:13, fontWeight:900, color:T.green,
                    fontFamily:"monospace" }}>-{fmt(discount)}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between",
                marginBottom:8 }}>
                <span style={{ fontSize:13, color:T.textMute }}>Delivery Fee</span>
                <span style={{ fontSize:13, fontWeight:900, color:T.textMain,
                  fontFamily:"monospace" }}>{fmt(deliveryFee)}</span>
              </div>
              <div style={{ height:1, background:T.border, margin:"10px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:15, fontWeight:900, color:T.textMain }}>Total</span>
                <span style={{ fontSize:16, fontWeight:900, color:T.navy,
                  fontFamily:"monospace" }}>{fmt(total)}</span>
              </div>
            </div>

            {/* Escrow notice */}
            <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
              borderRadius:16, padding:"14px 18px", marginBottom:20,
              display:"flex", gap:12, alignItems:"center" }}>
              <Icon name="shield" size={20} color={T.gold}/>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>
                  Panda Escrow Protected
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>
                  Payment held until you confirm delivery
                </div>
              </div>
            </div>

            <button onClick={() => {
              setCheckoutOpen(false);
              setCart({});
              setOrderPlaced(true);
              // 💰 WALLET — connect to PandaWallet.initiateEscrow()
              // 🔐 SECURITY — payment processing in Supabase Edge Function
              // 🔌 BACKEND — supabase.from('orders').insert({
              //   restaurant_id: restaurant.id, buyer_id: currentUser.id,
              //   items: cartItems, total, delivery_address_id: selectedAddr,
              //   special_note: specialNote, status: 'placed'
              // })
              onWalletPay({ total, restaurantId: restaurant.id });
            }} style={{
              width:"100%", padding:"16px 0", borderRadius:18,
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              border:"none", color:"#fff", fontSize:15, fontWeight:900,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:8,
              boxShadow:`0 6px 20px ${T.gold}44`,
            }}>
              <Icon name="lock" size={17} color="#fff"/>
              Pay {fmt(total)} via Panda Wallet
            </button>
          </div>
        </div>
      )}

      {/* ── AI FOOD ASSISTANT MODAL ── */}
      {aiOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:998,
          background:"rgba(11,31,75,0.6)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setAiOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            width:"100%", maxWidth:430, height:"65vh",
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
            display:"flex", flexDirection:"column",
          }}>
            {/* AI Header */}
            <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${T.border}`,
              background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
              borderRadius:"28px 28px 0 0",
              display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:40, height:40, borderRadius:12,
                background:"rgba(255,255,255,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:20 }}>🐼</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>
                  Panda AI Food Assistant
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>
                  Ask me anything about the menu
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} style={{
                width:32, height:32, borderRadius:9,
                background:"rgba(255,255,255,0.15)", border:"none",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="x" size={15} color="#fff"/>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ display:"flex",
                  justifyContent:msg.role==="user" ? "flex-end" : "flex-start",
                  marginBottom:12 }}>
                  {msg.role === "ai" && (
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                      background:T.purpleBg, marginRight:8, alignSelf:"flex-end",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14 }}>🐼</div>
                  )}
                  <div style={{
                    maxWidth:"78%", padding:"11px 14px",
                    borderRadius:msg.role==="user"
                      ? "18px 6px 18px 18px" : "6px 18px 18px 18px",
                    background:msg.role==="user"
                      ? `linear-gradient(135deg,${T.navy},${T.navyMid})`
                      : T.purpleBg,
                    color:msg.role==="user" ? "#fff" : T.purple,
                    fontSize:13, lineHeight:1.55,
                    border:msg.role==="ai" ? `1px solid ${T.purple}22` : "none",
                    boxShadow:T.shadow,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ fontSize:14 }}>🐼</div>
                  <div style={{ background:T.purpleBg, border:`1px solid ${T.purple}22`,
                    borderRadius:"6px 18px 18px 18px", padding:"12px 16px",
                    display:"flex", gap:4 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                        background:T.purple, opacity:0.5,
                        animation:`pulse 1.2s ${i*0.2}s infinite` }}/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div style={{ padding:"0 20px 8px", display:"flex", gap:8, overflowX:"auto" }}>
              {["What's popular?","Vegetarian options?","Best under TSh 15K","Spicy dishes"].map(p => (
                <button key={p} onClick={() => { setAiInput(p); }}
                  style={{ padding:"6px 12px", borderRadius:99, whiteSpace:"nowrap",
                    background:T.purpleBg, border:`1px solid ${T.purple}22`,
                    fontSize:11, fontWeight:700, color:T.purple, flexShrink:0 }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:"8px 20px 28px",
              borderTop:`1px solid ${T.border}`,
              display:"flex", gap:10, alignItems:"center" }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && sendAiMessage()}
                placeholder="Ask about the menu..."
                style={{ flex:1, background:T.navyLight,
                  border:`1px solid ${T.border}`, borderRadius:14,
                  padding:"12px 14px", color:T.textMain,
                  fontSize:13, outline:"none" }}/>
              <button onClick={sendAiMessage} style={{
                width:44, height:44, borderRadius:14,
                background:aiInput.trim()
                  ? `linear-gradient(135deg,${T.purple},#4C1D95)`
                  : T.navyLight,
                border:aiInput.trim() ? "none" : `1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="zap" size={18} color={aiInput.trim() ? "#fff" : T.textMute}/>
              </button>
            </div>
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
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:14, fontWeight:800, color:T.textMain }}>
          {restaurant.name}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setAiOpen(true)} style={{
            width:40, height:40, borderRadius:12,
            background:T.purpleBg, border:`1px solid ${T.purple}22`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="robot" size={18} color={T.purple}/>
          </button>
          <button onClick={onChatSeller} style={{
            width:40, height:40, borderRadius:12,
            background:T.navyLight, border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon name="message" size={18} color={T.navy}/>
          </button>
        </div>
      </div>

      {/* ── RESTAURANT COVER ── */}
      <div style={{ position:"relative" }}>
        <div style={{ height:180, overflow:"hidden",
          background:`linear-gradient(135deg,${T.orange}22,${T.amber}33)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",
            backgroundSize:"20px 20px" }}/>
          <div style={{ fontSize:"72px", opacity:0.3 }}>🍽️</div>
          {/* Open/Closed */}
          <div style={{ position:"absolute", top:14, right:14,
            display:"flex", alignItems:"center", gap:5,
            background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
            borderRadius:99, padding:"5px 12px",
            boxShadow:T.shadow }}>
            <div style={{ width:7, height:7, borderRadius:"50%",
              background:restaurant.openNow ? T.green : T.red,
              animation:restaurant.openNow ? "pulse 2s infinite" : "none" }}/>
            <span style={{ fontSize:11, fontWeight:800,
              color:restaurant.openNow ? T.green : T.red }}>
              {restaurant.openNow ? "Open Now" : "Closed"}
            </span>
          </div>
          {/* Promo */}
          {restaurant.promo && (
            <div style={{ position:"absolute", bottom:14, left:14,
              background:T.red, borderRadius:10, padding:"5px 12px" }}>
              <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>
                {restaurant.promo}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── RESTAURANT INFO ── */}
        <div style={{ background:T.card, borderRadius:22, padding:"18px 20px",
          boxShadow:T.shadow, marginBottom:14, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8,
                marginBottom:5, flexWrap:"wrap" }}>
                <div style={{ fontSize:20, fontWeight:900, color:T.textMain,
                  letterSpacing:-0.4 }}>{restaurant.name}</div>
                {restaurant.verified && (
                  <div style={{ width:22, height:22, borderRadius:"50%",
                    background:T.blue,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="shield" size={11} color="#fff"/>
                  </div>
                )}
              </div>
              <div style={{ fontSize:12, color:T.textMute, marginBottom:8 }}>
                {restaurant.cuisine}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <Icon name="star" size={13} color={T.gold}/>
                  <span style={{ fontSize:13, fontWeight:800, color:T.textMid }}>
                    {restaurant.rating}
                  </span>
                  <span style={{ fontSize:12, color:T.textMute }}>
                    ({restaurant.reviewCount.toLocaleString()})
                  </span>
                </div>
                <div style={{ width:3, height:3, borderRadius:"50%", background:T.border }}/>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <Icon name="mapPin" size={12} color={T.textMute}/>
                  <span style={{ fontSize:12, color:T.textMute }}>{restaurant.distance}</span>
                </div>
              </div>
            </div>
            {/* Trust score */}
            <div style={{ width:52, height:52, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(${T.green} ${restaurant.trustScore*3.6}deg, ${T.border} 0deg)`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:44, height:44, borderRadius:"50%",
                background:T.white, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:900, color:T.green,
                  lineHeight:1 }}>{restaurant.trustScore}</span>
                <span style={{ fontSize:8, color:T.textMute }}>Trust</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
            {restaurant.badges.map(b => (
              <div key={b} style={{ background:T.greenBg,
                border:`1px solid ${T.green}22`, borderRadius:8,
                padding:"3px 9px", fontSize:10, fontWeight:800, color:T.green }}>
                {b}
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { icon:"clock", label:"Delivery",  value:restaurant.deliveryTime, color:T.blue   },
              { icon:"truck", label:"Delivery Fee", value:fmt(restaurant.deliveryFee), color:T.orange },
              { icon:"zap",   label:"Min Order", value:fmt(restaurant.minOrder), color:T.gold  },
            ].map(item => (
              <div key={item.label} style={{ background:T.bg, borderRadius:14,
                padding:"10px 8px", textAlign:"center",
                border:`1px solid ${T.border}` }}>
                <div style={{ width:28, height:28, borderRadius:8,
                  background:item.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 6px" }}>
                  <Icon name={item.icon} size={14} color={item.color}/>
                </div>
                <div style={{ fontSize:11, fontWeight:900, color:T.navy,
                  fontFamily:"monospace", marginBottom:2 }}>{item.value}</div>
                <div style={{ fontSize:9, color:T.textMute, fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.3 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{ display:"flex", alignItems:"center", gap:10,
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:16,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search menu items..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
          {searchText && (
            <button onClick={() => setSearchText("")} style={{
              background:"none", border:"none",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="x" size={16} color={T.textMute}/>
            </button>
          )}
        </div>

        {/* ── SEARCH RESULTS ── */}
        {searchText && filtered && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.textMute,
              marginBottom:12 }}>{filtered.length} result{filtered.length!==1?"s":""} for "{searchText}"</div>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"30px 0" }}>
                <div style={{ fontSize:13, color:T.textMute }}>No items found</div>
              </div>
            ) : filtered.map(item => (
              <FoodCard key={item.id} item={item} cart={cart}
                onAdd={addToCart} onRemove={removeFromCart}
                wishlist={wishlist} setWishlist={setWishlist}/>
            ))}
          </div>
        )}

        {/* ── CATEGORY TABS ── */}
        {!searchText && (
          <>
            <div style={{ display:"flex", gap:8, overflowX:"auto",
              marginBottom:16, paddingBottom:2 }}>
              {menu.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"8px 16px", borderRadius:99, flexShrink:0,
                  background: activeCategory===cat.id ? T.navy : T.card,
                  border: activeCategory===cat.id ? "none" : `1px solid ${T.border}`,
                  color: activeCategory===cat.id ? "#fff" : T.textMid,
                  fontSize:12, fontWeight:700,
                  transition:"all 0.18s",
                  boxShadow: activeCategory===cat.id ? `0 4px 12px ${T.navy}33` : T.shadow,
                }}>
                  <Icon name={cat.icon} size={13}
                    color={activeCategory===cat.id ? "#fff" : T.textMid}/>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ── MENU ITEMS ── */}
            {menu.filter(cat => cat.id === activeCategory).map(cat => (
              <div key={cat.id} style={{ animation:"fadeUp 0.25s ease" }}>
                {cat.items.map(item => (
                  <FoodCard key={item.id} item={item} cart={cart}
                    onAdd={addToCart} onRemove={removeFromCart}
                    wishlist={wishlist} setWishlist={setWishlist}/>
                ))}
              </div>
            ))}
          </>
        )}

      </div>

      {/* ── FLOATING CART BUTTON ── */}
      {cartCount > 0 && (
        <div style={{ position:"fixed", bottom:90, left:"50%",
          transform:"translateX(-50%)", zIndex:500,
          animation:"bounceIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <button onClick={() => setCartOpen(true)} style={{
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            border:"none", borderRadius:99, padding:"14px 28px",
            display:"flex", alignItems:"center", gap:14,
            boxShadow:`0 10px 40px ${T.navy}55`, cursor:"pointer",
          }}>
            <div style={{ width:26, height:26, borderRadius:"50%",
              background:`linear-gradient(135deg,${T.gold},#A07008)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:900, color:"#fff" }}>{cartCount}</div>
            <span style={{ fontSize:14, fontWeight:800, color:"#fff" }}>View Cart</span>
            <div style={{ width:1, height:18, background:"rgba(255,255,255,0.2)" }}/>
            <span style={{ fontSize:14, fontWeight:900,
              color:T.goldMid, fontFamily:"monospace" }}>
              {fmt(cartSubtotal)}
            </span>
          </button>
        </div>
      )}

      <BottomNav active="discover"/>
    </div>
  );
}

// ── FOOD CARD COMPONENT ──────────────────────────────────────
function FoodCard({ item, cart, onAdd, onRemove, wishlist, setWishlist }) {
  const qty      = cart[item.id] || 0;
  const discount = item.original
    ? Math.round(((item.original - item.price) / item.original) * 100) : null;

  return (
    <div style={{
      background:T.card, borderRadius:20, padding:"16px",
      marginBottom:12, boxShadow:T.shadow,
      border:`1px solid ${T.border}`,
      display:"flex", gap:14, alignItems:"flex-start",
    }}>
      {/* Food image */}
      <div style={{ position:"relative", flexShrink:0 }}>
        <div style={{ width:88, height:88, borderRadius:16,
          background:`linear-gradient(135deg,${T.orangeBg},${T.amberBg})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          border:`1px solid ${T.orange}18` }}>
          <Icon name={item.icon} size={40} color={T.orange+"66"}/>
        </div>
        {item.popular && (
          <div style={{ position:"absolute", top:-5, left:-5,
            background:T.red, borderRadius:7, padding:"2px 7px",
            fontSize:9, fontWeight:900, color:"#fff" }}>HOT</div>
        )}
        {discount && (
          <div style={{ position:"absolute", bottom:-5, right:-5,
            background:T.green, borderRadius:7, padding:"2px 7px",
            fontSize:9, fontWeight:900, color:"#fff" }}>-{discount}%</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", marginBottom:4 }}>
          <div style={{ fontSize:13, fontWeight:800, color:T.textMain,
            lineHeight:1.3, flex:1, marginRight:8 }}>{item.name}</div>
          <button onClick={() => setWishlist(w => ({...w,[item.id]:!w[item.id]}))}
            style={{ background:"none", border:"none", flexShrink:0, padding:2 }}>
            <Icon name={wishlist[item.id] ? "heartFill" : "heart"}
              size={15} color={wishlist[item.id] ? T.red : T.textMute}/>
          </button>
        </div>

        <div style={{ fontSize:11, color:T.textMute, lineHeight:1.5,
          marginBottom:7, overflow:"hidden", display:"-webkit-box",
          WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {item.desc}
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
          {item.tags.map(tag => {
            const tc = TAG_COLORS[tag] || { color:T.textMid, bg:T.navyLight };
            return (
              <div key={tag} style={{ background:tc.bg, borderRadius:6,
                padding:"2px 7px", fontSize:9, fontWeight:800, color:tc.color }}>
                {tag}
              </div>
            );
          })}
          <div style={{ background:T.navyLight, borderRadius:6,
            padding:"2px 7px", fontSize:9, fontWeight:700, color:T.textMute }}>
            {item.calories}
          </div>
        </div>

        {/* Price + cart controls */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:T.navy,
              fontFamily:"monospace", letterSpacing:-0.3 }}>
              {fmt(item.price)}
            </div>
            {item.original && (
              <div style={{ fontSize:10, color:T.textMute,
                textDecoration:"line-through", fontFamily:"monospace" }}>
                {fmt(item.original)}
              </div>
            )}
          </div>
          {qty === 0 ? (
            <button onClick={() => onAdd(item)} style={{
              padding:"8px 18px", borderRadius:12,
              background:`linear-gradient(135deg,${T.orange},#C44A09)`,
              border:"none", color:"#fff", fontSize:12, fontWeight:800,
              display:"flex", alignItems:"center", gap:5,
              boxShadow:`0 4px 12px ${T.orange}44`,
            }}>
              <Icon name="plus" size={14} color="#fff"/>
              Add
            </button>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={() => onRemove(item)} style={{
                width:32, height:32, borderRadius:9,
                background:T.navyLight, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="minus" size={14} color={T.textMid}/>
              </button>
              <span style={{ fontSize:15, fontWeight:900,
                color:T.textMain, minWidth:20, textAlign:"center" }}>{qty}</span>
              <button onClick={() => onAdd(item)} style={{
                width:32, height:32, borderRadius:9,
                background:`linear-gradient(135deg,${T.orange},#C44A09)`,
                border:"none",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon name="plus" size={14} color="#fff"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
