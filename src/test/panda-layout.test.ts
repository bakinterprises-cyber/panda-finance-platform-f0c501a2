import { describe, expect, it } from "vitest";
import { screens } from "@/lib/panda-screens";

const expected: Record<string, number> = {
  auth: 2, wallet: 1, marketplace: 27, business: 12, credit: 6, investments: 6, community: 6, finance: 3,
};

describe("Panda screen folders", () => {
  it("has 63 screens in the eight section folders", () => {
    const counts: Record<string, number> = {};
    for (const s of screens) counts[s.section] = (counts[s.section] ?? 0) + 1;
    expect(counts).toEqual(expected);
    expect(screens).toHaveLength(63);
  });
  it("no longer includes Finance 1 or Wallet B3/B5", () => {
    const slugs = screens.map((s) => s.slug);
    expect(slugs).not.toContain("PandaFinance-1");
    expect(slugs.some((s) => /Wallet-B[35]/.test(s))).toBe(false);
  });
});
