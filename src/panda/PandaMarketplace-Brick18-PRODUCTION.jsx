import { useState, createContext, useContext } from "react";

// ============================================================
// 🧱 BRICK 18 — FULL MARKETPLACE ASSEMBLY (PRODUCTION VERSION)
// 🏗️  Panda Finance — Module 2: Panda Marketplace
// ============================================================
// 📁 FILE STRUCTURE ASSUMED (matches filenames used throughout the build):
// /marketplace/
//   ├── PandaMarketplace-Brick18-FullAssembly.jsx        ← THIS FILE
//   ├── PandaMarketplace-Brick1-Homepage.jsx
//   ├── PandaMarketplace-Brick2-LiveSocial.jsx
//   ├── PandaMarketplace-Brick2B-SellerLiveBroadcaster.jsx
//   ├── PandaMarketplace-Brick3-ProductDetails.jsx
//   ├── PandaMarketplace-Brick4-SellerProfile.jsx
//   ├── PandaMarketplace-Brick4B-SellerProfileEditor.jsx
//   ├── PandaMarketplace-Brick5-SellerCommandCenter.jsx
//   ├── PandaMarketplace-Brick6-Chat.jsx
//   ├── PandaMarketplace-Brick7-BusinessVerification.jsx
//   ├── PandaMarketplace-Brick8-Logistics.jsx
//   ├── PandaMarketplace-Brick8B-SellerOrderManagement.jsx
//   ├── PandaMarketplace-Brick9-Restaurant.jsx
//   ├── PandaMarketplace-Brick9B-RestaurantOwner.jsx
//   ├── PandaMarketplace-Brick10-Hotels.jsx
//   ├── PandaMarketplace-Brick10B-HotelOwner.jsx
//   ├── PandaMarketplace-Brick11-B2B.jsx
//   ├── PandaMarketplace-Brick11B-B2BSupplier.jsx
//   ├── PandaMarketplace-Brick12-AISellerDashboard.jsx
//   ├── PandaMarketplace-Brick13-TrustScoreSystem.jsx
//   ├── PandaMarketplace-Brick14-EscrowSystem.jsx
//   ├── PandaMarketplace-Brick15-SocialCommerce.jsx
//   ├── PandaMarketplace-Brick16-WalletIntegration.jsx
//   └── PandaMarketplace-Brick17-MarketplaceHome.jsx
//
// ⚠️ Every brick file exports `export default function App(...)`.
// Default exports can be renamed freely on import — that's what
// happens below (e.g. `import Homepage from ".../Brick1-Homepage"`).
// No changes are required inside the original 24 brick files.
// ============================================================

// 🔌 REAL IMPORTS — adjust paths to match your actual folder
import Homepage              from "./PandaMarketplace-Brick1-Homepage";
import LiveSocialFeed        from "./PandaMarketplace-Brick2-LiveSocial";
import SellerLiveBroadcaster from "./PandaMarketplace-Brick2B-SellerLiveBroadcaster";
import ProductDetails        from "./PandaMarketplace-Brick3-ProductDetails";
import SellerProfile         from "./PandaMarketplace-Brick4-SellerProfile";
import SellerProfileEditor   from "./PandaMarketplace-Brick4B-SellerProfileEditor";
import SellerCommandCenter   from "./PandaMarketplace-Brick5-SellerCommandCenter";
import MarketplaceChat       from "./PandaMarketplace-Brick6-Chat";
import BusinessVerification  from "./PandaMarketplace-Brick7-BusinessVerification";
import LogisticsTracking     from "./PandaMarketplace-Brick8-Logistics";
import SellerOrderManagement from "./PandaMarketplace-Brick8B-SellerOrderManagement";
import RestaurantOrdering    from "./PandaMarketplace-Brick9-Restaurant";
import RestaurantOwner       from "./PandaMarketplace-Brick9B-RestaurantOwner";
import HotelReservations     from "./PandaMarketplace-Brick10-Hotels";
import HotelOwner            from "./PandaMarketplace-Brick10B-HotelOwner";
import B2BProcurement        from "./PandaMarketplace-Brick11-B2B";
import B2BSupplier           from "./PandaMarketplace-Brick11B-B2BSupplier";
import AISellerDashboard     from "./PandaMarketplace-Brick12-AISellerDashboard";
import TrustScoreSystem      from "./PandaMarketplace-Brick13-TrustScoreSystem";
import EscrowSystem          from "./PandaMarketplace-Brick14-EscrowSystem";
import SocialCommerce        from "./PandaMarketplace-Brick15-SocialCommerce";
import WalletIntegration     from "./PandaMarketplace-Brick16-WalletIntegration";
import MarketplaceHome       from "./PandaMarketplace-Brick17-MarketplaceHome";

// ─── Design Tokens ────────────────────────────────────────────
const T = {
  navy: "#0B1F4B", navyMid: "#1A3A6E", navyLight: "#EEF2FF",
  gold: "#C9960A", goldMid: "#F5C842", white: "#FFFFFF",
  bg: "#F4F6FF", border: "#DDE3F5", textMain: "#0B1F4B",
  textMute: "#8A9BC0", green: "#0A7B4B", red: "#C0392B",
  purple: "#6D28D9", shadowLg: "0 20px 60px rgba(11,31,75,0.16)",
};

// ─── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { stroke: color, strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home:     <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:  <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    message:  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    wallet:   <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    sparkle:  <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>{icons[name] || null}</svg>;
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ activeTab, setActiveTab, msgCount = 0 }) {
  const items = [
    { id:"home",     icon:"home",    label:"Home"     },
    { id:"discover", icon:"compass", label:"Discover" },
    { id:"create",   icon:"plus",    label:""         },
    { id:"messages", icon:"message", label:"Messages", badge:msgCount },
    { id:"wallet",   icon:"wallet",  label:"Wallet"   },
    { id:"profile",  icon:"user",    label:"Profile"  },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430, background:T.white,
      borderTop:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-around",
      padding:"8px 0 20px", zIndex:200,
      boxShadow:"0 -4px 24px rgba(11,31,75,0.08)",
    }}>
      {items.map(item => {
        const isCenter = item.id === "create";
        const isActive = item.id === activeTab;
        if (isCenter) return (
          <div key={item.id} onClick={() => setActiveTab("create")} style={{
            width:52, height:52, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.navy}55`, cursor:"pointer",
            marginTop:-20, border:`3px solid ${T.white}`,
          }}><Icon name="plus" size={22} color="#fff"/></div>
        );
        return (
          <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, cursor:"pointer", minWidth:44, padding:"4px 0",
            position:"relative",
          }}>
            <Icon name={item.icon} size={20} color={isActive ? T.navy : T.textMute}/>
            <span style={{ fontSize:10, fontWeight:isActive?800:500,
              color:isActive?T.navy:T.textMute }}>{item.label}</span>
            {isActive && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold }}/>}
            {item.badge > 0 && (
              <div style={{ position:"absolute", top:0, right:4,
                minWidth:16, height:16, borderRadius:99, background:T.red,
                border:`2px solid ${T.white}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px" }}>
                <span style={{ fontSize:8, fontWeight:900, color:"#fff" }}>{item.badge}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 🌐 MARKETPLACE CONTEXT — shared state across all bricks
// ============================================================
const MarketplaceContext = createContext(null);
export const useMarketplace = () => useContext(MarketplaceContext);

// ============================================================
// 👤 AUTH SWAP POINT
// 🔌 BACKEND — replace with:
// const { data: { user } } = await supabase.auth.getUser();
// const { data: profile } = await supabase
//   .from('panda_profiles').select('*,sellers(*)').eq('user_id', user.id).single();
// ============================================================
const MOCK_USER = {
  id: "user-001", name: "BAK", initials: "B",
  phone: "+255 712 345 678", isSeller: true,
  sellerId: "SEL-001", sellerName: "Tech Master Store",
  trustScore: 98, tier: "gold",
};

// ============================================================
// 💰 WALLET SWAP POINT
// 🔌 supabase.from('wallets').select('*').eq('user_id', user.id).single()
// ============================================================
const MOCK_WALLET = { balance: 842500, pandaPoints: 3420, escrowHeld: 1650000 };

// ============================================================
// 🔔 NOTIFICATIONS SWAP POINT
// 🔌 supabase.channel('notifications')... (Realtime, see Brick 18 notes)
// ============================================================
const MOCK_NOTIFICATIONS = [
  { id:1, type:"order",   title:"New Order!",      body:"Hassan ordered iPhone 15 Pro Max", time:"5m",  read:false },
  { id:2, type:"message", title:"New Message",     body:"Amina: Is this still available?",  time:"12m", read:false },
];

// ============================================================
// 🧱 MAIN ASSEMBLY — PandaMarketplace
// ============================================================
export default function PandaMarketplace() {
  const [screen,        setScreen]        = useState({ to:"home", params:{} });
  const [screenHistory, setScreenHistory] = useState(["home"]);
  const [activeTab,     setActiveTab]     = useState("home");
  const [user]                             = useState(MOCK_USER);
  const [wallet,        setWallet]        = useState(MOCK_WALLET);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [cart,          setCart]          = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeSeller,  setActiveSeller]  = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [activeChatId,  setActiveChatId]  = useState(null);

  // 🧭 NAVIGATE — central navigation function, passed to every brick
  const navigate = (to, params = {}) => {
    setScreenHistory(h => [...h, to]);
    setScreen({ to, params });
    if (params.product)  setActiveProduct(params.product);
    if (params.sellerId) setActiveSeller(params.sellerId);
    if (params.orderId)  setActiveOrderId(params.orderId);
    if (params.chatId)   setActiveChatId(params.chatId);

    const tabMap = {
      home:"home", "market-home":"discover", discover:"discover",
      chat:"messages", messages:"messages",
      wallet:"wallet", escrow:"wallet",
      profile:"profile", "profile-edit":"profile",
      command:"profile", "ai-dashboard":"profile",
    };
    if (tabMap[to]) setActiveTab(tabMap[to]);
  };

  const goBack = () => {
    const prev = screenHistory[screenHistory.length - 2] || "home";
    setScreenHistory(h => h.slice(0, -1));
    setScreen({ to: prev, params:{} });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabScreens = {
      home:"home", discover:"market-home",
      messages:"chat", wallet:"wallet",
      profile:"profile", create:"live-stream",
    };
    if (tabScreens[tab]) navigate(tabScreens[tab]);
  };

  const msgCount = notifications.filter(n => n.type === "message" && !n.read).length;

  const ctxValue = { user, wallet, setWallet, notifications, setNotifications, cart, setCart, navigate, goBack };

  const { to } = screen;

  return (
    <MarketplaceContext.Provider value={ctxValue}>
      <div style={{ maxWidth:430, margin:"0 auto" }}>
        <style>{`
          * { box-sizing:border-box; }
          ::-webkit-scrollbar { display:none; }
          button { font-family:inherit; cursor:pointer; border:none; }
        `}</style>

        {/* ══════════════════════════════════════════════════════
            🧭 SCREEN ROUTER — REAL BRICK RENDERING
            Every brick receives exactly the props it was built to
            accept. No brick's internal code needed to change.
        ══════════════════════════════════════════════════════ */}

        {/* ── BUYER SCREENS ── */}
        {to === "home" && (
          <Homepage
            user={user}
            onProductPress={(p) => navigate("product", { product:p })}
            onSellerPress={(id) => navigate("seller", { sellerId:id })}
            onLivePress={() => navigate("live")}
            onCategoryPress={(cat) => navigate("market-home", { category:cat })}
            onSearchSubmit={() => navigate("market-home")}
            onAIChat={() => navigate("ai-coach")}
          />
        )}

        {to === "market-home" && (
          <MarketplaceHome
            currentUser={user}
            onProductPress={(p) => navigate("product", { product:p })}
            onSellerPress={(id) => navigate("seller", { sellerId:id })}
            onCategoryPress={(cat) => navigate("market-home", { category:cat })}
            onSearch={() => navigate("search")}
            onNotifications={() => navigate("notifications")}
          />
        )}

        {to === "product" && (
          <ProductDetails
            product={activeProduct}
            onSellerPress={() => navigate("seller", { sellerId: activeSeller })}
            onChatSeller={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {to === "seller" && (
          <SellerProfile
            sellerId={activeSeller}
            onProductPress={(p) => navigate("product", { product:p })}
            onChatSeller={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {to === "live" && (
          <LiveSocialFeed
            currentUser={user}
            onProductPress={(p) => navigate("product", { product:p })}
            onSellerPress={(id) => navigate("seller", { sellerId:id })}
            onBack={goBack}
          />
        )}

        {to === "chat" && (
          <MarketplaceChat
            currentUser={user}
            chatId={activeChatId}
            onProductPress={(p) => navigate("product", { product:p })}
            onBack={goBack}
          />
        )}

        {to === "track" && (
          <LogisticsTracking
            orderId={activeOrderId}
            onChatSeller={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {to === "restaurant" && (
          <RestaurantOrdering
            currentUser={user}
            onTrackOrder={(id) => navigate("track", { orderId:id })}
            onBack={goBack}
          />
        )}

        {to === "hotel" && (
          <HotelReservations
            currentUser={user}
            onChatHotel={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {to === "b2b" && (
          <B2BProcurement
            currentUser={user}
            onSupplierPress={(id) => navigate("supplier", { sellerId:id })}
            onBack={goBack}
          />
        )}

        {to === "social" && (
          <SocialCommerce
            currentUser={user}
            onProductPress={(p) => navigate("product", { product:p })}
            onSellerPress={(id) => navigate("seller", { sellerId:id })}
            onComment={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {to === "escrow" && (
          <EscrowSystem
            currentUser={user}
            onChatParty={() => navigate("chat")}
            onTrackOrder={(id) => navigate("track", { orderId:id })}
            onBack={goBack}
          />
        )}

        {to === "trust" && (
          <TrustScoreSystem
            seller={{ name:user.sellerName, trustScore:user.trustScore }}
            onVerification={() => navigate("verify")}
            onShare={() => {}}
            onBack={goBack}
          />
        )}

        {to === "wallet" && (
          <WalletIntegration
            currentUser={user}
            wallet={wallet}
            onTopUp={() => navigate("topup")}
            onFullWallet={() => navigate("wallet-full")}
            onWithdraw={() => navigate("withdraw")}
            onViewEscrow={() => navigate("escrow")}
            onBack={goBack}
          />
        )}

        {/* ── SELLER SCREENS ── */}
        {to === "command" && (
          <SellerCommandCenter
            seller={{ id:user.sellerId, name:user.sellerName }}
            onAnalytics={() => navigate("ai-dashboard")}
            onBack={goBack}
          />
        )}

        {to === "ai-dashboard" && (
          <AISellerDashboard
            seller={{ id:user.sellerId, name:user.sellerName, trustScore:user.trustScore }}
            onProductPress={(p) => navigate("product", { product:p })}
            onGoLive={() => navigate("live-stream")}
            onBack={goBack}
          />
        )}

        {to === "orders" && (
          <SellerOrderManagement
            seller={{ id:user.sellerId, name:user.sellerName }}
            onChatBuyer={(id) => navigate("chat", { chatId:id })}
            onCallBuyer={() => {}}
            onTrackOrder={(id) => navigate("track", { orderId:id })}
            onViewAnalytics={() => navigate("ai-dashboard")}
            onWithdraw={() => navigate("withdraw")}
            onBack={goBack}
          />
        )}

        {to === "verify" && (
          <BusinessVerification
            currentUser={user}
            onBack={goBack}
          />
        )}

        {to === "profile-edit" && (
          <SellerProfileEditor
            seller={{ id:user.sellerId, name:user.sellerName }}
            onPreview={() => navigate("seller", { sellerId:user.sellerId })}
            onBack={goBack}
          />
        )}

        {to === "live-stream" && (
          <SellerLiveBroadcaster
            seller={{ id:user.sellerId, name:user.sellerName }}
            onEndStream={() => navigate("ai-dashboard")}
            onBack={goBack}
          />
        )}

        {to === "rest-owner" && (
          <RestaurantOwner
            currentUser={user}
            onViewAnalytics={() => navigate("ai-dashboard")}
            onBack={goBack}
          />
        )}

        {to === "hotel-owner" && (
          <HotelOwner
            currentUser={user}
            onWithdraw={() => navigate("withdraw")}
            onBack={goBack}
          />
        )}

        {to === "b2b-supplier" && (
          <B2BSupplier
            currentUser={user}
            onChatBuyer={() => navigate("chat")}
            onBack={goBack}
          />
        )}

        {/* ── BOTTOM NAV ── */}
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} msgCount={msgCount}/>
      </div>
    </MarketplaceContext.Provider>
  );
}
