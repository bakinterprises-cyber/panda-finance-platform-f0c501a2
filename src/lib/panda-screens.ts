import type { ComponentType } from "react";

type Loader = () => Promise<{ default: ComponentType }>;

const modules = import.meta.glob("../panda/*/*.jsx") as Record<string, Loader>;

export const screens = Object.entries(modules)
  .map(([path, load]) => {
    const [section = "", file = ""] = path.replace("../panda/", "").split("/");
    const slug = file.replace(".jsx", "");
    const label = slug.replace(/^Panda/, "").replace(/-/g, " ");
    const group = (slug.match(/^Panda([A-Za-z]+?)-/)?.[1] ?? "Other").replace(/([a-z])([A-Z])/g, "$1 $2");
    return { slug, label, group, section, load };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));

export const findScreen = (slug: string) => screens.find((s) => s.slug === slug);
