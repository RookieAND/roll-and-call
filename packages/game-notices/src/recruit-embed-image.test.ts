import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { recruitEmbedImage } from "./recruit-embed-image";

const BANNER_URL = "https://roll-and-call.vercel.app/og-thumbnail.png";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_USER_APP_URL", undefined);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://roll-and-call.vercel.app/");
  vi.stubEnv("VERCEL_URL", undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

it("썸네일이 있으면 그 이미지를 싣는다", () => {
  expect(
    recruitEmbedImage({ thumbnailUrl: "https://cdn.example/a.png", thumbnailSpoiler: false }),
  ).toEqual({ url: "https://cdn.example/a.png" });
});

it("썸네일이 없으면 기본 다크 배너를 싣는다", () => {
  expect(recruitEmbedImage({ thumbnailUrl: null, thumbnailSpoiler: false })).toEqual({
    url: BANNER_URL,
  });
});

it("스포일러 썸네일은 가릴 수 없어서 싣지 않는다", () => {
  expect(
    recruitEmbedImage({ thumbnailUrl: "https://cdn.example/a.png", thumbnailSpoiler: true }),
  ).toBeUndefined();
});

it("배포 도메인을 모르면 배너도 싣지 않는다", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
  expect(recruitEmbedImage({ thumbnailUrl: null, thumbnailSpoiler: false })).toBeUndefined();
});
