import { createFileRoute, Link } from "@tanstack/react-router";
import { screens } from "@/lib/panda-screens";

export const Route = createFileRoute("/screens/")({
  head: () => ({
    meta: [
      { title: "All Screens — Panda Finance" },
      { name: "description", content: "Browse every Panda Finance screen: wallet, marketplace, credit, investments, community and business hub." },
      { property: "og:title", content: "All Screens — Panda Finance" },
      { property: "og:description", content: "Browse every Panda Finance screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Screens,
});

function Screens() {
  const groups = [...new Set(screens.map((s) => s.group))];
  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-extrabold">Panda Finance</h1>
        <p className="mt-2 text-muted-foreground">{screens.length} screens</p>
        {groups.map((g) => (
          <section key={g} className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">{g}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {screens.filter((s) => s.group === g).map((s) => (
                <Link key={s.slug} to="/screens/$slug" params={{ slug: s.slug }}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary">
                  {s.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
