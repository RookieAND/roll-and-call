import { describe, expect, it } from "vitest";

import { GAME_KIND, PLAY_TYPE, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { GAME_CANCELLED_MESSAGE } from "@/shared/api";

import { editBlockReason } from "./edit-block-reason";
import type { GameFormValues } from "./game-form";
import { toGameColumns } from "./to-game-columns";

const now = new Date("2026-09-10T10:00:00Z");
const gmId = "gm";
const session = new Date("2026-09-12T10:00:00Z");
const endDate = new Date("2026-09-11T11:00:00Z");

type LockedGame = NonNullable<Parameters<typeof editBlockReason>[0]["game"]>;

const game: LockedGame = {
  gmId,
  kind: GAME_KIND.session,
  cancelledAt: null,
  confirmedAt: session,
  scheduleMode: SCHEDULE_MODE.fixed,
  recruitMethod: RECRUIT_METHOD.firstCome,
  applicationNoteEnabled: false,
  windowStartHour: 12,
  windowEndHour: 0,
  drawnAt: null,
  endDate,
  minPlayers: null,
};

const form: GameFormValues = {
  title: "마지막 열차",
  kind: GAME_KIND.session,
  playType: PLAY_TYPE.voice,
  rule: "CoC 7판",
  rulebookId: "",
  maxPlayers: "4",
  minPlayers: "",
  recruitMethod: RECRUIT_METHOD.firstCome,
  scheduleMode: SCHEDULE_MODE.fixed,
  genres: [],
  triggers: [],
  platforms: [],
  endDate: "2026-09-11T20:00",
  confirmedAt: "2026-09-12T19:00",
  images: [],
  thumbnailSpoiler: false,
  aiImage: false,
  waitlistEnabled: true,
  applicationNoteEnabled: false,
  preConfirmed: [],
  playMinutes: 180,
};

function reason({
  overrides = {},
  values = {},
  rosterCount = 0,
  confirmedCount = 0,
  at = now,
}: {
  overrides?: Partial<LockedGame>;
  values?: Partial<GameFormValues>;
  rosterCount?: number;
  confirmedCount?: number;
  at?: Date;
}) {
  return editBlockReason(
    {
      game: { ...game, ...overrides },
      userId: gmId,
      columns: toGameColumns({ ...form, ...values }),
      rosterCount,
      confirmedCount,
    },
    at,
  );
}

describe("editBlockReason", () => {
  it("바꿀 것이 없으면 막지 않는다", () => {
    expect(reason({})).toBeNull();
  });

  it("GM이 아니거나 글이 없으면 권한이 없다", () => {
    expect(reason({ overrides: { gmId: "other" } })?.error).toBe("수정 권한이 없습니다.");
    expect(
      editBlockReason({
        game: undefined,
        userId: gmId,
        columns: toGameColumns(form),
        rosterCount: 0,
        confirmedCount: 0,
      })?.error,
    ).toBe("수정 권한이 없습니다.");
  });

  it("취소된 구인은 고칠 수 없다", () => {
    expect(reason({ overrides: { cancelledAt: now } })?.error).toBe(GAME_CANCELLED_MESSAGE);
  });

  it("시작 1분 전에는 고치고 시작 시각부터는 막는다", () => {
    const minuteBefore = new Date(session.getTime() - 60_000);
    expect(reason({ at: minuteBefore })).toBeNull();
    expect(reason({ at: session })?.error).toBe("시작한 세션은 고칠 수 없습니다.");
  });

  it("확정 인원보다 정원을 줄일 수 없다", () => {
    expect(reason({ values: { maxPlayers: "2" }, rosterCount: 3, confirmedCount: 3 })).toEqual({
      error: "확정 참여자가 3명이라 정원을 3명보다 줄일 수 없습니다.",
      field: "maxPlayers",
    });
  });

  it("신청자가 있으면 최소 인원을 올릴 수 없고 낮추거나 비우는 것은 된다", () => {
    const saved = { overrides: { minPlayers: 3 }, rosterCount: 1 };
    expect(reason({ ...saved, values: { minPlayers: "4" } })).toEqual({
      error: "신청자가 있어 올릴 수 없습니다.",
      field: "minPlayers",
    });
    expect(reason({ ...saved, values: { minPlayers: "3" } })).toBeNull();
    expect(reason({ ...saved, values: { minPlayers: "2" } })).toBeNull();
    expect(reason({ ...saved, values: { minPlayers: "" } })).toBeNull();
    expect(reason({ rosterCount: 1, values: { minPlayers: "2" } })?.field).toBe("minPlayers");
  });

  it("신청자가 없으면 최소 인원을 자유롭게 올린다", () => {
    expect(reason({ overrides: { minPlayers: 2 }, values: { minPlayers: "4" } })).toBeNull();
  });

  it("신청자가 있으면 일정 방식·모집 방식을 바꿀 수 없다", () => {
    expect(
      reason({
        values: { scheduleMode: SCHEDULE_MODE.coordinate, rangeStart: "2026-09-12" },
        rosterCount: 1,
      })?.field,
    ).toBe("scheduleMode");
    expect(
      reason({ values: { recruitMethod: RECRUIT_METHOD.lottery }, rosterCount: 1 })?.field,
    ).toBe("recruitMethod");
  });

  it("신청자가 있으면 구분을 바꿀 수 없고 없으면 바꾼다", () => {
    const briefing = { kind: GAME_KIND.briefing };
    expect(reason({ values: briefing, rosterCount: 1 })?.field).toBe("kind");
    expect(reason({ values: briefing })).toBeNull();
  });

  it("신청자가 있으면 신청글 받기를 켜고 끄는 것 모두 막고 없으면 바꾼다", () => {
    const turnOn = { values: { applicationNoteEnabled: true } };
    expect(reason({ ...turnOn, rosterCount: 1 })?.field).toBe("applicationNoteEnabled");
    expect(
      reason({
        overrides: { applicationNoteEnabled: true },
        values: { applicationNoteEnabled: false },
        rosterCount: 1,
      })?.field,
    ).toBe("applicationNoteEnabled");
    expect(reason(turnOn)).toBeNull();
  });

  it("신청자가 있어도 플레이 유형은 바꿀 수 있다", () => {
    expect(reason({ values: { playType: PLAY_TYPE.text }, rosterCount: 1 })).toBeNull();
  });

  it("신청자가 있으면 조율 시간대를 바꿀 수 없다", () => {
    const coordinate = {
      overrides: { scheduleMode: SCHEDULE_MODE.coordinate, confirmedAt: null },
      values: {
        scheduleMode: SCHEDULE_MODE.coordinate,
        rangeStart: "2026-09-12",
        rangeEnd: "2026-09-14",
        windowStartHour: "22",
        windowEndHour: "2",
      },
    };
    expect(reason({ ...coordinate, rosterCount: 1 })).toEqual({
      error:
        "신청자가 있어 조율 시간대는 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.",
      field: "windowStartHour",
    });
    expect(reason(coordinate)).toBeNull();
  });

  it("추첨 뒤에는 마감을 그대로 두면 받고 바꾸면 막는다", () => {
    const drawn = { overrides: { drawnAt: now, endDate: new Date("2026-09-09T11:00:00Z") } };
    expect(reason({ ...drawn, values: { endDate: "2026-09-09T20:00" } })).toBeNull();
    expect(reason({ ...drawn, values: { endDate: "2026-09-11T20:00" } })?.error).toBe(
      "추첨을 마친 구인은 모집 마감을 바꿀 수 없습니다.",
    );
  });

  it("바꾼 마감·세션 일시가 지났으면 막고 그대로면 지난 값도 받는다", () => {
    const pastEnd = { overrides: { endDate: new Date("2026-09-09T11:00:00Z") } };
    expect(reason({ ...pastEnd, values: { endDate: "2026-09-09T20:00" } })).toBeNull();
    expect(reason({ values: { endDate: "2026-09-09T21:00" } })).toEqual({
      error: "모집 마감은 지금 이후로 정해 주세요.",
      field: "endDate",
    });
    expect(
      reason({ values: { endDate: "2026-09-09T20:00", confirmedAt: "2026-09-09T21:00" } })?.field,
    ).toBe("endDate");
    expect(
      reason({
        ...pastEnd,
        values: { endDate: "2026-09-09T20:00", confirmedAt: "2026-09-10T18:00" },
      }),
    ).toEqual({ error: "세션 일시는 지금 이후로 정해 주세요.", field: "confirmedAt" });
  });
});
