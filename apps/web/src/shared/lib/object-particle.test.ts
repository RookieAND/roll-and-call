import { describe, expect, it } from "vitest";

import { directionalParticle } from "./directional-particle";
import { objectParticle } from "./object-particle";

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
