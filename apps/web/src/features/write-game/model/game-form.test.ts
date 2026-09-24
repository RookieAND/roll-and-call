import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";

import { gameFormSchema } from "./game-form";
import { toGameColumns } from "./to-game-columns";

const base = {
  title: "마지막 열차",
  rule: "CoC 7판",
  rulebookId: "",
  maxPlayers: "4",
  recruitMethod: RECRUIT_METHOD.firstCome,
  scheduleMode: SCHEDULE_MODE.coordinate,
  genres: ["호러"],
  triggers: [] as string[],
  platforms: [] as string[],
  endDate: "2026-09-10T20:00",
  rangeStart: "2026-09-12",
  rangeEnd: "2026-09-20",
  images: [] as string[],
  thumbnailSpoiler: false,
  aiImage: false,
  waitlistEnabled: true,
  preConfirmed: [],
  playTime: "3시간",
};

const imageUrl = (index: number) =>
  `https://example.supabase.co/storage/v1/object/public/game-thumbnails/${index}.png`;

function firstError(values: object) {
  const result = gameFormSchema.safeParse(values);
  return result.success ? null : (result.error.issues[0]?.path.join(".") ?? "?");
}

describe("gameFormSchema", () => {
  it("채워야 할 것을 다 채우면 통과한다", () => {
    expect(firstError(base)).toBeNull();
  });

  it("정원은 20명을 넘길 수 없다", () => {
    expect(firstError({ ...base, maxPlayers: "21" })).toBe("maxPlayers");
  });

  it("정원을 직접 확정한 사람 수보다 줄일 수 없다", () => {
    const player = { userId: crypto.randomUUID(), username: "하늘", avatarUrl: null, bio: null };
    const twoPlayers = [player, { ...player, userId: crypto.randomUUID() }];
    expect(firstError({ ...base, maxPlayers: "1", preConfirmed: twoPlayers })).toBe("maxPlayers");
    expect(firstError({ ...base, maxPlayers: "2", preConfirmed: twoPlayers })).toBeNull();
  });

  it("조율 기간은 하루 이상 2주 이하다", () => {
    expect(firstError({ ...base, rangeEnd: "2026-09-12" })).toBe("rangeEnd");
    expect(firstError({ ...base, rangeEnd: "2026-09-30" })).toBe("rangeEnd");
  });

  it("모집 마감이 조율 종료보다 뒤일 수 없다", () => {
    expect(firstError({ ...base, endDate: "2026-09-25T20:00" })).toBe("endDate");
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
  });

  it("AI 이미지 사용 여부는 고르지 않고 넘어갈 수 없다", () => {
    expect(firstError({ ...base, aiImage: undefined })).toBe("aiImage");
  });

  it("플레이타임을 0시간 0분으로 둘 수 없다", () => {
    expect(firstError({ ...base, playTime: "" })).toBe("playTime");
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

  it("플레이타임 문자열에서 분을 뽑아 같이 저장한다", () => {
    expect(toGameColumns({ ...base, playTime: "3시간 30분" }).playMinutes).toBe(210);
  });
});
