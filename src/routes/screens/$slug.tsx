import { createFileRoute, notFound } from "@tanstack/react-router";
import { PandaScreen } from "@/components/PandaScreen";
import { findScreen } from "@/lib/panda-screens";

export const Route = createFileRoute("/screens/$slug")({
  loader: ({ params }) => {
    const s = findScreen(params.slug);
    if (!s) throw notFound();
    return { label: s.label };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.label ?? "Screen"} — Panda Finance` },
      { name: "description", content: `Panda Finance screen: ${loaderData?.label ?? ""}` },
      { property: "og:title", content: `${loaderData?.label ?? "Screen"} — Panda Finance` },
      { property: "og:description", content: "A Panda Finance app screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PandaScreen slug={Route.useParams().slug} />,
});
