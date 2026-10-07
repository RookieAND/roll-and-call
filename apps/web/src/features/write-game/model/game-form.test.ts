import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";

import { gameFormSchema } from "./game-form";
import { toGameColumns } from "./to-game-columns";

const base = {
  title: "마지막 열차",
  rule: "CoC 7판",
  rulebookId: "",
  maxPlayers: "4",
  minPlayers: "",
  recruitMethod: RECRUIT_METHOD.firstCome,
  scheduleMode: SCHEDULE_MODE.coordinate,
  genres: ["호러"],
  triggers: [] as string[],
  platforms: [] as string[],
  endDate: "2026-09-10T20:00",
  images: [] as string[],
  thumbnailSpoiler: false,
  aiImage: false,
  waitlistEnabled: true,
  preConfirmed: [],
  playMinutes: 180,
};

const imageUrl = (index: number) =>
  `https://example.supabase.co/storage/v1/object/public/game-thumbnails/${index}.png`;

function firstError(values: object) {
  const result = gameFormSchema.safeParse(values);
  return result.success ? null : (result.error.issues[0]?.path.join(".") ?? "?");
}

describe("gameFormSchema 최소 인원", () => {
  function minPlayersError(minPlayers: string, maxPlayers = "6") {
    const result = gameFormSchema.safeParse({ ...base, minPlayers, maxPlayers });
    if (result.success) return null;
    return result.error.issues.find((issue) => issue.path[0] === "minPlayers")?.message ?? null;
  }

  it.each(["", "1", "6"])("%j은 받는다", (value) => {
    expect(minPlayersError(value)).toBeNull();
  });

  it("0이나 정수가 아닌 값은 범위 오류다", () => {
    expect(minPlayersError("0")).toBe("1~6 사이로 적어 주세요.");
    expect(minPlayersError("2.5")).toBe("1~6 사이로 적어 주세요.");
  });

  it("정원보다 크면 오류다", () => {
    expect(minPlayersError("8")).toBe("정원 6명보다 클 수 없습니다.");
  });

  it("비우면 컬럼이 null이고 값이 있으면 숫자다", () => {
    expect(toGameColumns({ ...base, minPlayers: "" } as never).minPlayers).toBeNull();
    expect(toGameColumns({ ...base, minPlayers: "3" } as never).minPlayers).toBe(3);
  });
});

describe("gameFormSchema", () => {
  it("채워야 할 것을 다 채우면 통과한다", () => {
    expect(firstError(base)).toBeNull();
  });

  it("정원은 1~20명이다", () => {
    expect(firstError({ ...base, maxPlayers: "21" })).toBe("maxPlayers");
    expect(firstError({ ...base, maxPlayers: "" })).toBe("maxPlayers");
    expect(firstError({ ...base, maxPlayers: "20" })).toBeNull();
  });

  it("정원을 직접 확정한 사람 수보다 줄일 수 없다", () => {
    const player = { userId: crypto.randomUUID(), username: "하늘", avatarUrl: null, bio: null };
    const twoPlayers = [player, { ...player, userId: crypto.randomUUID() }];
    expect(firstError({ ...base, maxPlayers: "1", preConfirmed: twoPlayers })).toBe("maxPlayers");
    expect(firstError({ ...base, maxPlayers: "2", preConfirmed: twoPlayers })).toBeNull();
  });

  it("이미지는 5장까지, 스토리지 주소만 받는다", () => {
    expect(firstError({ ...base, images: [1, 2, 3, 4, 5].map(imageUrl) })).toBeNull();
    expect(firstError({ ...base, images: [1, 2, 3, 4, 5, 6].map(imageUrl) })).toBe("images");
    expect(firstError({ ...base, images: ["not-a-url"] })).toBe("images.0");
  });

  it("일시 지정형은 세션 시각이 있어야 하고 마감이 그보다 앞서야 한다", () => {
    const fixed = { ...base, scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: "2026-09-12T19:00" };
    expect(firstError(fixed)).toBeNull();
    expect(firstError({ ...fixed, confirmedAt: "" })).toBe("confirmedAt");
    expect(firstError({ ...fixed, endDate: "2026-09-12T20:00" })).toBe("endDate");
    expect(firstError({ ...fixed, endDate: "2026-09-12T19:00" })).toBe("endDate");
    expect(firstError({ ...fixed, endDate: "2026-09-12T18:59" })).toBeNull();
  });

  it("AI 이미지 사용 여부는 고르지 않고 넘어갈 수 없다", () => {
    expect(firstError({ ...base, aiImage: undefined })).toBe("aiImage");
  });

  it("플레이타임을 0시간 0분으로 둘 수 없다", () => {
    expect(firstError({ ...base, playMinutes: 0 })).toBe("playMinutes");
  });

  it("장르는 5개까지다", () => {
    expect(firstError({ ...base, genres: ["1", "2", "3", "4", "5", "6"] })).toBe("genres");
  });
});

describe("toGameColumns", () => {
  it("추첨은 대기 접수 설정을 쓰지 않아 항상 켜진 값으로 저장된다", () => {
    const lottery = { ...base, recruitMethod: RECRUIT_METHOD.lottery, waitlistEnabled: false };
    expect(firstError(lottery)).toBeNull();
    expect(toGameColumns(lottery).waitlistEnabled).toBe(true);
  });

  it("선착순은 대기 접수 설정을 그대로 쓴다", () => {
    expect(toGameColumns({ ...base, waitlistEnabled: false }).waitlistEnabled).toBe(false);
  });

  it("썸네일이 없으면 가릴 것도 없다", () => {
    const spoiler = { ...base, thumbnailSpoiler: true };
    expect(toGameColumns({ ...spoiler, thumbnailUrl: imageUrl(1) }).thumbnailSpoiler).toBe(true);
    expect(toGameColumns({ ...spoiler, thumbnailUrl: "" }).thumbnailSpoiler).toBe(false);
  });

  it("조율형은 세션 시각 칼럼을 넣지 않아 GM이 정한 시각을 지우지 않는다", () => {
    expect("confirmedAt" in toGameColumns({ ...base, confirmedAt: "2026-09-12T19:00" })).toBe(
      false,
    );
  });

  it("플레이타임은 분 값 하나만 저장한다", () => {
    expect(toGameColumns({ ...base, playMinutes: 210 }).playMinutes).toBe(210);
  });
});
