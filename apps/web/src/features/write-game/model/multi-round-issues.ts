import {
  ROUND_COUNT_MAX,
  ROUND_COUNT_MIN,
  ROUND_MAX_HOURS,
  ROUND_SCHEDULE_ERROR,
  ROUND_SCHEDULE_ERROR_MESSAGE,
  roundScheduleError,
} from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { GAME_KIND, ROUND_MODE, ROUND_SCHEDULE_KIND, SCHEDULE_MODE } from "@/entities/game";

import { INVALID_INPUT_MESSAGE, type GameFormValues } from "./game-form";
import { multiRoundSpans } from "./multi-round-spans";

type Issue = { path: (string | number)[]; message: string };

const HOUR_MS = 3_600_000;
const END_REQUIRED_MESSAGE = "종료 시각을 입력해야 합니다.";
const START_REQUIRED_MESSAGE = "세션 일시를 입력해야 합니다.";

const endPath = (index: number) =>
  index === 0 ? ["firstRoundEndAt"] : ["laterRounds", index - 1, "endAt"];
const startPath = (index: number) =>
  index === 0 ? ["confirmedAt"] : ["laterRounds", index - 1, "startAt"];

// 여러 번 진행하는 구인의 일정 검증. 단발(roundMode가 multi가 아님)이면 보지 않는다.
export function multiRoundIssues(values: GameFormValues): Issue[] {
  if (values.roundMode !== ROUND_MODE.multi) return [];
  const {
    roundCount,
    laterRounds = [],
    roundScheduleKind = ROUND_SCHEDULE_KIND.designated,
  } = values;
  const isDesignated = roundScheduleKind === ROUND_SCHEDULE_KIND.designated;
  const isFixed = values.scheduleMode === SCHEDULE_MODE.fixed;
  const issues: Issue[] = [];
  const add = (path: Issue["path"], message: string) => issues.push({ path, message });

  if (values.kind === GAME_KIND.briefing) {
    add(["roundMode"], ROUND_SCHEDULE_ERROR_MESSAGE.BRIEFING);
  }
  const isCountValid =
    !isNil(roundCount) &&
    Number.isInteger(roundCount) &&
    roundCount >= ROUND_COUNT_MIN &&
    roundCount <= ROUND_COUNT_MAX;
  if (!isCountValid) add(["roundCount"], ROUND_SCHEDULE_ERROR_MESSAGE.COUNT_RANGE);

  if (isDesignated && !isFixed) {
    add(["scheduleMode"], INVALID_INPUT_MESSAGE);
  }
  // 세션 일시(1회차 시작)가 비었을 때의 안내는 등록 폼의 공통 검사가 이미 낸다.
  if ((isDesignated || isFixed) && !values.firstRoundEndAt) {
    add(["firstRoundEndAt"], END_REQUIRED_MESSAGE);
  }
  if (isDesignated) {
    if (isCountValid && laterRounds.length !== roundCount - 1) {
      add(["laterRounds"], ROUND_SCHEDULE_ERROR_MESSAGE.COUNT_MISMATCH);
    }
    laterRounds.forEach((round, index) => {
      if (!round.startAt) add(["laterRounds", index, "startAt"], START_REQUIRED_MESSAGE);
      if (!round.endAt) add(["laterRounds", index, "endAt"], END_REQUIRED_MESSAGE);
    });
  } else if (laterRounds.length > 0) {
    add(["laterRounds"], ROUND_SCHEDULE_ERROR_MESSAGE.TOO_MANY_DATED);
  }
  const lacksFirstStart = (isDesignated || isFixed) && !values.confirmedAt;
  if (issues.length > 0 || !isCountValid || lacksFirstStart) {
    return issues;
  }

  const spans = multiRoundSpans(values);
  const error = roundScheduleError({
    roundCount,
    scheduleKind: roundScheduleKind,
    isBriefing: false,
    rounds: spans,
  });
  if (!error) return issues;

  if (error.code === ROUND_SCHEDULE_ERROR.endBeforeStart) {
    const index = spans.findIndex((span) => span.endsAt <= span.startsAt);
    add(endPath(index), error.message);
  } else if (error.code === ROUND_SCHEDULE_ERROR.tooLong) {
    const index = spans.findIndex(
      (span) => span.endsAt.getTime() - span.startsAt.getTime() > ROUND_MAX_HOURS * HOUR_MS,
    );
    add(endPath(index), error.message);
  } else if (error.code === ROUND_SCHEDULE_ERROR.overlap) {
    const ordered = spans
      .map((span, index) => ({ ...span, index }))
      .toSorted((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    const later = ordered.find(
      (span, order) => order > 0 && ordered[order - 1]!.endsAt > span.startsAt,
    );
    add(startPath(later?.index ?? 0), error.message);
  } else {
    add(["roundMode"], error.message);
  }
  return issues;
}
