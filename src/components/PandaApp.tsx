import { lazy, Suspense, useMemo, useState, type ComponentType } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { findScreen } from "@/lib/panda-screens";

const MODULES = [
  { id: "wallet", label: "Wallet", icon: "💳", slug: "PandaWallet-FULL" },
  { id: "market", label: "Market", icon: "🛍️", slug: "PandaMarketplace-Brick18-PRODUCTION" },
  { id: "business", label: "Business", icon: "💼", slug: "PandaBusinessHub-BH9-PRODUCTION" },
  { id: "credit", label: "Credit", icon: "📊", slug: "PandaCredit-CR6-FullAssembly" },
  { id: "invest", label: "Invest", icon: "📈", slug: "PandaInvestments-IN6-FullAssembly" },
  { id: "community", label: "Vikoba", icon: "👥", slug: "PandaCommunity-CM6-FullAssembly" },
  { id: "farmer", label: "Farmer", icon: "🌾", slug: "PandaFinance-ComingSoon-FarmerHub" },
  { id: "insurance", label: "Insurance", icon: "🛡️", slug: "PandaFinance-ComingSoon-InsuranceHub" },
  { id: "education", label: "Learn", icon: "🎓", slug: "PandaFinance-ComingSoon-EducationHub" },
];

const loading = <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading…</div>;

function Screen({ slug, props }: { slug: string; props?: Record<string, unknown> }) {
  const Comp = useMemo(() => {
    const s = findScreen(slug);
    return s ? (lazy(s.load) as ComponentType<Record<string, unknown>>) : null;
  }, [slug]);
  if (!Comp) return <p className="p-8">Missing screen: {slug}</p>;
  return <Suspense fallback={loading}><Comp {...props} /></Suspense>;
}

function Shell() {
  const [stage, setStage] = useState<"splash" | "onboarding" | "app">("splash");
  const [active, setActive] = useState("wallet");
  const enter = () => setStage("app");

  if (stage === "splash") return <Screen slug="PandaAuth-AUTH1-Splash" props={{ onReady: () => setStage("onboarding") }} />;
  if (stage === "onboarding") return <Screen slug="PandaAuth-AUTH2-Onboarding" props={{ onComplete: enter, onSkip: enter }} />;

  const mod = MODULES.find((m) => m.id === active) ?? MODULES[0]!;
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-[9999] flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 shadow-sm">
        {MODULES.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              m.id === active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </nav>
      <Screen key={mod.slug} slug={mod.slug} />
    </div>
  );
}

export function PandaApp() {
  return <ClientOnly fallback={loading}><Shell /></ClientOnly>;
}
