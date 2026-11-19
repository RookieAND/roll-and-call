import { rangesOverlap, type RoundSpan } from "./overlapping-round-numbers";
import { ROUND_COUNT_MAX, ROUND_COUNT_MIN, ROUND_MAX_HOURS } from "./round-limits";

export const ROUND_SCHEDULE_ERROR = {
  countRange: "COUNT_RANGE",
  briefing: "BRIEFING",
  endBeforeStart: "END_BEFORE_START",
  tooLong: "TOO_LONG",
  overlap: "OVERLAP",
  countMismatch: "COUNT_MISMATCH",
  tooManyDated: "TOO_MANY_DATED",
} as const;

export type RoundScheduleErrorCode =
  (typeof ROUND_SCHEDULE_ERROR)[keyof typeof ROUND_SCHEDULE_ERROR];

// 문구는 시안 요청서 61번을 그대로 쓴다. 설명회·조율형 초과 입력은 화면에서 나오지 않는 값이라 서버 전용 문구다.
export const ROUND_SCHEDULE_ERROR_MESSAGE: Record<RoundScheduleErrorCode, string> = {
  COUNT_RANGE: `${ROUND_COUNT_MIN}회 이상 ${ROUND_COUNT_MAX}회 이하로 입력해 주세요.`,
  BRIEFING: "설명회는 여러 번 진행할 수 없습니다.",
  END_BEFORE_START: "종료 시각은 시작 시각보다 뒤여야 합니다.",
  TOO_LONG: `한 회차는 ${ROUND_MAX_HOURS}시간을 넘을 수 없습니다.`,
  OVERLAP: "앞 회차와 시간이 겹칩니다.",
  COUNT_MISMATCH: "입력한 일정이 예정 회차 수와 다릅니다.",
  TOO_MANY_DATED: "조율형은 1회차 일정만 정할 수 있습니다.",
};

const HOUR_MS = 3_600_000;

// 여러 번 진행하는 구인을 만들 때 서버가 다시 거르는 값. 지정형은 모든 회차의 일시가 예정 회차 수와 같은 행 수로 와야 하고,
// 조율형은 1회차 일시가 있으면 하나, 범위 조율이면 없다. 모집 마감과 1회차 시작의 선후는 등록 폼 검증이 이미 본다.
export function roundScheduleError({
  roundCount,
  scheduleKind,
  isBriefing,
  rounds,
}: {
  roundCount: number;
  scheduleKind: "designated" | "coordinated";
  isBriefing: boolean;
  rounds: readonly RoundSpan[];
}): { code: RoundScheduleErrorCode; message: string } | null {
  const fail = (code: RoundScheduleErrorCode) => ({
    code,
    message: ROUND_SCHEDULE_ERROR_MESSAGE[code],
  });
  if (
    !Number.isInteger(roundCount) ||
    roundCount < ROUND_COUNT_MIN ||
    roundCount > ROUND_COUNT_MAX
  ) {
    return fail(ROUND_SCHEDULE_ERROR.countRange);
  }
  if (isBriefing) return fail(ROUND_SCHEDULE_ERROR.briefing);
  if (scheduleKind === "coordinated" && rounds.length > 1) {
    return fail(ROUND_SCHEDULE_ERROR.tooManyDated);
  }
  if (scheduleKind === "designated" && rounds.length !== roundCount) {
    return fail(ROUND_SCHEDULE_ERROR.countMismatch);
  }
  for (const round of rounds) {
    const length = round.endsAt.getTime() - round.startsAt.getTime();
    if (length <= 0) return fail(ROUND_SCHEDULE_ERROR.endBeforeStart);
    if (length > ROUND_MAX_HOURS * HOUR_MS) return fail(ROUND_SCHEDULE_ERROR.tooLong);
  }
  const ordered = rounds.toSorted((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  for (let index = 1; index < ordered.length; index += 1) {
    if (rangesOverlap(ordered[index - 1]!, ordered[index]!)) {
      return fail(ROUND_SCHEDULE_ERROR.overlap);
    }
  }
  return null;
}
