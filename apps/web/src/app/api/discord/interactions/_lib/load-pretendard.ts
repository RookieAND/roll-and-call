const FONT_BASE = "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static";

// satori는 woff2를 못 읽어 otf를 받는다. ponytail: 인스턴스마다 한 번 받아 두고, 번들에 넣는 건 CDN이 문제가 될 때.
const fonts = new Map<number, Promise<ArrayBuffer>>();

export function loadPretendard(weight: 400 | 700) {
  const name = weight === 700 ? "Bold" : "Regular";
  let font = fonts.get(weight);
  if (!font) {
    font = fetch(`${FONT_BASE}/Pretendard-${name}.otf`).then((response) => {
      if (!response.ok) throw new Error(`폰트를 받지 못했습니다 (${response.status})`);
      return response.arrayBuffer();
    });
    font.catch(() => fonts.delete(weight));
    fonts.set(weight, font);
  }
  return font;
}
