import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/screens" });
  },
  head: () => ({
    meta: [
      { title: "Panda Finance — Wallet, Marketplace & Credit" },
      { name: "description", content: "Panda Finance: digital wallet, marketplace, credit, investments and community savings in one app." },
      { property: "og:title", content: "Panda Finance" },
      { property: "og:description", content: "Wallet, marketplace, credit, investments and community savings in one app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
