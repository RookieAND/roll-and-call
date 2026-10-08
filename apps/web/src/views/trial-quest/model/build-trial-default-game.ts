import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { addDays, toKst } from "@/shared/lib";
import type { GameDefaults } from "@/widgets/game-form";

import { buildTrialGame } from "./build-trial-game";
import { TRIAL_KIND } from "./trial-kind";
import { TRIAL_RULEBOOK } from "./trial-rulebook";

export const TRIAL_MY_GAME_TITLE = "[연습] 달빛 여관의 실종자";

// 구인 등록 위저드의 기본값. 처음부터 끝까지 채워져 있어 [다음]만 눌러도 등록까지 갈 수 있다.
export function buildTrialDefaultGame({ rule, now }: { rule: string; now: Date }): GameDefaults {
  const today = toKst(now).format("YYYY-MM-DD");
  const rangeStart = addDays({ date: today, count: 3 });
  const base = buildTrialGame({ kind: TRIAL_KIND.firstCome, applied: false, now });
  const { gm: _gm, participants: _participants, ...game } = base;
  return {
    ...game,
    title: TRIAL_MY_GAME_TITLE,
    rule,
    rulebookId: TRIAL_RULEBOOK.id,
    recruitMethod: RECRUIT_METHOD.firstCome,
    scheduleMode: SCHEDULE_MODE.coordinate,
    maxPlayers: 4,
    minPlayers: null,
    rangeStart,
    rangeEnd: addDays({ date: rangeStart, count: 3 }),
    confirmedAt: null,
    endDate: new Date(`${addDays({ date: rangeStart, count: -1 })}T19:00:00+09:00`),
  };
}
