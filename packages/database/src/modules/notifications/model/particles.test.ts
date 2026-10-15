import { describe, expect, it } from "vitest";

import { comitativeParticle } from "./comitative-particle";
import { directionalParticle } from "./directional-particle";
import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";
import { objectParticle } from "./object-particle";
import { topicParticle } from "./topic-particle";

describe("objectParticle", () => {
  it.each([
    ["달빛토끼", "를"],
    ["새벽별", "을"],
    ["달빛토끼2", "를"],
    ["달빛토끼3", "을"],
    ["rookie", "를"],
  ])("%s%s", (word, particle) => {
    expect(objectParticle(word)).toBe(particle);
  });
});

describe("directionalParticle", () => {
  it.each([
    ["달빛토끼2", "로"],
    ["달빛토끼3", "으로"],
    ["별7", "로"],
    ["새벽별", "로"],
    ["달빛토끼10", "으로"],
    ["rookie", "로"],
  ])("%s%s", (word, particle) => {
    expect(directionalParticle(word)).toBe(particle);
  });
});

describe("comitativeParticle", () => {
  it("받침이 있으면 과, 없거나 한글이 아니면 와", () => {
    expect(comitativeParticle("하늘달빛")).toBe("과");
    expect(comitativeParticle("노이")).toBe("와");
    expect(comitativeParticle("rookieand")).toBe("와");
  });
});

describe("topicParticle", () => {
  it("받침이 있으면 은, 없거나 한글이 아니거나 비어 있으면 는", () => {
    expect(topicParticle("루킨")).toBe("은");
    expect(topicParticle("노이")).toBe("는");
    expect(topicParticle("noi_")).toBe("는");
    expect(topicParticle("")).toBe("는");
  });
});

describe("endsWithHangulSyllable", () => {
  it("마지막 글자만 본다", () => {
    expect(endsWithHangulSyllable("콜오크")).toBe(true);
    expect(endsWithHangulSyllable("2부")).toBe(true);
    expect(endsWithHangulSyllable("INSANE")).toBe(false);
    expect(endsWithHangulSyllable("방 2")).toBe(false);
    expect(endsWithHangulSyllable("")).toBe(false);
  });
});
