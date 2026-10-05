import { describe, expect, it } from "vitest";

import { BADGE_ROLE } from "./badge-ladder";
import { monthScoreboard } from "./month-scoreboard";
import { recordAppearances } from "./record-appearances";
import type { RecordGame } from "./record-session";
import { reviewAppearances } from "./review-appearances";

const START = new Date("2026-09-10T11:00:00Z");
const NOW = new Date("2026-09-30T00:00:00Z");

const player = (
  userId: string,
  overrides: Partial<RecordGame["participants"][number]> = {},
): RecordGame["participants"][number] => ({
  userId,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  ...overrides,
});

const players = (count: number) => Array.from({ length: count }, (_, index) => player(`p${index}`));

const game = (overrides: Partial<RecordGame> = {}): RecordGame => ({
  id: "g1",
  gmId: "gm",
  confirmedAt: START,
  playMinutes: 120,
  endedAt: null,
  hiddenAt: null,
  cancelledAt: null,
  rulebook: { category: { miniRule: false } },
  participants: players(3),
  ...overrides,
});

const gmScore = (target: RecordGame) =>
  recordAppearances([target], NOW).find((row) => row.userId === "gm" && row.role === "gm")!.score;

describe("GM 점수", () => {
  it("정식은 PL 3명이 100, 4·5·6명이 120·140·160, 7명도 160", () => {
    const scores = [3, 4, 5, 6, 7].map((count) => gmScore(game({ participants: players(count) })));
    expect(scores).toEqual([100, 120, 140, 160, 160]);
  });

  it("미니룰은 70·80·90·100이고 룰북이 없는 구인도 미니룰이다", () => {
    const mini = { category: { miniRule: true } };
    const scores = [3, 4, 5, 6].map((count) =>
      gmScore(game({ rulebook: mini, participants: players(count) })),
    );
    expect(scores).toEqual([70, 80, 90, 100]);
    expect(gmScore(game({ rulebook: null }))).toBe(70);
  });

  it("타이만은 15점이고 가점이 없으며 미니룰보다 우선한다", () => {
    expect(gmScore(game({ participants: players(1) }))).toBe(15);
    expect(gmScore(game({ rulebook: null, participants: players(1) }))).toBe(15);
  });

  it("정원이 아니라 실제 참석자로 타이만을 가른다(불참자는 빼고 센다)", () => {
    const target = game({ participants: [player("p0"), player("p1", { absent: true })] });
    expect(gmScore(target)).toBe(15);
  });
});

describe("PL 점수와 불참 감점", () => {
  it("참석자는 세션 점수를 받고 불참자는 PL·GM 점수에서 100씩 뺀다", () => {
    const rows = recordAppearances(
      [game({ participants: [...players(3), player("no", { absent: true })] })],
      NOW,
    );
    expect(rows.filter((row) => row.userId === "p0")).toEqual([
      { userId: "p0", role: BADGE_ROLE.player, startsAt: START, score: 100, sessions: 1 },
    ]);
    expect(rows.filter((row) => row.userId === "no").map((row) => [row.role, row.score])).toEqual([
      ["pl", -100],
      ["gm", -100],
    ]);
  });

  it("운영진이 불참을 취소하면 참석으로 돌아온다", () => {
    const rows = recordAppearances(
      [
        game({
          participants: [
            ...players(3),
            player("back", { absent: true, absenceCancelledAt: START }),
          ],
        }),
      ],
      NOW,
    );
    expect(rows.filter((row) => row.userId === "back").map((row) => row.score)).toEqual([100]);
  });

  it("0점 이하는 순위에 없고 음수가 나오지 않는다", () => {
    const rows = recordAppearances(
      [game({ participants: [...players(3), player("no", { absent: true })] })],
      NOW,
    );
    const board = monthScoreboard({ appearances: rows, role: "pl", month: "2026-09" });
    expect(board.map((row) => row.userId)).not.toContain("no");
    expect(board.every((row) => row.score > 0)).toBe(true);
  });

  it("끝나지 않았거나 숨긴 세션은 점수가 없다", () => {
    expect(recordAppearances([game({ hiddenAt: START })], NOW)).toEqual([]);
    expect(recordAppearances([game()], new Date("2026-09-10T11:30:00Z"))).toEqual([]);
  });
});

describe("후기 점수", () => {
  const review = (overrides: Partial<Parameters<typeof reviewAppearances>[0][number]> = {}) => ({
    authorId: "a",
    createdAt: START,
    body: "열 글자가 넘는 후기 본문입니다",
    hiddenAt: null,
    removedAt: null,
    authorAbsent: false,
    ...overrides,
  });

  it("공개 후기는 10점이고 9자 이하는 0점이다(공백 제외)", () => {
    expect(reviewAppearances([review()]).map((row) => row.score)).toEqual([10]);
    expect(reviewAppearances([review({ body: "아홉 글자 입니다 요" })])).toEqual([]);
    expect(reviewAppearances([review({ body: "가 나 다 라 마 바 사 아 자 차" })]).length).toBe(1);
  });

  it("숨김·제거·불참 보류는 0점이고 다시 공개하면 돌아온다", () => {
    expect(reviewAppearances([review({ hiddenAt: START })])).toEqual([]);
    expect(reviewAppearances([review({ removedAt: START })])).toEqual([]);
    expect(reviewAppearances([review({ authorAbsent: true })])).toEqual([]);
    expect(reviewAppearances([review({ hiddenAt: null })]).length).toBe(1);
  });

  it("처음 공개한 시각의 달에 센다", () => {
    const [row] = reviewAppearances([review({ createdAt: new Date("2026-10-02T00:00:00Z") })]);
    expect(monthScoreboard({ appearances: [row!], role: "pl", month: "2026-10" })[0]!.score).toBe(
      10,
    );
  });
});

describe("monthScoreboard", () => {
  const entry = (userId: string, score: number) => ({
    userId,
    role: BADGE_ROLE.player,
    startsAt: START,
    score,
    sessions: 1,
  });

  it("동점 1위는 전원이고 다음 점수대가 2위다", () => {
    const board = monthScoreboard({
      appearances: [entry("a", 100), entry("b", 100), entry("c", 50), entry("d", 15)],
      role: "pl",
      month: "2026-09",
    });
    expect(board.map((row) => [row.userId, row.rank])).toEqual([
      ["a", 1],
      ["b", 1],
      ["c", 2],
      ["d", 3],
    ]);
  });
});
