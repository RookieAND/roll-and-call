// Runnable self-check for the game form schema. Run: pnpm check
import assert from "node:assert";
import { gameFormSchema } from "./game-form";

const base = {
  title: "마지막 열차",
  rule: "CoC 7판",
  maxPlayers: "4",
  scheduleMode: "coordinate" as const,
  endDate: "2026-09-10T20:00",
  rangeStart: "2026-09-12",
  rangeEnd: "2026-09-20",
  images: [] as string[],
  waitlistEnabled: true,
};

function firstError(values: object) {
  const r = gameFormSchema.safeParse(values);
  return r.success ? null : (r.error.issues[0]?.path.join(".") ?? "?");
}

assert.equal(firstError(base), null);
assert.equal(firstError({ ...base, maxPlayers: "21" }), "maxPlayers");
assert.equal(firstError({ ...base, rangeEnd: "2026-09-12" }), "rangeEnd"); // 종료일 > 시작일
assert.equal(firstError({ ...base, rangeEnd: "2026-09-30" }), "rangeEnd"); // 2주 초과
assert.equal(firstError({ ...base, endDate: "2026-09-25T20:00" }), "endDate"); // 마감 > 조율 종료

// 진행 이미지는 최대 5장, URL만
const img = (i: number) => `https://example.supabase.co/storage/v1/object/public/game-thumbnails/${i}.png`;
assert.equal(firstError({ ...base, images: [1, 2, 3, 4, 5].map(img) }), null);
assert.equal(firstError({ ...base, images: [1, 2, 3, 4, 5, 6].map(img) }), "images");
assert.equal(firstError({ ...base, images: ["not-a-url"] }), "images.0");

const fixed = { ...base, scheduleMode: "fixed" as const, confirmedAt: "2026-09-12T19:00" };
assert.equal(firstError(fixed), null);
assert.equal(firstError({ ...fixed, confirmedAt: "" }), "confirmedAt");
assert.equal(firstError({ ...fixed, endDate: "2026-09-12T20:00" }), "endDate"); // 마감 > 세션

console.log("game-form.check: OK");
