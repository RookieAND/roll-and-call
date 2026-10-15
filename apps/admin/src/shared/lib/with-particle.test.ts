import { describe, expect, it } from "vitest";

import { quoteWithParticle } from "./quote-with-particle";
import { withAndParticle } from "./with-and-particle";
import { withDirectionParticle } from "./with-direction-particle";
import { withObjectParticle } from "./with-object-particle";
import { withSubjectParticle } from "./with-subject-particle";
import { withTopicParticle } from "./with-topic-particle";

describe("with*Particle", () => {
  it("받침 유무로 조사를 고르고, 한글로 끝나지 않으면 두 조사를 다 보여 준다", () => {
    expect(withObjectParticle("붉은 여관의 밤 2부")).toBe("붉은 여관의 밤 2부를");
    expect(withObjectParticle("13번째 방")).toBe("13번째 방을");
    expect(withObjectParticle("INSANE")).toBe("INSANE을(를)");
    expect(withObjectParticle("방 3")).toBe("방 3을(를)");
    expect(withSubjectParticle("콜오크")).toBe("콜오크가");
    expect(withSubjectParticle("섀도우런")).toBe("섀도우런이");
    expect(withSubjectParticle("D&D")).toBe("D&D이(가)");
    expect(withTopicParticle("6판")).toBe("6판은");
    expect(withTopicParticle("CoC")).toBe("CoC은(는)");
    expect(withAndParticle("크툴루")).toBe("크툴루와");
    expect(withAndParticle("룰북")).toBe("룰북과");
    expect(withAndParticle("DX3")).toBe("DX3와(과)");
  });

  it("방향 조사는 받침이 없거나 ㄹ이면 '로', 한글로 끝나지 않으면 '로'", () => {
    expect(quoteWithParticle("모험가4821", withDirectionParticle)).toBe("「모험가4821」로");
    expect(quoteWithParticle("달빛운영자", withDirectionParticle)).toBe("「달빛운영자」로");
    expect(quoteWithParticle("하늘", withDirectionParticle)).toBe("「하늘」로");
    expect(quoteWithParticle("고양", withDirectionParticle)).toBe("「고양」으로");
  });
});
