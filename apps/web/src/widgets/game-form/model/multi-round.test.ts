import { describe, expect, it } from "vitest";

import {
  GAME_KIND,
  ROUND_MODE,
  ROUND_REPEAT,
  ROUND_SCHEDULE_KIND,
  SCHEDULE_MODE,
} from "@/entities/game";

import { nextCustomRound, nextFirstRoundEnd, syncLaterRounds } from "./later-rounds";
import { laterRoundsMismatchMessage } from "./later-rounds-mismatch";
import { multiRoundSummary, repeatResultLine } from "./multi-round-summary";

const values = {
  kind: GAME_KIND.session,
  roundMode: ROUND_MODE.multi,
  roundCount: 6,
  roundScheduleKind: ROUND_SCHEDULE_KIND.designated,
  roundRepeat: ROUND_REPEAT.weekly,
  scheduleMode: SCHEDULE_MODE.fixed,
  confirmedAt: "2026-10-24T12:00",
  firstRoundEndAt: "2026-10-24T16:00",
} as const;

describe("multiRoundSummary", () => {
  it("지정형 반복", () => {
    expect(multiRoundSummary(values)).toBe("매주 토 오후 12:00~4:00 · 총 6회");
    expect(multiRoundSummary({ ...values, roundRepeat: ROUND_REPEAT.biweekly })).toBe(
      "격주 토 오후 12:00~4:00 · 총 6회",
    );
  });

  it("직접 입력과 조율형 일시 지정", () => {
    const text = "10월 24일 (토) 오후 12:00부터 · 총 6회";
    expect(multiRoundSummary({ ...values, roundRepeat: ROUND_REPEAT.custom })).toBe(text);
    expect(
      multiRoundSummary({ ...values, roundScheduleKind: ROUND_SCHEDULE_KIND.coordinated }),
    ).toBe(text);
  });

  it("조율형 범위 조율", () => {
    expect(
      multiRoundSummary({
        ...values,
        roundScheduleKind: ROUND_SCHEDULE_KIND.coordinated,
        scheduleMode: SCHEDULE_MODE.coordinate,
      }),
    ).toBe("일정 조율 · 총 6회");
  });

  it("한 번이나 설명회, 일시가 비면 null", () => {
    expect(multiRoundSummary({ ...values, roundMode: ROUND_MODE.once })).toBeNull();
    expect(multiRoundSummary({ ...values, kind: GAME_KIND.briefing })).toBeNull();
    expect(
      multiRoundSummary({ ...values, roundRepeat: ROUND_REPEAT.custom, confirmedAt: "" }),
    ).toBeNull();
  });

  it("결과 한 줄", () => {
    expect(repeatResultLine(values)).toBe("매주 토요일 오후 12:00~4:00로 만들어집니다.");
    expect(repeatResultLine({ ...values, roundRepeat: ROUND_REPEAT.custom })).toBeNull();
  });

  it("오전에서 오후로 넘어가면 끝에도 오전·오후를 붙인다", () => {
    expect(multiRoundSummary({ ...values, firstRoundEndAt: "2026-10-24T22:00" })).toBe(
      "매주 토 오후 12:00~10:00 · 총 6회",
    );
    expect(
      multiRoundSummary({
        ...values,
        confirmedAt: "2026-10-24T10:00",
        firstRoundEndAt: "2026-10-24T14:00",
      }),
    ).toBe("매주 토 오전 10:00~오후 2:00 · 총 6회");
  });
});

describe("syncLaterRounds", () => {
  const base = {
    firstStart: "2026-10-24T12:00",
    firstEnd: "2026-10-24T16:00",
    repeat: ROUND_REPEAT.weekly,
    roundCount: 3,
    current: [],
  };

  it("2회차부터 매주·격주로 만든다", () => {
    expect(syncLaterRounds(base)).toEqual([
      { startAt: "2026-10-31T12:00", endAt: "2026-10-31T16:00", edited: false },
      { startAt: "2026-11-07T12:00", endAt: "2026-11-07T16:00", edited: false },
    ]);
    expect(syncLaterRounds({ ...base, repeat: ROUND_REPEAT.biweekly })?.[0]?.startAt).toBe(
      "2026-11-07T12:00",
    );
  });

  it("고친 행은 지킨다", () => {
    const edited = { startAt: "2026-11-01T14:00", endAt: "2026-11-01T18:00", edited: true };
    const rounds = syncLaterRounds({ ...base, current: [edited] });
    expect(rounds?.[0]).toEqual(edited);
    expect(rounds?.[1]?.startAt).toBe("2026-11-07T12:00");
  });

  it("직접 입력이거나 입력이 덜 됐으면 건드리지 않는다", () => {
    expect(syncLaterRounds({ ...base, repeat: ROUND_REPEAT.custom })).toBeNull();
    expect(syncLaterRounds({ ...base, firstEnd: "" })).toBeNull();
    expect(syncLaterRounds({ ...base, roundCount: 1 })).toBeNull();
    expect(syncLaterRounds({ ...base, roundCount: Number.NaN })).toBeNull();
  });
});

describe("nextFirstRoundEnd", () => {
  it("비어 있으면 플레이타임으로 채운다", () => {
    expect(
      nextFirstRoundEnd({
        prevStart: undefined,
        prevEnd: "",
        nextStart: "2026-10-24T12:00",
        defaultMinutes: 240,
      }),
    ).toBe("2026-10-24T16:00");
  });

  it("시작을 옮기면 지금의 길이를 지킨다", () => {
    expect(
      nextFirstRoundEnd({
        prevStart: "2026-10-24T12:00",
        prevEnd: "2026-10-24T15:00",
        nextStart: "2026-10-25T20:00",
        defaultMinutes: 240,
      }),
    ).toBe("2026-10-25T23:00");
  });
});

describe("nextCustomRound", () => {
  it("앞 회차의 일주일 뒤, 앞이 비면 빈 행", () => {
    expect(nextCustomRound({ startAt: "2026-10-24T12:00", endAt: "2026-10-24T16:00" })).toEqual({
      startAt: "2026-10-31T12:00",
      endAt: "2026-10-31T16:00",
      edited: false,
    });
    expect(nextCustomRound(undefined)).toEqual({ startAt: "", endAt: "", edited: false });
  });
});

describe("laterRoundsMismatchMessage", () => {
  const custom = { ...values, roundRepeat: ROUND_REPEAT.custom, roundCount: 3 };
  const row = { startAt: "a", endAt: "b", edited: false };

  it("직접 입력의 행 수가 다를 때만 안내한다", () => {
    expect(laterRoundsMismatchMessage({ ...custom, laterRounds: [row] })).toBe(
      "입력한 일정이 예정 회차 수와 다릅니다.",
    );
    expect(laterRoundsMismatchMessage({ ...custom, laterRounds: [row, row] })).toBeUndefined();
    expect(
      laterRoundsMismatchMessage({ ...custom, roundRepeat: ROUND_REPEAT.weekly, laterRounds: [] }),
    ).toBeUndefined();
  });
});
