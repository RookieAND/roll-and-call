import { describe, expect, it } from "vitest";

import { conflictReason } from "./conflict-reason";

describe("conflictReason", () => {
  it("GM 겹침은 내 세션 제목, 참여자는 이름과 대기 여부를 보인다", () => {
    expect(
      conflictReason({
        conflict: {
          gmOverlaps: [
            {
              targetRoundNo: 1,
              startsAt: new Date(0),
              endsAt: new Date(0),
              gameTitle: "대관식",
            },
          ],
          conflicts: [
            { userId: "gm", role: "gm", roundNos: [1] },
            { userId: "a", role: "confirmed", roundNos: [1] },
            { userId: "b", role: "waiting", roundNos: [1] },
            { userId: "c", role: "waiting", roundNos: [1] },
          ],
        },
        nicknames: { a: "큐베", b: "한랑아" },
      }),
    ).toEqual([
      "내 세션 「대관식」과 시간이 겹칩니다.",
      "큐베님, 한랑아님(대기), 참여자님(대기)에게 이 시간에 다른 세션이 있습니다.",
    ]);
  });
});
