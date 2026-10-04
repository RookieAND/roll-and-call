import { describe, expect, it } from "vitest";

import { clockParticle } from "./clock-particle";

const both = (clock: string) => [
  clockParticle({ clock, kind: "subject" }),
  clockParticle({ clock, kind: "direction" }),
];

describe("clockParticle", () => {
  it("끝 숫자의 읽는 소리로 이/가, 으로/로를 고른다", () => {
    expect(both("23:00")).toEqual(["이", "으로"]);
    expect(both("22:45")).toEqual(["가", "로"]);
    expect(both("20:31")).toEqual(["이", "로"]);
    expect(both("20:33")).toEqual(["이", "으로"]);
    expect(both("20:37")).toEqual(["이", "로"]);
    expect(both("20:42")).toEqual(["가", "로"]);
  });
});
