import { useState } from "react";

// ============================================================
// 🧱 BH-3 — INVENTORY MANAGER
// 🏗️  Part of: Panda Business Hub (Module 3)
// 🔌  Backend swap points marked with: // 🔌 BACKEND
// 🧭  Navigation hooks marked with:    // 🧭 NAVIGATE
// 👤  Auth hooks marked with:          // 👤 AUTH
// 🤖  AI hooks marked with:            // 🤖 AI (Panda Vision AI writes here)
// 📦  Assembly: export InventoryManager from this file
//     Props: { businessId, currentUser, onBack, onNavigate }
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
  teal:      "#0D9488",
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
    camera:       <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...s}/><circle cx="12" cy="13" r="4" {...s}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...s}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...s}/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2"/></>,
    package:      <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...s}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...s}/></>,
    alertTriangle:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s}/><line x1="12" y1="9" x2="12" y2="13" {...s}/><line x1="12" y1="17" x2="12.01" y2="17" {...s}/></>,
    check:        <><polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.2" fill="none"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></>,
    trash:        <><polyline points="3 6 5 6 21 6" {...s}/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...s}/></>,
    trendingUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...s}/><polyline points="17 6 23 6 23 12" {...s}/></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" {...s}/><polyline points="17 18 23 18 23 12" {...s}/></>,
    sparkle:      <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill={color} stroke="none"/></>,
    zap:          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none"/>,
    chevronRight: <><polyline points="9 18 15 12 9 6" {...s}/></>,
    chevronDown:  <><polyline points="6 9 12 15 18 9" {...s}/></>,
    chevronUp:    <><polyline points="18 15 12 9 6 15" {...s}/></>,
    home:         <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...s}/><polyline points="9 22 9 12 15 12 15 22" {...s}/></>,
    grid:         <><rect x="3" y="3" width="7" height="7" {...s}/><rect x="14" y="3" width="7" height="7" {...s}/><rect x="14" y="14" width="7" height="7" {...s}/><rect x="3" y="14" width="7" height="7" {...s}/></>,
    barChart:     <><line x1="18" y1="20" x2="18" y2="10" {...s}/><line x1="12" y1="20" x2="12" y2="4" {...s}/><line x1="6" y1="20" x2="6" y2="14" {...s}/></>,
    user:         <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...s}/><circle cx="12" cy="7" r="4" {...s}/></>,
    filter:       <><line x1="4" y1="6" x2="20" y2="6" {...s}/><line x1="8" y1="12" x2="16" y2="12" {...s}/><line x1="11" y1="18" x2="13" y2="18" {...s}/></>,
    tag:          <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></>,
    refresh:      <><polyline points="23 4 23 10 17 10" {...s}/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" {...s}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink:0, display:"block" }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── Bottom Nav (Business Hub) ─────────────────────────────────
function BottomNav({ active = "inventory" }) {
  const items = [
    { id:"home",      icon:"home",      label:"Dashboard" },
    { id:"inventory", icon:"grid",      label:"Inventory" },
    { id:"scan",      icon:"camera",    label:""          },
    { id:"reports",   icon:"barChart",  label:"Reports"   },
    { id:"profile",   icon:"user",      label:"Profile"   },
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
        const isCenter = item.id === "scan";
        const isActive = item.id === active;
        if (isCenter) return (
          <div key={item.id} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},#A07008)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${T.gold}66`, cursor:"pointer",
            marginTop:-22, border:`3px solid ${T.white}`,
          }}>
            <Icon name="camera" size={22} color="#fff"/>
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
// 🔌 BACKEND SWAP POINT #1 — INVENTORY ITEMS
// Replace with: supabase.from('inventory_items')
//   .select('*').eq('business_id', businessId)
//   .order('updated_at', { ascending: false })
// 🤖 AI — Panda Vision AI writes new counts here via:
// supabase.functions.invoke('vision-update-inventory', {
//   body: { business_id, detected_products }
// })
// ============================================================
const MOCK_INVENTORY = [
  { id:1, name:"Coca Cola 500ml",      category:"Beverages", stock:8,   reorderAt:15, unit:"bottles", costPrice:800,  sellPrice:1200, updatedVia:"vision", updatedAt:"12 mins ago" },
  { id:2, name:"Azam Mango Juice 1L",  category:"Beverages", stock:30,  reorderAt:10, unit:"cartons", costPrice:2500, sellPrice:3500, updatedVia:"vision", updatedAt:"12 mins ago" },
  { id:3, name:"Colgate Toothpaste",   category:"Personal Care", stock:45, reorderAt:20, unit:"units", costPrice:1800, sellPrice:2500, updatedVia:"manual", updatedAt:"2 days ago"  },
  { id:4, name:"Soap Packs (3-in-1)",  category:"Personal Care", stock:10, reorderAt:15, unit:"packs", costPrice:3200, sellPrice:4500, updatedVia:"vision", updatedAt:"12 mins ago" },
  { id:5, name:"Rice 25kg Bag",        category:"Groceries", stock:22,  reorderAt:8,  unit:"bags",    costPrice:45000,sellPrice:58000,updatedVia:"manual", updatedAt:"5 days ago"  },
  { id:6, name:"Cooking Oil 5L",       category:"Groceries", stock:6,   reorderAt:12, unit:"bottles", costPrice:18000,sellPrice:24000,updatedVia:"manual", updatedAt:"1 day ago"   },
  { id:7, name:"iPhone Charger Cable", category:"Electronics", stock:60, reorderAt:20, unit:"units",  costPrice:3500, sellPrice:8000, updatedVia:"vision", updatedAt:"3 hours ago" },
];

const CATEGORIES = ["All", "Beverages", "Personal Care", "Groceries", "Electronics"];

// ============================================================
// 🤖 AI SWAP POINT — SMART REORDER PREDICTIONS
// Replace with: supabase.functions.invoke('ai-reorder-predictions', {
//   body: { business_id: businessId }
// })
// ============================================================
const MOCK_REORDER_PREDICTIONS = [
  { id:1, name:"Coca Cola 500ml", stock:8, dailySales:4, daysLeft:2, recommendQty:300, estimatedCost:450000 },
  { id:2, name:"Cooking Oil 5L",  stock:6, dailySales:2, daysLeft:3, recommendQty:60,  estimatedCost:1080000 },
];

// ============================================================
// 🧱 MAIN COMPONENT — InventoryManager
// ============================================================
export default function App({
  // 👤 AUTH — replace with real business context
  items              = MOCK_INVENTORY,
  reorderPredictions = MOCK_REORDER_PREDICTIONS,

  // 🧭 NAVIGATE
  onBack             = () => {},   // → BH-1 Dashboard
  onScanToCount       = () => {},   // → Panda Vision AI (inventory count mode)
  onAddItem          = () => {},   // → Add item manual form
  onNavigate         = () => {},   // → central navigate(screen)
}) {
  const [searchText,   setSearchText]   = useState("");
  const [activeCat,    setActiveCat]    = useState("All");
  const [expandItem,   setExpandItem]   = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [toast,        setToast]        = useState(null);
  const [localItems,   setLocalItems]   = useState(items);

  const showToast = (msg, color = T.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const lowStockItems = localItems.filter(i => i.stock <= i.reorderAt);

  const filtered = localItems
    .filter(i => activeCat === "All" || i.category === activeCat)
    .filter(i => !showLowStock || i.stock <= i.reorderAt)
    .filter(i => !searchText || i.name.toLowerCase().includes(searchText.toLowerCase()));

  const totalValue = localItems.reduce((s,i) => s + (i.stock * i.costPrice), 0);
  const totalItems = localItems.reduce((s,i) => s + i.stock, 0);

  // 🔌 BACKEND — quick stock adjust
  // supabase.from('inventory_items').update({ stock: newStock }).eq('id', itemId)
  const adjustStock = (id, delta) => {
    setLocalItems(items => items.map(i =>
      i.id === id ? { ...i, stock: Math.max(0, i.stock + delta), updatedVia:"manual", updatedAt:"just now" } : i
    ));
  };

  const deleteItem = (id) => {
    setLocalItems(items => items.filter(i => i.id !== id));
    setExpandItem(null);
    showToast("Item removed from inventory", T.red);
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
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:inherit; cursor:pointer; border:none; }
        input { font-family:inherit; }
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

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,
        padding:"52px 20px 22px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.05,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"20px 20px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:18, position:"relative" }}>
          <button onClick={onBack} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrowLeft" size={18} color="#fff"/>
          </button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff",
              letterSpacing:-0.3 }}>Inventory</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)",
              marginTop:2 }}>{totalItems} units across {localItems.length} products</div>
          </div>
          <button onClick={onAddItem} style={{
            width:40, height:40, borderRadius:12,
            background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="plus" size={18} color="#fff"/>
          </button>
        </div>

        {/* Stock value summary */}
        <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.15)", borderRadius:18,
          padding:"14px 18px", position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center" }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)",
                fontWeight:700, marginBottom:3 }}>TOTAL INVENTORY VALUE</div>
              <div style={{ fontSize:20, fontWeight:900, color:"#fff",
                fontFamily:"monospace" }}>{fmt(totalValue)}</div>
            </div>
            {lowStockItems.length > 0 && (
              <div onClick={() => setShowLowStock(true)} style={{
                display:"flex", alignItems:"center", gap:6,
                background:"rgba(192,57,43,0.25)",
                border:"1px solid rgba(192,57,43,0.4)",
                borderRadius:10, padding:"7px 12px", cursor:"pointer" }}>
                <Icon name="alertTriangle" size={13} color="#FCA5A5"/>
                <span style={{ fontSize:11, fontWeight:800, color:"#FCA5A5" }}>
                  {lowStockItems.length} Low Stock
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── PANDA VISION AI SCAN CTA ── */}
        <div onClick={onScanToCount} style={{
          background:`linear-gradient(135deg,#3B1FA3,#6D28D9)`,
          borderRadius:20, padding:"16px 18px", marginBottom:16,
          display:"flex", gap:12, alignItems:"center",
          cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.06,
            backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize:"14px 14px" }}/>
          <div style={{ width:44, height:44, borderRadius:14,
            background:"rgba(255,255,255,0.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative" }}>
            <Icon name="camera" size={21} color="#fff"/>
          </div>
          <div style={{ flex:1, position:"relative" }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff", marginBottom:2 }}>
              Scan to Count Inventory
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>
              Walk the shop — Panda Vision AI counts automatically
            </div>
          </div>
          <Icon name="chevronRight" size={16} color="rgba(255,255,255,0.7)"/>
        </div>

        {/* ── AI REORDER PREDICTIONS ── */}
        {reorderPredictions.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <Icon name="sparkle" size={16} color={T.purple}/>
              <span style={{ fontSize:15, fontWeight:900, color:T.textMain,
                letterSpacing:-0.3 }}>Smart Reorder Predictions</span>
            </div>
            {reorderPredictions.map(pred => (
              <div key={pred.id} style={{ background:T.redBg,
                border:`1px solid ${T.red}22`, borderRadius:18,
                padding:"14px 16px", marginBottom:10 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start",
                  marginBottom:10 }}>
                  <Icon name="alertTriangle" size={16} color={T.red}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:T.red }}>
                      {pred.name} stock will finish in {pred.daysLeft} days
                    </div>
                    <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>
                      Current: {pred.stock} units · Avg sales: {pred.dailySales}/day
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, background:T.white, borderRadius:12,
                    padding:"8px 12px", border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                      RECOMMEND
                    </div>
                    <div style={{ fontSize:12, fontWeight:900, color:T.navy }}>
                      {pred.recommendQty} units
                    </div>
                  </div>
                  <div style={{ flex:1, background:T.white, borderRadius:12,
                    padding:"8px 12px", border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                      EST. COST
                    </div>
                    <div style={{ fontSize:12, fontWeight:900, color:T.navy,
                      fontFamily:"monospace" }}>{fmt(pred.estimatedCost)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SEARCH ── */}
        <div style={{ display:"flex", gap:10, alignItems:"center",
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:"11px 16px", marginBottom:14,
          boxShadow:T.shadow }}>
          <Icon name="search" size={16} color={T.textMute}/>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search products..."
            style={{ flex:1, background:"transparent", border:"none",
              outline:"none", fontSize:13, color:T.textMain }}/>
          {searchText && (
            <button onClick={() => setSearchText("")} style={{
              background:"none", border:"none" }}>
              <Icon name="x" size={16} color={T.textMute}/>
            </button>
          )}
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto",
          marginBottom:8, paddingBottom:2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding:"7px 14px", borderRadius:99, flexShrink:0,
              background:activeCat===cat ? T.navy : T.card,
              border:activeCat===cat ? "none" : `1px solid ${T.border}`,
              color:activeCat===cat ? "#fff" : T.textMid,
              fontSize:11, fontWeight:700,
              boxShadow:activeCat===cat ? `0 4px 12px ${T.navy}33` : T.shadow,
            }}>{cat}</button>
          ))}
        </div>

        {/* Low stock filter toggle */}
        {showLowStock && (
          <div style={{ display:"flex", alignItems:"center", gap:8,
            marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6,
              background:T.redBg, border:`1px solid ${T.red}22`,
              borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontSize:11, fontWeight:800, color:T.red }}>
                Showing Low Stock Only
              </span>
              <button onClick={() => setShowLowStock(false)} style={{
                background:"none", border:"none" }}>
                <Icon name="x" size={12} color={T.red}/>
              </button>
            </div>
          </div>
        )}

        {/* ── INVENTORY LIST ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:12 }}>📦</div>
            <div style={{ fontSize:16, fontWeight:800, color:T.textMain,
              marginBottom:8 }}>No products found</div>
            <div style={{ fontSize:13, color:T.textMute }}>
              Try scanning products with Panda Vision AI
            </div>
          </div>
        ) : filtered.map(item => {
          const isLow      = item.stock <= item.reorderAt;
          const isExpanded = expandItem === item.id;
          const stockPct   = Math.min(100, Math.round((item.stock / (item.reorderAt*2)) * 100));
          return (
            <div key={item.id} style={{
              background:T.card, borderRadius:20, marginBottom:12,
              border:`1.5px solid ${isLow ? T.red+"33" : T.border}`,
              boxShadow:T.shadow, overflow:"hidden",
              animation:"fadeUp 0.25s ease",
            }}>
              <div onClick={() => setExpandItem(isExpanded?null:item.id)}
                style={{ padding:"14px 16px", cursor:"pointer",
                  display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
                  background:T.navyLight,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="package" size={20} color={T.navy+"44"}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6,
                    marginBottom:3 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:T.textMain,
                      overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{item.name}</span>
                    {item.updatedVia === "vision" && (
                      <div style={{ background:T.purpleBg, borderRadius:6,
                        padding:"1px 6px", display:"flex", alignItems:"center", gap:3,
                        flexShrink:0 }}>
                        <Icon name="sparkle" size={8} color={T.purple}/>
                        <span style={{ fontSize:8, fontWeight:800,
                          color:T.purple }}>AI</span>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:T.textMute, marginBottom:6 }}>
                    {item.category} · {item.updatedAt}
                  </div>
                  <div style={{ height:5, background:T.border, borderRadius:99,
                    overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${stockPct}%`,
                      background:isLow
                        ? `linear-gradient(90deg,${T.red},${T.red}88)`
                        : `linear-gradient(90deg,${T.green},${T.green}88)`,
                      borderRadius:99 }}/>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:900,
                    color:isLow ? T.red : T.navy,
                    fontFamily:"monospace" }}>{item.stock}</div>
                  <div style={{ fontSize:9, color:T.textMute }}>{item.unit}</div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop:`1px solid ${T.border}`,
                  padding:"14px 16px", animation:"fadeUp 0.2s ease" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                    gap:10, marginBottom:14 }}>
                    <div style={{ background:T.bg, borderRadius:12,
                      padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        COST PRICE
                      </div>
                      <div style={{ fontSize:13, fontWeight:900, color:T.textMain,
                        fontFamily:"monospace" }}>{fmt(item.costPrice)}</div>
                    </div>
                    <div style={{ background:T.bg, borderRadius:12,
                      padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:T.textMute, fontWeight:700 }}>
                        SELL PRICE
                      </div>
                      <div style={{ fontSize:13, fontWeight:900, color:T.green,
                        fontFamily:"monospace" }}>{fmt(item.sellPrice)}</div>
                    </div>
                  </div>

                  {/* Quick stock adjust */}
                  <div style={{ display:"flex", alignItems:"center", gap:10,
                    justifyContent:"center", marginBottom:14,
                    background:T.navyLight, borderRadius:14, padding:"10px" }}>
                    <button onClick={() => adjustStock(item.id, -1)} style={{
                      width:34, height:34, borderRadius:10, background:T.white,
                      border:`1px solid ${T.border}`, fontSize:18, fontWeight:900,
                      color:T.red, display:"flex", alignItems:"center",
                      justifyContent:"center" }}>−</button>
                    <div style={{ fontSize:16, fontWeight:900, color:T.navy,
                      fontFamily:"monospace", minWidth:50, textAlign:"center" }}>
                      {item.stock}
                    </div>
                    <button onClick={() => adjustStock(item.id, 1)} style={{
                      width:34, height:34, borderRadius:10, background:T.white,
                      border:`1px solid ${T.border}`, fontSize:18, fontWeight:900,
                      color:T.green, display:"flex", alignItems:"center",
                      justifyContent:"center" }}>+</button>
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => showToast("Edit form coming soon!", T.navy)}
                      style={{ flex:1, padding:"10px 0", borderRadius:12,
                        background:T.navyLight, border:`1px solid ${T.border}`,
                        fontSize:12, fontWeight:800, color:T.navy,
                        display:"flex", alignItems:"center",
                        justifyContent:"center", gap:6 }}>
                      <Icon name="edit" size={13} color={T.navy}/>
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item.id)} style={{
                      flex:1, padding:"10px 0", borderRadius:12,
                      background:T.redBg, border:`1px solid ${T.red}22`,
                      fontSize:12, fontWeight:800, color:T.red,
                      display:"flex", alignItems:"center",
                      justifyContent:"center", gap:6 }}>
                      <Icon name="trash" size={13} color={T.red}/>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>

      <BottomNav active="inventory"/>
    </div>
  );
}
