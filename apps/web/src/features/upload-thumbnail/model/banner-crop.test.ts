import { describe, expect, it } from "vitest";

import { bannerCrop } from "./banner-crop";

const natural = { width: 1200, height: 800 };

describe("bannerCrop", () => {
  it("100%에서는 가로를 꽉 채운 3:1 영역이 가운데에 잡힌다", () => {
    const { source } = bannerCrop({ natural, frameWidth: 600, zoom: 100, offset: { x: 0, y: 0 } });
    expect(source).toEqual({ x: 0, y: 200, width: 1200, height: 400 });
  });

  it("끌어도 틀 밖으로 나가지 않는다", () => {
    const { source } = bannerCrop({
      natural,
      frameWidth: 600,
      zoom: 100,
      offset: { x: 500, y: 500 },
    });
    expect(source.x).toBe(0);
    expect(source.y).toBe(0);
  });

  it("확대하면 원본 영역이 줄어든다", () => {
    const { source } = bannerCrop({ natural, frameWidth: 600, zoom: 200, offset: { x: 0, y: 0 } });
    expect(source).toEqual({ x: 300, y: 300, width: 600, height: 200 });
  });
});
