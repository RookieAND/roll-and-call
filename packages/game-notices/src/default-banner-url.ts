import { siteBaseUrl } from "./site-base-url";

// 사용자 앱의 OG 기본 이미지(apps/web/public/og-thumbnail.png, OG_IMAGE)와 같은 파일이다. 어두운 바탕에 서비스 로고가 있다.
const DEFAULT_BANNER_PATH = "/og-thumbnail.png";

// 구인에 썸네일이 없을 때 디스코드 모집 글에 대신 싣는 기본 배너 주소. 배포 도메인이 없으면 undefined.
export function defaultBannerUrl(): string | undefined {
  const base = siteBaseUrl();
  return base ? `${base}${DEFAULT_BANNER_PATH}` : undefined;
}
