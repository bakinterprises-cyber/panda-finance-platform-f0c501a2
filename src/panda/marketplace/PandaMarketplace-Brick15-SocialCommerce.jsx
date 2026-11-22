import { useState } from "react";

// ============================================================
// 🧱 BRICK 15 — SOCIAL COMMERCE
// 🏗️  Part of: Panda Marketplace
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 📦  Assembly: export SocialCommerce from this file
//     Props: { currentUser, onBack, onProductPress, onSellerPress }
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
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></>,
    heartFill:    <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color} stroke="none"/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/></>,
    share:        <><circle cx="18" cy="5" r="3" {...s}/><circle cx="6" cy="12" r="3" {...s}/><circle cx="18" cy="19" r="3" {...s}/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...s}/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...s}/></>,
    bookmark:     <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" {...s}/></>,
    bookmarkFill: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={color} stroke="none"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    shield:       <><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z" {...s}/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.9" fill="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    fire:         <><path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4 0 0-1-4-1-8z" fill={color} stroke={color} strokeWidth="0.5"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    compass:      <><circle cx="12" cy="12" r="10" {...s}/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} stroke="none"/></>,
    wallet:       <><rect x="2" y="5" width="20" height="14" rx="2" {...s}/><path d="M16 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    x_circle:     <><circle cx="12" cy="12" r="10" {...s}/><line x1="15" y1="9" x2="9" y2="15" {...s}/><line x1="9" y1="9" x2="15" y2="15" {...s}/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13" {...s}/><polygon points="22 2 15 22 11 13 2 9 22 2" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────
function BottomNav({ active = "home" }) {
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
// 🔌 BACKEND SWAP POINT #1 — FOLLOWING FEED
// Replace with: supabase.from('feed_posts')
//   .select('*,seller(*),product(*)')
//   .in('seller_id', currentUser.following_seller_ids)
//   .order('created_at', { ascending: false }).limit(20)
// ============================================================
const MOCK_FOLLOWING_POSTS = [
  {
    id:"POST-001", type:"new_arrival",
    seller:{ name:"Tech Master Store", initials:"TM", color:"#1D4ED8", verified:true, trustScore:98 },
    time:"15 mins ago",
    caption:"New stock just landed! 📦 iPhone 15 Pro Max in all colors. Limited units — first come first served!",
    product:{ name:"iPhone 15 Pro Max 256GB", price:1650000, original:1850000, icon:"laptop" },
    likes:284, comments:42, shares:18, saved:false, liked:false,
  },
  {
    id:"POST-002", type:"promotion",
    seller:{ name:"Fashion Hub", initials:"FH", color:"#6D28D9", verified:true, trustScore:96 },
    time:"1 hour ago",
    caption:"Weekend Flash Sale! 🔥 30% off all designer handbags. Sale ends Sunday midnight. Don't miss out!",
    product:{ name:"Designer Handbag Collection", price:126000, original:180000, icon:"laptop" },
    likes:512, comments:88, shares:34, saved:true, liked:true,
  },
  {
    id:"POST-003", type:"announcement",
    seller:{ name:"Mama Fatuma Kitchen", initials:"MF", color:"#EA580C", verified:true, trustScore:96 },
    time:"3 hours ago",
    caption:"We're now delivering to Sinza and Mikocheni! 🍽️ Order your favorite Tanzanian dishes today.",
    product:null,
    likes:156, comments:23, shares:9, saved:false, liked:false,
  },
  {
    id:"POST-004", type:"new_arrival",
    seller:{ name:"Home Essentials", initials:"HE", color:"#0A7B4B", verified:false, trustScore:88 },
    time:"5 hours ago",
    caption:"Brand new sofa collection has arrived! Comfortable, stylish, and built to last. Free delivery in Dar! 🛋️",
    product:{ name:"Premium Sofa Set 5-Seater", price:850000, original:null, icon:"laptop" },
    likes:97, comments:14, shares:5, saved:false, liked:false,
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #2 — FOR YOU FEED (AI Curated)
// Replace with: supabase.functions.invoke('ai-foryou-feed', {
//   body: { user_id: currentUser.id, limit: 20 }
// })
// ============================================================
const MOCK_FORYOU_POSTS = [
  {
    id:"POST-101", type:"trending",
    seller:{ name:"Car Empire", initials:"CE", color:"#C0392B", verified:true, trustScore:95 },
    time:"30 mins ago",
    caption:"This Toyota Harrier won't last long! 🚗 Trending #1 in Dar es Salaam right now.",
    product:{ name:"Toyota Harrier 2020", price:38000000, original:null, icon:"laptop" },
    likes:890, comments:145, shares:67, saved:false, liked:false, trending:true,
  },
  {
    id:"POST-102", type:"new_arrival",
    seller:{ name:"Zanzibar Pearl Hotel", initials:"ZP", color:"#0D9488", verified:true, trustScore:98 },
    time:"2 hours ago",
    caption:"Book your dream Zanzibar getaway! 🏨 Ocean view rooms now available with 15% early booking discount.",
    product:{ name:"Deluxe Ocean View Room", price:157000, original:185000, icon:"laptop" },
    likes:445, comments:56, shares:29, saved:false, liked:false,
  },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #3 — SELLER STORIES (24h expiry)
// Replace with: supabase.from('seller_stories')
//   .select('*,seller(*)').gt('expires_at', new Date().toISOString())
//   .order('created_at', { ascending: false })
// ============================================================
const MOCK_STORIES = [
  { id:1, seller:"Tech Master",   initials:"TM", color:"#1D4ED8", viewed:false, isYou:false },
  { id:2, seller:"Fashion Hub",   initials:"FH", color:"#6D28D9", viewed:false, isYou:false },
  { id:3, seller:"Car Empire",    initials:"CE", color:"#C0392B", viewed:true,  isYou:false },
  { id:4, seller:"Mama Fatuma",   initials:"MF", color:"#EA580C", viewed:false, isYou:false },
  { id:5, seller:"Home Ess.",     initials:"HE", color:"#0A7B4B", viewed:true,  isYou:false },
  { id:6, seller:"Zanzibar Pearl",initials:"ZP", color:"#0D9488", viewed:false, isYou:false },
];

// ============================================================
// 🔌 BACKEND SWAP POINT #4 — TRENDING TAGS
// Replace with: supabase.from('trending_tags')
//   .select('*').order('post_count', { ascending: false }).limit(8)
// ============================================================
const TRENDING_TAGS = [
  "FlashSale", "iPhone15", "ZanzibarTravel", "TanzaniaMade",
  "WeekendDeals", "NewArrivals", "FreeDelivery", "TrustedSellers",
];

const POST_TYPE_BADGE = {
  new_arrival:  { label:"New Arrival",  color:T.blue,   bg:T.blueBg   },
  promotion:    { label:"Promotion",    color:T.red,    bg:T.redBg    },
  announcement: { label:"Announcement", color:T.purple, bg:T.purpleBg },
  trending:     { label:"Trending",     color:T.amber,  bg:"#FEF3C7"  },
};

// ============================================================
// 🧱 MAIN COMPONENT — SocialCommerce
// ============================================================
export default function App({
  // 👤 AUTH — replace with real user from supabase.auth.getUser()
  currentUser     = { id:"user-001", name:"BAK", initials:"B" },

  // 🧭 NAVIGATE
  onBack          = () => {},   // → previous screen
  onProductPress  = () => {},   // → Brick 3 Product Details
  onSellerPress   = () => {},   // → Brick 4 Seller Profile
  onComment       = () => {},   // → Brick 6 Chat / comment thread
}) {
  const [activeTab,    setActiveTab]    = useState("following");
  const [posts,        setPosts]        = useState({
    following: MOCK_FOLLOWING_POSTS,
    foryou:    MOCK_FORYOU_POSTS,
  });
  const [storyViewer,  setStoryViewer]  = useState(null);
  const [stories,      setStories]      = useState(MOCK_STORIES);
  const [toast,        setToast]        = useState(null);
  const [commentBox,   setCommentBox]   = useState(null);
  const [commentText,  setCommentText]  = useState("");

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const currentPosts = posts[activeTab];

  // 🔌 BACKEND — supabase.from('post_likes').upsert / delete
  const toggleLike = (postId) => {
    setPosts(p => ({
      ...p,
      [activeTab]: p[activeTab].map(post =>
        post.id === postId
          ? { ...post, liked:!post.liked, likes: post.liked ? post.likes-1 : post.likes+1 }
          : post
      ),
    }));
  };

  // 🔌 BACKEND — supabase.from('saved_posts').upsert / delete
  const toggleSave = (postId) => {
    setPosts(p => ({
      ...p,
      [activeTab]: p[activeTab].map(post =>
        post.id === postId ? { ...post, saved:!post.saved } : post
      ),
    }));
    const post = currentPosts.find(p => p.id === postId);
    showToast(post?.saved ? "Removed from saved" : "Saved to collection!", T.gold);
  };

  const sharePost = (post) => {
    // 🔌 BACKEND — supabase.from('post_shares').insert({ post_id, user_id })
    showToast("Post shared!", T.blue);
  };

  const submitComment = (postId) => {
    if (!commentText.trim()) return;
    // 🔌 BACKEND — supabase.from('post_comments').insert({
    //   post_id: postId, user_id: currentUser.id, text: commentText
    // })
    setPosts(p => ({
      ...p,
      [activeTab]: p[activeTab].map(post =>
        post.id === postId ? { ...post, comments: post.comments+1 } : post
      ),
    }));
    setCommentText("");
    setCommentBox(null);
    showToast("Comment posted!", T.green);
  };

  const openStory = (story) => {
    if (story.isYou) return;
    setStories(s => s.map(st => st.id === story.id ? { ...st, viewed:true } : st));
    setStoryViewer(story);
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
        @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input  { font-family:inherit; }
        input::placeholder { color:${T.textMute}; }
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

      {/* ── STORY VIEWER ── */}
      {storyViewer && (
        <div style={{ position:"fixed", inset:0, zIndex:999, background:T.navy,
          maxWidth:430, margin:"0 auto",
          display:"flex", flexDirection:"column" }}>
          {/* Progress bar */}
          <div style={{ padding:"14px 14px 0", display:"flex", gap:4 }}>
            <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.25)",
              borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:"60%", background:"#fff" }}/>
            </div>
          </div>
          {/* Header */}
          <div style={{ padding:"14px 18px", display:"flex",
            justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:34, height:34, borderRadius:"50%",
                background:storyViewer.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:900, color:"#fff" }}>
                {storyViewer.initials}
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>
                {storyViewer.seller}
              </span>
            </div>
            <button onClick={() => setStoryViewer(null)} style={{
              width:32, height:32, borderRadius:"50%",
              background:"rgba(255,255,255,0.15)", border:"none",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="x" size={16} color="#fff"/>
            </button>
          </div>
          {/* Content */}
          <div style={{ flex:1, display:"flex", alignItems:"center",
            justifyContent:"center" }}>
            <div style={{ width:140, height:140, borderRadius:"50%",
              background:`linear-gradient(135deg,${storyViewer.color}44,${storyViewer.color}77)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:48, fontWeight:900, color:"#fff" }}>
              {storyViewer.initials}
            </div>
          </div>
          {/* CTA */}
          <div style={{ padding:"16px 20px 32px" }}>
            <button onClick={() => { setStoryViewer(null); onSellerPress(storyViewer.id); }}
              style={{ width:"100%", padding:"14px 0", borderRadius:16,
                background:"rgba(255,255,255,0.15)",
                border:"1px solid rgba(255,255,255,0.3)",
                color:"#fff", fontSize:13, fontWeight:800,
                display:"flex", alignItems:"center",
                justifyContent:"center", gap:8 }}>
              Visit Store
              <Icon name="package" size={15} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {/* ── COMMENT MODAL ── */}
      {commentBox && (
        <div style={{ position:"fixed", inset:0, zIndex:998,
          background:"rgba(11,31,75,0.5)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setCommentBox(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:T.white, borderRadius:"28px 28px 0 0",
            padding:"20px 20px 28px", width:"100%", maxWidth:430,
            animation:"slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ width:40, height:4, borderRadius:99,
              background:T.border, margin:"0 auto 18px" }}/>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:14 }}>
              Add a comment
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:34, height:34, borderRadius:"50%",
                background:T.navy, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff",
                flexShrink:0 }}>{currentUser.initials}</div>
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key==="Enter" && submitComment(commentBox)}
                placeholder="Write a comment..." autoFocus
                style={{ flex:1, background:T.navyLight, border:`1px solid ${T.border}`,
                  borderRadius:14, padding:"11px 14px", fontSize:13,
                  color:T.textMain, outline:"none" }}/>
              <button onClick={() => submitComment(commentBox)} style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                background:commentText.trim() ? T.navy : T.navyLight,
                border:commentText.trim() ? "none" : `1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="send" size={16} color={commentText.trim() ? "#fff" : T.textMute}/>
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
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="arrowLeft" size={18} color={T.navy}/>
        </button>
        <div style={{ fontSize:16, fontWeight:900, color:T.textMain,
          letterSpacing:-0.3 }}>Social Feed</div>
        <button style={{
          width:40, height:40, borderRadius:12, background:T.navyLight,
          border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="bookmark" size={17} color={T.navy}/>
        </button>
      </div>

      {/* ── STORIES ROW ── */}
      <div style={{ padding:"14px 16px", display:"flex", gap:14,
        overflowX:"auto", borderBottom:`1px solid ${T.border}`,
        background:T.white }}>
        {/* Your story */}
        <div style={{ display:"flex", flexDirection:"column",
          alignItems:"center", gap:5, flexShrink:0 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:56, height:56, borderRadius:"50%",
              background:T.navyLight, border:`1.5px dashed ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:14, fontWeight:900, color:T.navy }}>
                {currentUser.initials}
              </span>
            </div>
            <div style={{ position:"absolute", bottom:-2, right:-2,
              width:18, height:18, borderRadius:"50%", background:T.navy,
              border:`2px solid ${T.white}`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="plus" size={9} color="#fff"/>
            </div>
          </div>
          <span style={{ fontSize:10, color:T.textMute, fontWeight:600 }}>Your Story</span>
        </div>
        {/* Seller stories */}
        {stories.map(story => (
          <div key={story.id} onClick={() => openStory(story)}
            style={{ display:"flex", flexDirection:"column",
              alignItems:"center", gap:5, flexShrink:0, cursor:"pointer" }}>
            <div style={{ width:56, height:56, borderRadius:"50%",
              padding:2,
              background: story.viewed
                ? T.border
                : `linear-gradient(135deg,${T.gold},${T.red},${T.purple})` }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%",
                background:T.white, padding:2 }}>
                <div style={{ width:"100%", height:"100%", borderRadius:"50%",
                  background:`linear-gradient(135deg,${story.color}33,${story.color}55)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:900, color:story.color }}>
                  {story.initials}
                </div>
              </div>
            </div>
            <span style={{ fontSize:10, color:T.textMute, fontWeight:600,
              maxWidth:56, overflow:"hidden", textOverflow:"ellipsis",
              whiteSpace:"nowrap" }}>{story.seller}</span>
          </div>
        ))}
      </div>

      {/* ── FOLLOWING / FOR YOU TABS ── */}
      <div style={{ display:"flex", background:T.white,
        borderBottom:`1px solid ${T.border}` }}>
        {[
          { id:"following", label:"Following" },
          { id:"foryou",    label:"For You"    },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex:1, padding:"13px 0", border:"none", background:"transparent",
            fontSize:13, fontWeight:activeTab===tab.id?900:600,
            color:activeTab===tab.id ? T.navy : T.textMute,
            position:"relative",
          }}>
            {tab.label}
            {activeTab===tab.id && (
              <div style={{ position:"absolute", bottom:0, left:"50%",
                transform:"translateX(-50%)", width:36, height:3,
                background:T.gold, borderRadius:99 }}/>
            )}
          </button>
        ))}
      </div>

      {/* ── TRENDING TAGS (For You tab only) ── */}
      {activeTab === "foryou" && (
        <div style={{ padding:"14px 16px 4px", display:"flex", gap:8,
          overflowX:"auto", background:T.white,
          borderBottom:`1px solid ${T.border}` }}>
          {TRENDING_TAGS.slice(0,8).map(tag => (
            <div key={tag} style={{ display:"flex", alignItems:"center", gap:4,
              background:T.purpleBg, border:`1px solid ${T.purple}22`,
              borderRadius:99, padding:"6px 12px", flexShrink:0 }}>
              <Icon name="fire" size={11} color={T.purple}/>
              <span style={{ fontSize:11, fontWeight:700, color:T.purple }}>
                #{tag}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── FEED POSTS ── */}
      <div style={{ padding:"16px 16px 0" }}>
        {currentPosts.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>📭</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>
              {activeTab === "following" ? "No posts yet" : "Nothing here yet"}
            </div>
            <div style={{ fontSize:13, color:T.textMute }}>
              {activeTab === "following"
                ? "Follow sellers to see their updates here"
                : "Check back soon for personalized content"}
            </div>
          </div>
        ) : currentPosts.map((post, i) => {
          const badge = POST_TYPE_BADGE[post.type];
          return (
            <div key={post.id} style={{ background:T.card, borderRadius:22,
              marginBottom:16, border:`1px solid ${T.border}`,
              boxShadow:T.shadow, overflow:"hidden",
              animation:`fadeUp 0.25s ease ${i*0.06}s both` }}>

              {/* Post header */}
              <div style={{ padding:"14px 16px",
                display:"flex", gap:11, alignItems:"center" }}>
                <div onClick={() => onSellerPress(post.seller)}
                  style={{ width:42, height:42, borderRadius:13, flexShrink:0,
                    background:`linear-gradient(135deg,${post.seller.color}22,${post.seller.color}44)`,
                    border:`2px solid ${post.seller.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:900, color:post.seller.color,
                    cursor:"pointer" }}>
                  {post.seller.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:T.textMain }}>
                      {post.seller.name}
                    </span>
                    {post.seller.verified && (
                      <div style={{ width:15, height:15, borderRadius:"50%",
                        background:T.blue,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="shield" size={8} color="#fff"/>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:T.textMute }}>{post.time}</div>
                </div>
                <div style={{ background:badge.bg, borderRadius:8,
                  padding:"3px 9px" }}>
                  <span style={{ fontSize:9, fontWeight:900, color:badge.color,
                    textTransform:"uppercase" }}>{badge.label}</span>
                </div>
              </div>

              {/* Caption */}
              <div style={{ padding:"0 16px 12px", fontSize:13,
                color:T.textMid, lineHeight:1.6 }}>{post.caption}</div>

              {/* Product card (if attached) */}
              {post.product && (
                <div onClick={() => onProductPress(post.product)}
                  style={{ margin:"0 16px 14px", background:T.navyLight,
                    borderRadius:16, padding:"12px 14px",
                    display:"flex", gap:12, alignItems:"center",
                    cursor:"pointer", border:`1px solid ${T.border}` }}>
                  <div style={{ width:52, height:52, borderRadius:14,
                    background:T.white, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="package" size={24} color={T.navy+"44"}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.textMain,
                      marginBottom:4, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{post.product.name}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:14, fontWeight:900, color:T.navy,
                        fontFamily:"monospace" }}>{fmt(post.product.price)}</span>
                      {post.product.original && (
                        <span style={{ fontSize:11, color:T.textMute,
                          textDecoration:"line-through", fontFamily:"monospace" }}>
                          {fmt(post.product.original)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Icon name="zap" size={16} color={T.gold}/>
                </div>
              )}

              {/* Engagement bar */}
              <div style={{ padding:"10px 16px 14px",
                borderTop:`1px solid ${T.border}`,
                display:"flex", justifyContent:"space-between",
                alignItems:"center" }}>
                <div style={{ display:"flex", gap:18 }}>
                  <button onClick={() => toggleLike(post.id)} style={{
                    display:"flex", alignItems:"center", gap:6,
                    background:"none", border:"none" }}>
                    <Icon name={post.liked ? "heartFill" : "heart"} size={19}
                      color={post.liked ? T.red : T.textMute}/>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:post.liked ? T.red : T.textMute }}>{post.likes}</span>
                  </button>
                  <button onClick={() => setCommentBox(post.id)} style={{
                    display:"flex", alignItems:"center", gap:6,
                    background:"none", border:"none" }}>
                    <Icon name="message" size={18} color={T.textMute}/>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:T.textMute }}>{post.comments}</span>
                  </button>
                  <button onClick={() => sharePost(post)} style={{
                    display:"flex", alignItems:"center", gap:6,
                    background:"none", border:"none" }}>
                    <Icon name="share" size={17} color={T.textMute}/>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:T.textMute }}>{post.shares}</span>
                  </button>
                </div>
                <button onClick={() => toggleSave(post.id)} style={{
                  background:"none", border:"none" }}>
                  <Icon name={post.saved ? "bookmarkFill" : "bookmark"} size={18}
                    color={post.saved ? T.gold : T.textMute}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav active="home"/>
    </div>
  );
}
