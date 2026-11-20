import { lazy, Suspense, useMemo } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { findScreen } from "@/lib/panda-screens";

export function PandaScreen({ slug }: { slug: string }) {
  const screen = findScreen(slug);
  const Comp = useMemo(() => (screen ? lazy(screen.load) : null), [screen]);
  if (!Comp) return <p className="p-8 text-foreground">Screen not found.</p>;
  const loading = <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading…</div>;
  return (
    <>
      <ClientOnly fallback={loading}>
        <Suspense fallback={loading}>
          <Comp />
        </Suspense>
      </ClientOnly>
      <Link to="/screens" className="fixed bottom-4 left-4 z-[9999] rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg">
        All screens
      </Link>
    </>
  );
}
