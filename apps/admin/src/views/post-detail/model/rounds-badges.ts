import type { AdminRoundsView } from "./admin-rounds";
import { finishedRoundCount } from "./finished-round-count";

const SCHEDULE_KIND_LABEL = { designated: "지정형", coordinated: "조율형" } as const;

// 「지정형」「총 6회」「3회 마침」 뱃지 글자.
export function roundsBadges({ scheduleKind, roundCount, rounds, now }: AdminRoundsView) {
  const finished = finishedRoundCount({ rounds, now });
  return [SCHEDULE_KIND_LABEL[scheduleKind], `총 ${roundCount}회`, `${finished}회 마침`];
}
