import { BADGE_ROLE } from "@roll-and-call/database/badges/model";
import { describe, expect, it } from "vitest";

import type { MonthRecord } from "./build-month-record";
import { monthRankMedals } from "./month-rank-medals";

const person = (id: string) => ({ id, username: id, avatarUrl: null });

describe("monthRankMedals", () => {
  it("1위 동점자 모두와 2·3위에 메달을 주고 운영, 참여 순으로 쌓는다", () => {
    const record = {
      gms: {
        leaders: [person("a"), person("b")],
        leaderCount: 3,
        runnersUp: [{ rank: 2, person: person("c"), count: 2, sessions: 2 }, null],
      },
      players: {
        leaders: [person("c")],
        leaderCount: 5,
        runnersUp: [
          { rank: 2, person: person("a"), count: 4, sessions: 4 },
          { rank: 3, person: person("d"), count: 3, sessions: 3 },
        ],
      },
    } as MonthRecord;
    const medals = monthRankMedals(record);
    expect(medals.get("a")).toEqual([
      { role: BADGE_ROLE.gm, rank: 1 },
      { role: BADGE_ROLE.player, rank: 2 },
    ]);
    expect(medals.get("c")).toEqual([
      { role: BADGE_ROLE.gm, rank: 2 },
      { role: BADGE_ROLE.player, rank: 1 },
    ]);
    expect(medals.get("d")).toEqual([{ role: BADGE_ROLE.player, rank: 3 }]);
    expect(medals.has("z")).toBe(false);
  });
});
