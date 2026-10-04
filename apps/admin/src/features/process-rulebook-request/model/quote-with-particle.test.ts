import { describe, expect, it } from "vitest";

import { quoteWithParticle, withObjectParticle, withTopicParticle } from "@/shared/lib";

describe("quoteWithParticle", () => {
  it("낫표 안 낱말의 받침으로 조사를 고른다", () => {
    expect(quoteWithParticle("콜오크", withObjectParticle)).toBe("「콜오크」를");
    expect(quoteWithParticle("섀도우런 6판", withTopicParticle)).toBe("「섀도우런 6판」은");
  });
});
