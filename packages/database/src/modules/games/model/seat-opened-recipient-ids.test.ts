import { describe, expect, it } from "vitest";

import { seatOpenedRecipientIds } from "./seat-opened-recipient-ids";

const now = new Date("2026-10-05T00:00:00Z");
const game = {
  confirmedAt: new Date("2026-10-10T11:00:00Z"),
  cancelledAt: null,
  drawnAt: null,
  recruitMethod: "first_come" as const,
  maxPlayers: 3,
};
const participants = [
  { userId: "a", status: "confirmed" as const },
  { userId: "b", status: "confirmed" as const },
  { userId: "c", status: "waiting" as const },
  { userId: "d", status: "waiting" as const },
];

describe("seatOpenedRecipientIds", () => {
  it("빈자리가 있으면 대기자 전원", () => {
    expect(seatOpenedRecipientIds({ game, participants, now })).toEqual(["c", "d"]);
  });

  it("추첨 전이면 0명", () => {
    expect(
      seatOpenedRecipientIds({ game: { ...game, recruitMethod: "lottery" }, participants, now }),
    ).toEqual([]);
    expect(
      seatOpenedRecipientIds({
        game: { ...game, recruitMethod: "lottery", drawnAt: now },
        participants,
        now,
      }),
    ).toEqual(["c", "d"]);
  });

  it("세션 시작 뒤면 0명", () => {
    expect(
      seatOpenedRecipientIds({
        game: { ...game, confirmedAt: new Date("2026-10-04T11:00:00Z") },
        participants,
        now,
      }),
    ).toEqual([]);
  });

  it("빈자리가 없으면 0명", () => {
    expect(seatOpenedRecipientIds({ game: { ...game, maxPlayers: 2 }, participants, now })).toEqual(
      [],
    );
  });

  it("취소된 구인이면 0명", () => {
    expect(
      seatOpenedRecipientIds({ game: { ...game, cancelledAt: now }, participants, now }),
    ).toEqual([]);
  });
});
