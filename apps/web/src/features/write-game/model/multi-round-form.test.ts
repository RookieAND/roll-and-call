import { describe, expect, it } from "vitest";

import {
  GAME_KIND,
  PLAY_TYPE,
  RECRUIT_METHOD,
  ROUND_MODE,
  ROUND_REPEAT,
  ROUND_SCHEDULE_KIND,
  SCHEDULE_MODE,
} from "@/entities/game";

import { gameFormSchema } from "./game-form";
import { toGameColumns } from "./to-game-columns";

const base = {
  title: "마지막 열차",
  kind: GAME_KIND.session,
  playType: PLAY_TYPE.voice,
  rule: "CoC 7판",
  rulebookId: "",
  supplements: [],
  maxPlayers: "4",
  minPlayers: "",
  recruitMethod: RECRUIT_METHOD.firstCome,
  scheduleMode: SCHEDULE_MODE.fixed,
  genres: [] as string[],
  triggers: [] as string[],
  platforms: [] as string[],
  endDate: "2026-09-10T20:00",
  images: [] as string[],
  thumbnailSpoiler: false,
  aiImage: false,
  adultOnly: false,
  waitlistEnabled: true,
  applicationNoteEnabled: false,
  applicationQuestion: "",
  minRulePlays: null,
  requireRulebookCert: false,
  preConfirmed: [],
  playMinutesMin: 180,
  playMinutes: null,
};

const later = (startAt: string, endAt: string) => ({ startAt, endAt, edited: false });

const multi = {
  ...base,
  roundMode: ROUND_MODE.multi,
  roundCount: 3,
  roundScheduleKind: ROUND_SCHEDULE_KIND.designated,
  roundRepeat: ROUND_REPEAT.weekly,
  confirmedAt: "2026-09-12T20:00",
  firstRoundEndAt: "2026-09-12T23:00",
  laterRounds: [
    later("2026-09-19T20:00", "2026-09-19T23:00"),
    later("2026-09-26T20:00", "2026-09-26T23:00"),
  ],
};

function issuePaths(values: object) {
  const result = gameFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("gameFormSchema 여러 번 진행", () => {
  it("올바른 지정형 입력과 roundMode 없는 단발은 통과한다", () => {
    expect(issuePaths(multi)).toEqual([]);
    expect(issuePaths({ ...base, confirmedAt: "2026-09-12T20:00" })).toEqual([]);
  });

  it("설명회는 거른다", () => {
    expect(issuePaths({ ...multi, kind: GAME_KIND.briefing })).toContain("roundMode");
  });

  it("예정 회차 수 범위 밖은 거른다", () => {
    expect(issuePaths({ ...multi, roundCount: 1 })).toContain("roundCount");
    expect(issuePaths({ ...multi, roundCount: 53 })).toContain("roundCount");
  });

  it("지정형은 2회차부터의 행 수가 예정 회차 수 - 1이어야 한다", () => {
    expect(issuePaths({ ...multi, roundCount: 4 })).toContain("laterRounds");
  });

  it("종료가 시작보다 앞서면 그 회차의 종료 칸에 오류를 낸다", () => {
    expect(issuePaths({ ...multi, firstRoundEndAt: "2026-09-12T19:00" })).toContain(
      "firstRoundEndAt",
    );
    const laterRounds = [multi.laterRounds[0]!, later("2026-09-26T20:00", "2026-09-26T19:00")];
    expect(issuePaths({ ...multi, laterRounds })).toContain("laterRounds.1.endAt");
  });

  it("24시간을 넘는 회차는 거른다", () => {
    expect(issuePaths({ ...multi, firstRoundEndAt: "2026-09-13T21:00" })).toContain(
      "firstRoundEndAt",
    );
  });

  it("앞 회차와 겹치면 뒤 회차의 시작 칸에 오류를 낸다", () => {
    const laterRounds = [later("2026-09-12T22:00", "2026-09-13T01:00"), multi.laterRounds[1]!];
    expect(issuePaths({ ...multi, laterRounds })).toContain("laterRounds.0.startAt");
  });

  it("조율형은 뒤 회차 일정을 받지 않는다", () => {
    const coordinated = { ...multi, roundScheduleKind: ROUND_SCHEDULE_KIND.coordinated };
    expect(issuePaths(coordinated)).toContain("laterRounds");
    expect(issuePaths({ ...coordinated, laterRounds: [] })).toEqual([]);
  });
});

describe("toGameColumns 회차 구성", () => {
  it("단발은 1회·지정형·반복 없음이다", () => {
    expect(toGameColumns({ ...base, confirmedAt: "2026-09-12T20:00" } as never)).toMatchObject({
      roundCount: 1,
      roundScheduleKind: ROUND_SCHEDULE_KIND.designated,
      repeatRule: null,
    });
  });

  it("매주 반복 지정형은 1회차의 요일·시각으로 반복 규칙을 만든다", () => {
    const columns = toGameColumns(multi as never);
    expect(columns.roundCount).toBe(3);
    expect(columns.repeatRule).toEqual({
      weekday: 6,
      startTime: "20:00",
      endTime: "23:00",
      intervalWeeks: 1,
    });
  });

  it("격주는 2주 간격, 직접 입력과 조율형은 반복 규칙이 없다", () => {
    expect(
      toGameColumns({ ...multi, roundRepeat: ROUND_REPEAT.biweekly } as never).repeatRule,
    ).toMatchObject({ intervalWeeks: 2 });
    expect(
      toGameColumns({ ...multi, roundRepeat: ROUND_REPEAT.custom } as never).repeatRule,
    ).toBeNull();
    expect(
      toGameColumns({
        ...multi,
        roundScheduleKind: ROUND_SCHEDULE_KIND.coordinated,
      } as never),
    ).toMatchObject({ roundScheduleKind: ROUND_SCHEDULE_KIND.coordinated, repeatRule: null });
  });
});
