import { describe, expect, it } from "vitest";

import { isCapacityMatched } from "./is-capacity-matched";
import { isSplitRangeValid } from "./is-split-range-valid";
import { splitTeamsBlock } from "./split-teams-block";
import { splitTeamsColumns } from "./split-teams-columns";
import { splitTeamsDeadline } from "./split-teams-deadline";
import { splitTeamsRecruit } from "./split-teams-recruit";
import { SPLIT_TEAMS_MESSAGE } from "./split-teams-rules";
import { splitTeamsSchedule } from "./split-teams-schedule";

const now = new Date("2026-11-10T03:00:00Z");

describe("isCapacityMatched", () => {
  it("지정 모집은 정원이 고른 수와 같을 때만 연다", () => {
    expect(isCapacityMatched({ capacity: 3, selectedCount: 3, visibility: "private" })).toBe(true);
    expect(isCapacityMatched({ capacity: 4, selectedCount: 3, visibility: "private" })).toBe(false);
  });

  it("일반 모집은 정원이 고른 수 이상이면 연다", () => {
    expect(isCapacityMatched({ capacity: 3, selectedCount: 3, visibility: "public" })).toBe(true);
    expect(isCapacityMatched({ capacity: 5, selectedCount: 3, visibility: "public" })).toBe(true);
    expect(isCapacityMatched({ capacity: 2, selectedCount: 3, visibility: "public" })).toBe(false);
  });

  it("아무도 고르지 않으면 열지 않는다", () => {
    expect(isCapacityMatched({ capacity: 0, selectedCount: 0, visibility: "private" })).toBe(false);
    expect(isCapacityMatched({ capacity: 4, selectedCount: 0, visibility: "public" })).toBe(false);
  });
});

describe("splitTeamsBlock", () => {
  const base = { waitingIds: ["a", "b", "c"], excludedIds: [], visibility: "private" as const };

  it("대기자 가운데 정원만큼 고르면 받는다", () => {
    expect(splitTeamsBlock({ ...base, userIds: ["a", "c"], capacity: 2 })).toBeNull();
  });

  it("지정 모집은 정원과 고른 수가 다르면 거부한다", () => {
    expect(splitTeamsBlock({ ...base, userIds: ["a", "c"], capacity: 3 })).toBe(
      SPLIT_TEAMS_MESSAGE.capacityMismatch,
    );
  });

  it("일반 모집은 남는 자리를 받고 정원이 모자라면 거부한다", () => {
    const open = { ...base, visibility: "public" as const };
    expect(splitTeamsBlock({ ...open, userIds: ["a", "c"], capacity: 4 })).toBeNull();
    expect(splitTeamsBlock({ ...open, userIds: ["a", "c"], capacity: 1 })).toBe(
      SPLIT_TEAMS_MESSAGE.capacityTooSmall,
    );
  });

  it("대기 행이 아닌 사람(확정 참여자 등)은 고를 수 없다", () => {
    expect(splitTeamsBlock({ ...base, userIds: ["a", "z"], capacity: 2 })).toBe(
      SPLIT_TEAMS_MESSAGE.notWaiting,
    );
  });

  it("정지되었거나 서버를 떠난 사람은 고를 수 없다", () => {
    expect(splitTeamsBlock({ ...base, excludedIds: ["b"], userIds: ["a", "b"], capacity: 2 })).toBe(
      SPLIT_TEAMS_MESSAGE.excluded,
    );
  });
});

describe("isSplitRangeValid", () => {
  const today = "2026-11-10";

  it("오늘부터 시작일 포함 14일까지 허용한다", () => {
    expect(isSplitRangeValid({ today, rangeStart: "2026-11-10", rangeEnd: "2026-11-23" })).toBe(
      true,
    );
    expect(isSplitRangeValid({ today, rangeStart: "2026-11-10", rangeEnd: "2026-11-24" })).toBe(
      false,
    );
  });

  it("어제부터 시작하거나 종료일이 앞서면 거부한다", () => {
    expect(isSplitRangeValid({ today, rangeStart: "2026-11-09", rangeEnd: "2026-11-12" })).toBe(
      false,
    );
    expect(isSplitRangeValid({ today, rangeStart: "2026-11-12", rangeEnd: "2026-11-11" })).toBe(
      false,
    );
  });
});

describe("splitTeamsSchedule", () => {
  it("일시 지정은 지금 이후 일시만 받는다", () => {
    expect(
      splitTeamsSchedule({ scheduleMode: "fixed", startsAt: "2026-11-21T11:00:00Z" }, now),
    ).toMatchObject({
      columns: { scheduleMode: "fixed", confirmedAt: new Date("2026-11-21T11:00:00Z") },
    });
    expect(
      splitTeamsSchedule({ scheduleMode: "fixed", startsAt: "2026-11-10T02:00:00Z" }, now),
    ).toEqual({ error: SPLIT_TEAMS_MESSAGE.startsAt });
  });

  it("범위 조율은 기간과 시간대를 그대로 두고 일시는 비운다", () => {
    const input = {
      scheduleMode: "coordinate" as const,
      rangeStart: "2026-11-14",
      rangeEnd: "2026-11-20",
      windowStartHour: 20,
      windowEndHour: 2,
    };
    expect(splitTeamsSchedule(input, now)).toEqual({
      columns: { ...input, confirmedAt: null },
    });
    expect(splitTeamsSchedule({ ...input, windowEndHour: 20 }, now)).toEqual({
      error: SPLIT_TEAMS_MESSAGE.window,
    });
  });
});

describe("splitTeamsDeadline", () => {
  const coordinate = {
    scheduleMode: "coordinate" as const,
    rangeStart: "2026-11-14",
    rangeEnd: "2026-11-20",
    windowStartHour: 20,
    windowEndHour: 23,
    confirmedAt: null,
  };

  it("지정 모집은 마감을 받지 않는다", () => {
    expect(
      splitTeamsDeadline({ visibility: "private", endsAt: undefined, schedule: coordinate, now }),
    ).toEqual({ endDate: null });
  });

  it("일반 모집은 지금 이후이고 세션 시작보다 늦지 않아야 한다", () => {
    expect(
      splitTeamsDeadline({
        visibility: "public",
        endsAt: "2026-11-12T10:00:00Z",
        schedule: coordinate,
        now,
      }),
    ).toEqual({ endDate: new Date("2026-11-12T10:00:00Z") });
    expect(
      splitTeamsDeadline({ visibility: "public", endsAt: undefined, schedule: coordinate, now }),
    ).toEqual({ error: SPLIT_TEAMS_MESSAGE.deadline });
    expect(
      splitTeamsDeadline({
        visibility: "public",
        endsAt: "2026-11-10T02:00:00Z",
        schedule: coordinate,
        now,
      }),
    ).toEqual({ error: SPLIT_TEAMS_MESSAGE.deadline });
    expect(
      splitTeamsDeadline({
        visibility: "public",
        endsAt: "2026-11-15T10:00:00Z",
        schedule: coordinate,
        now,
      }),
    ).toEqual({ error: SPLIT_TEAMS_MESSAGE.deadlineLate });
  });
});

const PRIVATE_RECRUIT = {
  recruitMethod: "first_come" as const,
  minPlayers: null,
  applicationNoteEnabled: false,
  applicationQuestion: null,
  waitlistEnabled: false,
};

describe("splitTeamsRecruit", () => {
  const open = {
    minPlayers: 2,
    recruitMethod: "first_come" as const,
    waitlistEnabled: false,
    applicationNoteEnabled: false,
    applicationQuestion: "",
  };

  it("지정 모집은 입력과 상관없이 선착순·최소 인원 없음으로 덮는다", () => {
    expect(splitTeamsRecruit({ visibility: "private", recruit: open, maxPlayers: 4 })).toEqual({
      columns: PRIVATE_RECRUIT,
    });
  });

  it("일반 모집은 고른 값을 쓰고 선착순만 대기 접수 선택을 따른다", () => {
    expect(splitTeamsRecruit({ visibility: "public", recruit: open, maxPlayers: 4 })).toEqual({
      columns: {
        recruitMethod: "first_come",
        minPlayers: 2,
        applicationNoteEnabled: false,
        applicationQuestion: null,
        waitlistEnabled: false,
      },
    });
    expect(
      splitTeamsRecruit({
        visibility: "public",
        recruit: { ...open, recruitMethod: "lottery" },
        maxPlayers: 4,
      }),
    ).toMatchObject({ columns: { recruitMethod: "lottery", waitlistEnabled: true } });
  });

  it("선발은 신청글을 반드시 받는다", () => {
    expect(
      splitTeamsRecruit({
        visibility: "public",
        recruit: { ...open, recruitMethod: "selection" },
        maxPlayers: 4,
      }),
    ).toMatchObject({ columns: { applicationNoteEnabled: true } });
  });

  it("일반 모집에 값이 없거나 최소 인원이 정원보다 크면 거부한다", () => {
    expect(splitTeamsRecruit({ visibility: "public", recruit: undefined, maxPlayers: 4 })).toEqual({
      error: SPLIT_TEAMS_MESSAGE.recruit,
    });
    expect(
      splitTeamsRecruit({
        visibility: "public",
        recruit: { ...open, minPlayers: 5 },
        maxPlayers: 4,
      }),
    ).toEqual({ error: SPLIT_TEAMS_MESSAGE.minPlayers });
  });
});

describe("splitTeamsColumns", () => {
  const game = {
    id: "g",
    serverId: "s",
    createdAt: now,
    title: "물벼락",
    visibility: "public",
    recruitMethod: "lottery",
    minPlayers: 3,
    applicationNoteEnabled: true,
    applicationQuestion: "왜 오시나요",
    waitlistEnabled: true,
    maxPlayers: 4,
    endDate: now,
    drawnAt: now,
    discordThreadId: "t",
    startNotifiedAt: now,
  };

  const schedule = {
    scheduleMode: "coordinate" as const,
    rangeStart: "2026-11-14",
    rangeEnd: "2026-11-20",
    windowStartHour: 20,
    windowEndHour: 23,
    confirmedAt: null,
  };

  it("일반 모집은 모집 마감과 고른 모집 방식을 그대로 쓴다", () => {
    const columns = splitTeamsColumns({
      game: game as never,
      maxPlayers: 5,
      visibility: "public",
      endDate: new Date("2026-11-12T10:00:00Z"),
      recruit: { ...PRIVATE_RECRUIT, recruitMethod: "lottery" },
      schedule,
    });
    expect(columns).toMatchObject({
      visibility: "public",
      recruitMethod: "lottery",
      maxPlayers: 5,
      endDate: new Date("2026-11-12T10:00:00Z"),
      drawnAt: null,
      discordThreadId: null,
    });
  });

  it("지정 모집으로 덮고 정원·일정만 바꾼다", () => {
    const columns = splitTeamsColumns({
      game: game as never,
      maxPlayers: 3,
      visibility: "private",
      endDate: null,
      recruit: PRIVATE_RECRUIT,
      schedule: {
        scheduleMode: "coordinate",
        rangeStart: "2026-11-14",
        rangeEnd: "2026-11-20",
        windowStartHour: 20,
        windowEndHour: 23,
        confirmedAt: null,
      },
    });
    expect(columns).toMatchObject({
      title: "물벼락",
      visibility: "private",
      recruitMethod: "first_come",
      minPlayers: null,
      applicationNoteEnabled: false,
      applicationQuestion: null,
      waitlistEnabled: false,
      maxPlayers: 3,
      drawnAt: null,
      discordThreadId: null,
      startNotifiedAt: null,
      endDate: new Date("2026-11-13T15:00:00Z"),
    });
    expect(columns).not.toHaveProperty("id");
  });
});
