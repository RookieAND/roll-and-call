import { describe, expect, it } from "vitest";

import { quoteWithParticle, withObjectParticle, withTopicParticle } from "@/shared/lib";

import { withDirectionParticle } from "./with-direction-particle";

describe("quoteWithParticle", () => {
  it("낫표 안 낱말의 받침으로 조사를 고른다", () => {
    expect(quoteWithParticle("콜오크", withObjectParticle)).toBe("「콜오크」를");
    expect(quoteWithParticle("섀도우런 6판", withTopicParticle)).toBe("「섀도우런 6판」은");
    expect(quoteWithParticle("크툴루의 부름 7판", withDirectionParticle)).toBe(
      "「크툴루의 부름 7판」으로",
    );
    expect(quoteWithParticle("마기카로기아", withDirectionParticle)).toBe("「마기카로기아」로");
    expect(quoteWithParticle("소드 월드 2.5", withDirectionParticle)).toBe(
      "「소드 월드 2.5」(으)로",
    );
    expect(withDirectionParticle("서울")).toBe("서울로");
  });
});
