import { expect, it } from "vitest";

import { hasThumbnailChanged } from "./has-thumbnail-changed";

const IMAGE = "https://cdn.example/game-images/a.webp";
const OTHER_IMAGE = "https://cdn.example/game-images/b.webp";

it("썸네일을 그대로 두면 바뀐 것이 아니다", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
      after: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
    }),
  ).toBe(false);
});

it("썸네일이 없는 구인을 고쳐도 바뀐 것이 아니다(폼은 빈 문자열, DB는 null)", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: null, thumbnailSpoiler: false },
      after: { thumbnailUrl: "", thumbnailSpoiler: false },
    }),
  ).toBe(false);
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: null, thumbnailSpoiler: false },
      after: { thumbnailUrl: undefined, thumbnailSpoiler: false },
    }),
  ).toBe(false);
});

it("썸네일이 없으면 스포일러 값은 무시한다", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: null, thumbnailSpoiler: false },
      after: { thumbnailUrl: "", thumbnailSpoiler: true },
    }),
  ).toBe(false);
});

it("다른 이미지로 바꾸면 바뀐 것이다", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
      after: { thumbnailUrl: OTHER_IMAGE, thumbnailSpoiler: false },
    }),
  ).toBe(true);
});

it("썸네일을 새로 넣거나 지우면 바뀐 것이다", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: null, thumbnailSpoiler: false },
      after: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
    }),
  ).toBe(true);
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
      after: { thumbnailUrl: "", thumbnailSpoiler: false },
    }),
  ).toBe(true);
});

it("같은 이미지라도 스포일러를 켜거나 끄면 바뀐 것이다", () => {
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
      after: { thumbnailUrl: IMAGE, thumbnailSpoiler: true },
    }),
  ).toBe(true);
  expect(
    hasThumbnailChanged({
      before: { thumbnailUrl: IMAGE, thumbnailSpoiler: true },
      after: { thumbnailUrl: IMAGE, thumbnailSpoiler: false },
    }),
  ).toBe(true);
});
