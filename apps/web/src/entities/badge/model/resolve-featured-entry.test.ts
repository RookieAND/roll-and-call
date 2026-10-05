import { describe, expect, it } from "vitest";

import { featuredOptions } from "./featured-options";
import { heldBadges } from "./held-badges";
import { resolveFeaturedEntry } from "./resolve-featured-entry";

const held = heldBadges([{ badgeKey: "gm.variety", tier: 3, categoryName: null }]);

describe("resolveFeaturedEntry", () => {
  it("lists every owned tier, highest first", () => {
    expect(featuredOptions(held).map((option) => option.entry)).toEqual([
      "gm.variety",
      "gm.variety@2",
      "gm.variety@1",
    ]);
  });

  it("resolves a lower tier and rejects tiers not owned", () => {
    expect(resolveFeaturedEntry("gm.variety@1", held)?.tier).toBe(1);
    expect(resolveFeaturedEntry("gm.variety", held)?.tier).toBe(3);
    expect(resolveFeaturedEntry("gm.variety@4", held)).toBeNull();
    expect(resolveFeaturedEntry("gm.variety@x", held)).toBeNull();
  });
});
