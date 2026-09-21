import { describe, expect, it } from "vitest";

import { comitativeParticle } from "./comitative-particle";

describe("comitativeParticle", () => {
  it("받침이 있으면 과, 없으면 와", () => {
    expect(comitativeParticle("하늘달빛")).toBe("과");
    expect(comitativeParticle("노이")).toBe("와");
  });

  it("한글이 아니면 와", () => {
    expect(comitativeParticle("rookieand")).toBe("와");
  });
});
