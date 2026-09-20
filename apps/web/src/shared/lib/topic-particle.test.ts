import { describe, expect, it } from "vitest";

import { topicParticle } from "./topic-particle";

describe("topicParticle", () => {
  it("받침이 없으면 는", () => {
    expect(topicParticle("한랑아")).toBe("는");
    expect(topicParticle("노이")).toBe("는");
  });

  it("받침이 있으면 은", () => {
    expect(topicParticle("루킨")).toBe("은");
    expect(topicParticle("물벼락")).toBe("은");
  });

  it("한글이 아니거나 비어 있으면 는", () => {
    expect(topicParticle("noi_")).toBe("는");
    expect(topicParticle("rookieand")).toBe("는");
    expect(topicParticle("")).toBe("는");
  });
});
