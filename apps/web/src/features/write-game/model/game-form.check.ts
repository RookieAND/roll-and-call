import assert from "node:assert";

import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";

import { gameFormSchema } from "./game-form";
import { toGameColumns } from "./to-game-columns";

const base = {
  title: "마지막 열차",
  rule: "CoC 7판",
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
};

function firstError(values: object) {
  const result = gameFormSchema.safeParse(values);
  return result.success ? null : (result.error.issues[0]?.path.join(".") ?? "?");
}

assert.equal(firstError(base), null);
assert.equal(firstError({ ...base, maxPlayers: "21" }), "maxPlayers");
assert.equal(firstError({ ...base, rangeEnd: "2026-09-12" }), "rangeEnd");
assert.equal(firstError({ ...base, rangeEnd: "2026-09-30" }), "rangeEnd"); // 2주 초과
assert.equal(firstError({ ...base, endDate: "2026-09-25T20:00" }), "endDate"); // 마감 > 조율 종료

const imageUrl = (index: number) =>
  `https://example.supabase.co/storage/v1/object/public/game-thumbnails/${index}.png`;
assert.equal(firstError({ ...base, images: [1, 2, 3, 4, 5].map(imageUrl) }), null);
assert.equal(firstError({ ...base, images: [1, 2, 3, 4, 5, 6].map(imageUrl) }), "images");
assert.equal(firstError({ ...base, images: ["not-a-url"] }), "images.0");

const fixed = { ...base, scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: "2026-09-12T19:00" };
assert.equal(firstError(fixed), null);
assert.equal(firstError({ ...fixed, confirmedAt: "" }), "confirmedAt");
assert.equal(firstError({ ...fixed, endDate: "2026-09-12T20:00" }), "endDate"); // 마감 > 세션

assert.equal(firstError({ ...base, aiImage: undefined }), "aiImage"); // 고르지 않고 넘어갈 수 없다
assert.equal(firstError({ ...base, genres: ["1", "2", "3", "4", "5", "6"] }), "genres");

// 추첨은 대기 접수 설정을 쓰지 않아 항상 켜진 값으로 저장된다.
const lottery = { ...base, recruitMethod: RECRUIT_METHOD.lottery, waitlistEnabled: false };
assert.equal(firstError(lottery), null);
assert.equal(toGameColumns(lottery).waitlistEnabled, true);
assert.equal(toGameColumns({ ...base, waitlistEnabled: false }).waitlistEnabled, false);

const spoiler = { ...base, thumbnailSpoiler: true };
assert.equal(toGameColumns({ ...spoiler, thumbnailUrl: imageUrl(1) }).thumbnailSpoiler, true);
assert.equal(toGameColumns({ ...spoiler, thumbnailUrl: "" }).thumbnailSpoiler, false); // 썸네일 없으면 가릴 것도 없다

console.log("game-form.check: OK");
