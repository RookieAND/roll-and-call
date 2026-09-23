import { expect, test } from "vitest";

import { avatarColorFor } from "./avatar-color";

test("같은 이름은 늘 같은 색이다", () => {
  expect(avatarColorFor("루키앤드")).toEqual(avatarColorFor("루키앤드"));
});

test("배경과 글자색은 같은 색 이름에서 나온다", () => {
  const [background, ink] = avatarColorFor("GM");
  expect(background).toMatch(/^var\(--rc-color-data-(\w+)-bg\)$/);
  expect(ink).toBe(background.replace("-bg)", "-ink)"));
});

// 해시가 31배로 자라며 32비트를 넘는다. 음수로 돌면 % 가 음수 인덱스를 내
// 팔레트 밖으로 나간다.
test("긴 이름도 팔레트 안에 머문다", () => {
  for (const name of ["", "a".repeat(200), "🎲🎲🎲", "\u{10FFFF}"]) {
    expect(avatarColorFor(name)[0]).toMatch(/^var\(--rc-color-data-\w+-bg\)$/);
  }
});
