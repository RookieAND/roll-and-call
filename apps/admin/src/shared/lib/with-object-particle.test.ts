import { describe, expect, it } from "vitest";

import { withObjectParticle } from "./with-object-particle";

describe("withObjectParticle", () => {
  it("받침 유무로 을·를을 고른다", () => {
    expect(withObjectParticle("붉은 여관의 밤 2부")).toBe("붉은 여관의 밤 2부를");
    expect(withObjectParticle("13번째 방")).toBe("13번째 방을");
    expect(withObjectParticle("INSANE")).toBe("INSANE을(를)");
  });
});
