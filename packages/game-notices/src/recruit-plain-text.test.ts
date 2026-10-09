import type { Game } from "@roll-and-call/database";
import { expect, it } from "vitest";

import { recruitPlainText } from "./recruit-plain-text";

const game = {
  rule: "크툴루의 부름 7th",
  maxPlayers: 3,
  recruitMethod: "first_come",
  scheduleMode: "fixed",
  confirmedAt: new Date("2026-10-05T04:00:00Z"),
  rangeStart: null,
  rangeEnd: null,
  endDate: new Date("2026-10-05T01:00:00Z"),
  synopsis: null,
  notice: null,
  genres: ["클로즈드", "조사"],
  platforms: ["보이스"],
  triggers: ["유혈", "사망"],
  playMinutes: 240,
  aiImage: false,
  playType: "voice",
} as unknown as Game;

it("항목을 한 줄씩 적고 취소면 맨 위에 알린다", () => {
  const { content, followUps } = recruitPlainText({
    game,
    gmName: "새벽세시",
    confirmedCount: 2,
    cancelled: true,
  });
  expect(content.startsWith("> 🚫")).toBe(true);
  expect(content).toContain("- **인원**　2/3명 · 선착순");
  expect(content).toContain("- **시작**　10월 5일 (월) 13:00");
  expect(content).toContain("### ⚠️ 트리거\n||`유혈`|| ||`사망`||");
  expect(content).toContain("- **플레이 시간**　4시간");
  expect(content).toContain("- **AI 이미지**　`사용 안 함`");
  expect(content).toContain("- **진행 방식**　보이스");
  expect(followUps).toEqual([]);
});

it("최소 인원이 있으면 인원 줄에 덧붙인다", () => {
  const { content } = recruitPlainText({
    game: { ...game, minPlayers: 2 },
    gmName: "새벽세시",
    confirmedCount: 1,
  });
  expect(content).toContain("- **인원**　1/3명 (최소 2명) · 선착순");
});
