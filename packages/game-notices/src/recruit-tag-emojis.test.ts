import { expect, it } from "vitest";

import { recruitTagEmojis } from "./recruit-tag-emojis";

it("상태 태그와 룰 태그에 이모지를 붙이고 모르는 룰은 주사위를 쓴다", () => {
  expect(recruitTagEmojis(["크툴루의 부름", "처음 보는 룰"])).toEqual({
    모집중: "🟢",
    마감: "🔴",
    취소됨: "🚫",
    "크툴루의 부름": "🐙",
    "처음 보는 룰": "🎲",
  });
});
