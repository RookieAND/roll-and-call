import { describe, expect, it } from "vitest";

import { participationConditions } from "./participation-conditions";

const game = { rule: "CoC 7th", minRulePlays: 3, requireRulebookCert: true };

describe("participationConditions", () => {
  it("조건이 없으면 비어 있다", () => {
    expect(
      participationConditions({
        game: { ...game, minRulePlays: null, requireRulebookCert: false },
        standing: null,
      }),
    ).toEqual([]);
  });

  it("플레이 횟수와 인증을 각각 견준다", () => {
    const [plays, cert] = participationConditions({
      game,
      standing: { plays: 1, certified: true },
    });
    expect(plays).toMatchObject({ mine: "내 플레이 1회", met: false });
    expect(cert).toMatchObject({ mine: "인증함", met: true });
  });

  it("내 현황이 없으면 충족 여부를 비운다", () => {
    expect(participationConditions({ game, standing: null }).map((c) => c.met)).toEqual([
      null,
      null,
    ]);
  });
});
