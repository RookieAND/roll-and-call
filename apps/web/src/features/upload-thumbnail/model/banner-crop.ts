export const BANNER_RATIO = 4;
export const BANNER_OUTPUT_WIDTH = 1200;
export const ZOOM_MIN = 100;
export const ZOOM_MAX = 300;

interface BannerCropInput {
  natural: { width: number; height: number };
  frameWidth: number;
  zoom: number;
  offset: { x: number; y: number };
}

// 틀(4:1)이 이미지를 항상 덮도록 이동량을 가두고, 틀이 가리키는 원본 영역을 돌려준다. zoom은 100~300(%)이다.
export function bannerCrop({ natural, frameWidth, zoom, offset }: BannerCropInput) {
  const frameHeight = frameWidth / BANNER_RATIO;
  const base = Math.max(frameWidth / natural.width, frameHeight / natural.height);
  const scale = (base * zoom) / 100;
  const maxX = Math.max(0, (natural.width * scale - frameWidth) / 2);
  const maxY = Math.max(0, (natural.height * scale - frameHeight) / 2);
  const x = Math.min(maxX, Math.max(-maxX, offset.x));
  const y = Math.min(maxY, Math.max(-maxY, offset.y));
  const width = frameWidth / scale;
  const height = frameHeight / scale;
  return {
    scale,
    offset: { x, y },
    source: {
      x: natural.width / 2 - x / scale - width / 2,
      y: natural.height / 2 - y / scale - height / 2,
      width,
      height,
    },
  };
}
