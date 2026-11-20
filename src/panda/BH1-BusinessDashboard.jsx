import React, { useState } from 'react';
import {
  Bell,
  TrendingUp,
  Wallet,
  FileText,
  Camera,
  Package,
  BarChart3,
  Bot,
  ChevronRight,
  Receipt,
  Home,
  ClipboardList,
  MoreHorizontal,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ShoppingBag,
  Store,
  PieChart,
  Landmark,
} from 'lucide-react';

/**
 * ============================================================
 * BH-1 : BUSINESS DASHBOARD
 * Module 3 — Panda Business Hub — Panda Finance
 * ============================================================
 * Home screen for the business owner. Today's numbers, AI
 * insights, cash flow preview, quick actions, business health,
 * and recent activity.
 *
 * ASSEMBLY CONTRACT
 * ------------------------------------------------------------
 * Every prop is optional — the brick renders fully on mock
 * data so it can be dropped into a screen/router before the
 * backend exists, same pattern as PandaWallet-FULL.jsx and the
 * Marketplace assembly.
 *
 *   business        {id, name, owner_first_name, logo_initial}
 *   currentUser      {id, role}                          👤 AUTH
 *   todayStats       {revenue, expenses, profit,
 *                      orders_count, vs_yesterday_pct}
 *   cashFlowTrend    [{day, in, out}]  — last 7 days
 *   aiInsights       [{id, severity, text, action, nav}]  🤖 AI
 *   recentActivity   [{id, type, label, time, amount}]
 *   businessHealth   {score, label, factors:[{name,value}]}
 *   walletBalance    number (TZS)                         💰 WALLET
 *   onNavigate       (destination: string) => void         🧭 NAVIGATE
 *
 * onNavigate destinations fired by this brick:
 *   'dashboard' | 'bookkeeping' | 'inventory' | 'invoices' |
 *   'cashflow'  | 'coach' | 'tax' | 'reports' |
 *   'wallet'    | 'marketplace' | 'notifications'
 * ============================================================
 */

const C = {
  navy: '#0B1F4B',
  navyDeep: '#13285C',
  gold: '#C9960A',
};

/* ---------------------------------------------------------- */
/* 🔌 BACKEND — mock data. Replace each block per the comment. */
/* ---------------------------------------------------------- */

const MOCK_BUSINESS = {
  id: 'biz_001',
  name: 'Furaha Grocers',
  owner_first_name: 'Neema',
  logo_initial: 'F',
};
// 🔌 supabase.from('businesses').select('*').eq('owner_id', userId).single()

const MOCK_USER = { id: 'user_001', role: 'owner' };
// 👤 supabase.auth.getUser()

const MOCK_TODAY_STATS = {
  revenue: 487500,
  expenses: 162000,
  profit: 325500,
  orders_count: 14,
  vs_yesterday_pct: 18,
};
// 🔌 view aggregating orders + bookkeeping_entries + invoice_payments WHERE date = today

const MOCK_CASHFLOW_7D = [
  { day: 'Mon', in: 320000, out: 140000 },
  { day: 'Tue', in: 410000, out: 180000 },
  { day: 'Wed', in: 260000, out: 120000 },
  { day: 'Thu', in: 505000, out: 210000 },
  { day: 'Fri', in: 380000, out: 160000 },
  { day: 'Sat', in: 610000, out: 240000 },
  { day: 'Sun', in: 487500, out: 162000 },
];
// 🔌 supabase.rpc('get_cashflow_trend', { business_id, days: 7 })

const MOCK_AI_INSIGHTS = [
  {
    id: 'ins_1',
    severity: 'alert',
    text: '3 invoices are overdue, totaling TZS 340,000',
    action: 'Send reminders',
    nav: 'invoices',
  },
  {
    id: 'ins_2',
    severity: 'warning',
    text: 'Cooking oil stock is low — only 4 units left',
    action: 'Reorder now',
    nav: 'inventory',
  },
  {
    id: 'ins_3',
    severity: 'positive',
    text: 'Profit margin is up 6% this week vs last week',
    action: 'See why',
    nav: 'coach',
  },
];
// 🤖 AI — Edge Function 'business-insights' (Claude API) reasoning over
//    bookkeeping_entries + inventory + invoices + tax_deadlines

const MOCK_RECENT_ACTIVITY = [
  { id: 'a1', type: 'order', label: 'Order #1042 paid', time: '10 min ago', amount: 45000 },
  { id: 'a2', type: 'expense', label: 'Rent expense logged', time: '1 hr ago', amount: -120000 },
  { id: 'a3', type: 'invoice', label: 'Invoice INV-014 paid', time: '3 hr ago', amount: 85000 },
  { id: 'a4', type: 'expense', label: 'Stock purchase — supplier', time: '5 hr ago', amount: -60000 },
  { id: 'a5', type: 'order', label: 'Order #1041 paid', time: 'Yesterday', amount: 32500 },
];
// 🔌 unified view: bookkeeping_entries ∪ orders ∪ invoice_payments, order by created_at desc limit 5
// 🔐 RLS: rows scoped to business_id owned by auth.uid()

const MOCK_BUSINESS_HEALTH = {
  score: 82,
  label: 'Good',
  factors: [
    { name: 'On-time payments', value: 90 },
    { name: 'Inventory accuracy', value: 78 },
    { name: 'Tax compliance', value: 85 },
    { name: 'Cash flow stability', value: 75 },
  ],
};
// 🔌 Edge Function computing weighted score from payments/inventory/tax/cashflow tables

const MOCK_WALLET_BALANCE = 1240000;
// 💰 PandaWallet.getBalance(business.wallet_id)

/* ---------------------------------------------------------- */

const SEVERITY_STYLES = {
  alert: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertCircle },
  positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: TrendingUp },
};

const ACTIVITY_ICONS = { order: ShoppingBag, expense: Receipt, invoice: FileText };

const formatTZS = (n) => {
  const sign = n < 0 ? '-' : '';
  return `${sign}TZS ${Math.abs(n).toLocaleString('en-US')}`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function InsightCard({ insight, onDismiss, onAction }) {
  const s = SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.warning;
  const Icon = s.icon;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border ${s.border} ${s.bg} p-3.5`}>
      <div className={`mt-0.5 shrink-0 ${s.text}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-snug ${s.text}`}>{insight.text}</p>
        <button
          onClick={() => onAction(insight.nav)}
          className={`mt-1.5 text-xs font-semibold underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded ${s.text}`}
        >
          {insight.action}
        </button>
      </div>
      <button
        onClick={() => onDismiss(insight.id)}
        aria-label="Dismiss insight"
        className="shrink-0 h-6 w-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function ActivityRow({ item }) {
  const Icon = ACTIVITY_ICONS[item.type] || Receipt;
  const positive = item.amount >= 0;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(11,31,75,0.06)' }}
      >
        <Icon size={16} strokeWidth={2} color={C.navy} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.label}</p>
        <p className="text-xs text-slate-400">{item.time}</p>
      </div>
      <p className={`text-sm font-mono font-semibold shrink-0 ${positive ? 'text-emerald-600' : 'text-slate-500'}`}>
        {positive ? '+' : ''}
        {formatTZS(item.amount)}
      </p>
    </div>
  );
}

function QuickAction({ action, onNavigate }) {
  const Icon = action.icon;
  return (
    <button
      onClick={() => onNavigate(action.nav)}
      className="flex flex-col items-center gap-1.5 shrink-0 w-16 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl"
    >
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: C.navy }}>
        <Icon size={20} strokeWidth={2} color={C.gold} />
      </div>
      <span className="text-xs text-slate-600 text-center leading-tight">{action.label}</span>
    </button>
  );
}

function NavItem({ item, active, onNavigate }) {
  const Icon = item.icon;
  const color = active ? C.navy : '#94A3B8';
  return (
    <button
      onClick={() => onNavigate(item.nav)}
      className="flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] focus:outline-none"
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} color={color} />
      <span className="text-xs" style={{ color, fontWeight: active ? 600 : 400 }}>
        {item.label}
      </span>
    </button>
  );
}

export default function BH1BusinessDashboard({
  business = MOCK_BUSINESS,
  currentUser = MOCK_USER,
  todayStats = MOCK_TODAY_STATS,
  cashFlowTrend = MOCK_CASHFLOW_7D,
  aiInsights = MOCK_AI_INSIGHTS,
  recentActivity = MOCK_RECENT_ACTIVITY,
  businessHealth = MOCK_BUSINESS_HEALTH,
  walletBalance = MOCK_WALLET_BALANCE,
  onNavigate = (dest) => console.log('[BH-1] navigate ->', dest),
}) {
  const [dismissed, setDismissed] = useState([]);
  const [moreOpen, setMoreOpen] = useState(false);

  const visibleInsights = aiInsights.filter((i) => !dismissed.includes(i.id));
  const netProfit = todayStats.profit;
  const isPositive = netProfit >= 0;
  const deltaPositive = todayStats.vs_yesterday_pct >= 0;
  const maxFlow = Math.max(...cashFlowTrend.map((d) => Math.max(d.in, d.out)), 1);
  const weekNet = cashFlowTrend.reduce((sum, d) => sum + d.in - d.out, 0);

  const quickActions = [
    { key: 'invoice', label: 'New Invoice', icon: FileText, nav: 'invoices' },
    { key: 'scan', label: 'Scan Receipt', icon: Camera, nav: 'bookkeeping' },
    { key: 'expense', label: 'Add Expense', icon: Receipt, nav: 'bookkeeping' },
    { key: 'reports', label: 'Reports', icon: BarChart3, nav: 'reports' },
    { key: 'product', label: 'Add Product', icon: Package, nav: 'marketplace' },
  ];

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, nav: 'dashboard' },
    { key: 'bookkeeping', label: 'Books', icon: ClipboardList, nav: 'bookkeeping' },
    { key: 'inventory', label: 'Inventory', icon: Package, nav: 'inventory' },
    { key: 'invoices', label: 'Invoices', icon: FileText, nav: 'invoices' },
    { key: 'more', label: 'More', icon: MoreHorizontal, nav: 'more' },
  ];

  const handleNav = (dest) => {
    if (dest === 'more') {
      setMoreOpen(true);
      return;
    }
    onNavigate(dest);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <style>{`
        @keyframes drawPulse { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        .pulse-line { stroke-dasharray: 1 1; stroke-dashoffset: 1; animation: drawPulse 1.3s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-line { animation: none; stroke-dashoffset: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full bg-slate-50 min-h-screen relative pb-24" style={{ maxWidth: 430 }}>
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-6 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-11 w-11 rounded-full text-white flex items-center justify-center font-semibold text-base shrink-0"
              style={{ backgroundColor: C.navy }}
            >
              {business.logo_initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 leading-tight">
                {getGreeting()}, {business.owner_first_name}
              </p>
              <h1 className="text-base font-semibold text-slate-800 truncate leading-tight">{business.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* 💰 WALLET swap point */}
            <button
              onClick={() => onNavigate('wallet')}
              className="flex items-center gap-1.5 h-11 pl-2.5 pr-3 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Panda Wallet balance"
            >
              <Wallet size={16} color={C.gold} />
              <span className="text-xs font-mono font-semibold" style={{ color: C.navy }}>
                {formatTZS(walletBalance)}
              </span>
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              aria-label="Notifications"
              className="h-11 w-11 rounded-full bg-white border border-slate-200 flex items-center justify-center relative focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full" style={{ backgroundColor: C.gold }} />
            </button>
          </div>
        </header>

        <main className="px-5 space-y-5">
          {/* Hero: Today's Pulse */}
          <section
            className="rounded-3xl p-5 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyDeep})` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-wider uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Today's Pulse
              </p>
              <svg width="72" height="28" viewBox="0 0 72 28" fill="none" aria-hidden="true">
                <path
                  pathLength="1"
                  className="pulse-line"
                  d="M0,16 L10,16 L15,4 L21,24 L27,16 L36,16 L41,9 L46,16 L72,16"
                  stroke={C.gold}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className={`text-3xl font-mono font-bold leading-none ${isPositive ? 'text-white' : 'text-red-300'}`}>
                {formatTZS(netProfit)}
              </span>
              <span className={`text-xs font-semibold mb-1 flex items-center gap-0.5 ${deltaPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                {deltaPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(todayStats.vs_yesterday_pct)}%
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Net profit today · {todayStats.orders_count} orders
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('bookkeeping')}
                className="rounded-2xl p-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <ArrowUpRight size={12} /> Revenue
                </p>
                <p className="text-base font-mono font-semibold mt-0.5">{formatTZS(todayStats.revenue)}</p>
              </button>
              <button
                onClick={() => onNavigate('bookkeeping')}
                className="rounded-2xl p-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <ArrowDownRight size={12} /> Expenses
                </p>
                <p className="text-base font-mono font-semibold mt-0.5">{formatTZS(todayStats.expenses)}</p>
              </button>
            </div>
          </section>

          {/* 🤖 AI Insights */}
          {visibleInsights.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Bot size={15} color={C.navy} />
                <h2 className="text-sm font-semibold text-slate-700">AI Insights</h2>
              </div>
              <div className="space-y-2">
                {visibleInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onDismiss={(id) => setDismissed((d) => [...d, id])}
                    onAction={onNavigate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Cash flow preview → 🧭 navigates to BH-5 */}
          <section className="rounded-3xl bg-white border border-slate-100 p-4">
            <button
              onClick={() => onNavigate('cashflow')}
              className="w-full flex items-center justify-between mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg"
            >
              <h2 className="text-sm font-semibold text-slate-700">7-Day Cash Flow</h2>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: C.gold }} />
                In
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0B1F4B, #0B1F4B 2px, #7686AB 2px, #7686AB 4px)' }}
                />
                Out
              </span>
            </div>

            <div className="flex items-end justify-between gap-1.5 h-20">
              {cashFlowTrend.map((d) => (
                <div key={d.day} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                  <div
                    className="w-2 rounded-t"
                    style={{ height: `${(d.in / maxFlow) * 100}%`, backgroundColor: C.gold }}
                    aria-hidden="true"
                  />
                  <div
                    className="w-2 rounded-t"
                    style={{
                      height: `${(d.out / maxFlow) * 100}%`,
                      backgroundImage: 'repeating-linear-gradient(45deg, #0B1F4B, #0B1F4B 2px, #7686AB 2px, #7686AB 4px)',
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {cashFlowTrend.map((d) => (
                <span key={d.day} className="flex-1 text-center text-xs text-slate-400">
                  {d.day[0]}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2.5">
              Net {weekNet >= 0 ? '+' : ''}
              {formatTZS(weekNet)} this week
            </p>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-sm font-semibold text-slate-700 mb-2.5">Quick Actions</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
              {quickActions.map((a) => (
                <QuickAction key={a.key} action={a} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          {/* Business Health */}
          <section className="rounded-3xl bg-white border border-slate-100 p-4 flex items-center gap-4">
            <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90" aria-hidden="true">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#EEF0F4" strokeWidth="6" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={C.gold}
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${businessHealth.score} 100`}
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">Business Health: {businessHealth.score}/100</p>
              <p className="text-xs text-slate-400 mb-1.5">{businessHealth.label}</p>
              <p className="text-xs text-slate-500 truncate">
                {businessHealth.factors[0].name} {businessHealth.factors[0].value}% · {businessHealth.factors[1].name}{' '}
                {businessHealth.factors[1].value}%
              </p>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-3xl bg-white border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
              <button
                onClick={() => onNavigate('bookkeeping')}
                className="text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
                style={{ color: C.gold }}
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </main>

        {/* 🧭 Bottom Nav — swap points into other BH bricks */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-slate-100 flex h-16 z-20"
          style={{ maxWidth: 430 }}
        >
          {navItems.map((item) => (
            <NavItem key={item.key} item={item} active={item.key === 'dashboard'} onNavigate={handleNav} />
          ))}
        </nav>

        {/* More sheet — remaining BH bricks + cross-module swap points */}
        {moreOpen && (
          <div className="fixed inset-0 z-30 flex items-end justify-center">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              onClick={() => setMoreOpen(false)}
            />
            <div className="relative w-full bg-white rounded-t-3xl p-5 pb-8" style={{ maxWidth: 430 }}>
              <div className="h-1 w-10 bg-slate-200 rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-slate-800 mb-3">More</h3>
              <div className="space-y-1">
                {[
                  { label: 'Cash Flow Dashboard', icon: BarChart3, nav: 'cashflow' },
                  { label: 'AI Business Coach', icon: Bot, nav: 'coach' },
                  { label: 'Tax Assistant', icon: Landmark, nav: 'tax' },
                  { label: 'Business Reports', icon: PieChart, nav: 'reports' },
                ].map((row) => (
                  <button
                    key={row.nav}
                    onClick={() => {
                      setMoreOpen(false);
                      onNavigate(row.nav);
                    }}
                    className="w-full flex items-center gap-3 py-3 px-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl"
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(11,31,75,0.06)' }}
                    >
                      <row.icon size={17} color={C.navy} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{row.label}</span>
                    <ChevronRight size={16} className="ml-auto text-slate-300" />
                  </button>
                ))}
              </div>
              <div className="h-px bg-slate-100 my-3" />
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigate('wallet');
                  }}
                  className="w-full flex items-center gap-3 py-3 px-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl"
                >
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(201,150,10,0.12)' }}
                  >
                    <Wallet size={17} color={C.gold} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Panda Wallet</span>
                  <ChevronRight size={16} className="ml-auto text-slate-300" />
                </button>
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigate('marketplace');
                  }}
                  className="w-full flex items-center gap-3 py-3 px-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl"
                >
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(201,150,10,0.12)' }}
                  >
                    <Store size={17} color={C.gold} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Panda Marketplace</span>
                  <ChevronRight size={16} className="ml-auto text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
