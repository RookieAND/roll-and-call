import {
  GAME_KIND,
  ROUND_MODE,
  ROUND_REPEAT,
  ROUND_SCHEDULE_KIND,
  roundClockLabel,
  roundTimeRange,
  SCHEDULE_MODE,
} from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import { formatDateWeekday, fromKstDateTimeInput, toKst } from "@/shared/lib";

type SummaryValues = Pick<
  GameFormValues,
  | "kind"
  | "roundMode"
  | "roundCount"
  | "roundScheduleKind"
  | "roundRepeat"
  | "scheduleMode"
  | "confirmedAt"
  | "firstRoundEndAt"
>;

const REPEAT_WORD = {
  [ROUND_REPEAT.weekly]: "매주",
  [ROUND_REPEAT.biweekly]: "격주",
} as const;

function parse(value: string | undefined) {
  if (!value) return null;
  const date = fromKstDateTimeInput(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// 「매주 토요일 오후 12:00~4:00로 만들어집니다.」 매주·격주가 아니거나 1회차가 비었으면 null이다.
export function repeatResultLine(values: SummaryValues) {
  const span = repeatSpan(values);
  if (!span) return null;
  const weekday = toKst(span.startsAt).format("dd");
  return `${span.word} ${weekday}요일 ${roundTimeRange(span)}로 만들어집니다.`;
}

function repeatSpan({ roundRepeat, confirmedAt, firstRoundEndAt }: SummaryValues) {
  const startsAt = parse(confirmedAt);
  const endsAt = parse(firstRoundEndAt);
  if (!roundRepeat || roundRepeat === ROUND_REPEAT.custom || !startsAt || !endsAt) return null;
  return { word: REPEAT_WORD[roundRepeat], startsAt, endsAt };
}

// 위저드 요약과 확인 줄의 일정 값. 여러 번 진행이 아니거나 아직 알 수 없으면 null이다.
//   지정형 반복  「매주 토 오후 12:00~4:00 · 총 6회」
//   그 밖의 일시 「10월 24일 (토) 오후 12:00부터 · 총 6회」
//   범위 조율    「일정 조율 · 총 6회」
export function multiRoundSummary(values: SummaryValues) {
  if (values.roundMode !== ROUND_MODE.multi || values.kind === GAME_KIND.briefing) return null;
  const total = `총 ${values.roundCount}회`;
  const isDesignated = values.roundScheduleKind !== ROUND_SCHEDULE_KIND.coordinated;
  const isCoordinatedRange = !isDesignated && values.scheduleMode === SCHEDULE_MODE.coordinate;
  if (isCoordinatedRange) return `일정 조율 · ${total}`;

  const repeat = repeatSpan(values);
  if (isDesignated && repeat) {
    const weekday = toKst(repeat.startsAt).format("dd");
    return `${repeat.word} ${weekday} ${roundTimeRange(repeat)} · ${total}`;
  }
  const startsAt = parse(values.confirmedAt);
  if (!startsAt) return null;
  return `${formatDateWeekday(startsAt)} ${roundClockLabel(startsAt)}부터 · ${total}`;
}
