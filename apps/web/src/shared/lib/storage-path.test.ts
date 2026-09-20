import { describe, expect, it } from "vitest";

import { gameImagePathOf } from "./storage-path";

const base = "https://bnxtukraoqqdhzknuqqp.supabase.co/storage/v1/object/public/game-thumbnails/";

describe("gameImagePathOf", () => {
  it("구인 썸네일 주소에서 경로만 뽑는다", () => {
    expect(gameImagePathOf(`${base}u1/a.png`)).toBe("u1/a.png");
    expect(gameImagePathOf(`${base}u1/a.png?t=1`)).toBe("u1/a.png");
    expect(gameImagePathOf(`${base}u1/%ED%95%9C.png`)).toBe("u1/한.png");
  });

  it("다른 버킷·다른 호스트·빈 경로는 받지 않는다", () => {
    expect(
      gameImagePathOf("https://x.supabase.co/storage/v1/object/public/avatars/u1/a.png"),
    ).toBeNull();
    expect(gameImagePathOf("https://cdn.discordapp.com/a.png")).toBeNull();
    expect(gameImagePathOf(base)).toBeNull();
  });
});
