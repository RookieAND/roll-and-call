import { SCHEDULE_MODE } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { buildTrialGame, TRIAL_VIEWER_ID } from "./build-trial-game";
import { TRIAL_KIND } from "./trial-kind";
import { TRIAL_MINE_GAME_ID } from "./trial-kind";
import type { TrialRecruit } from "./trial-store";

const DAY_MS = 24 * 60 * 60 * 1000;

// 방금 체험에서 등록한 구인. 내가 GM이고 체험 플레이어 2명이 신청해 있다.
export function buildTrialMyGame({
  recruit,
  now,
}: {
  recruit: TrialRecruit;
  now: Date;
}): GameDetailData {
  const base = buildTrialGame({ kind: TRIAL_KIND.firstCome, applied: false, now });
  return {
    ...base,
    id: TRIAL_MINE_GAME_ID,
    gmId: TRIAL_VIEWER_ID,
    gm: { avatarUrl: null, username: "나", bio: null },
    title: recruit.title,
    recruitMethod: recruit.recruitMethod,
    maxPlayers: recruit.maxPlayers,
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    rangeStart: new Date(now.getTime() + 3 * DAY_MS).toISOString().slice(0, 10),
    rangeEnd: new Date(now.getTime() + 6 * DAY_MS).toISOString().slice(0, 10),
  };
}
