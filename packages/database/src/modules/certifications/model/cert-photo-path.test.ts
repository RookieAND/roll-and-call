import { describe, expect, it } from "vitest";

import { certPhotoPathOf } from "./cert-photo-path";

describe("certPhotoPathOf", () => {
  const base = "https://x.supabase.co/storage/v1/object/public/cert-photos/";

  it("버킷 안 경로를 꺼내고 쿼리는 버리고 퍼센트 인코딩은 푼다", () => {
    expect(certPhotoPathOf(`${base}user-1/a.webp`)).toBe("user-1/a.webp");
    expect(certPhotoPathOf(`${base}user-1/a.webp?t=1`)).toBe("user-1/a.webp");
    expect(certPhotoPathOf(`${base}user-1/%EC%82%AC%EC%A7%84.webp`)).toBe("user-1/사진.webp");
  });

  it("모양이 다르거나 경로가 비면 null", () => {
    expect(
      certPhotoPathOf("https://x.supabase.co/storage/v1/object/public/game-thumbnails/a.webp"),
    ).toBeNull();
    expect(certPhotoPathOf(base)).toBeNull();
  });
});
