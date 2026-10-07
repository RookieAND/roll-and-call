// 빈 상태 일러스트·로고는 빌드에 싣지 않고 Supabase Storage(공개 버킷 ui-assets)에서 받는다.
// 파일은 `<이름>.webp`(라이트)와 `<이름>-dark.webp`(다크) 한 쌍이다.
export const UI_ASSET_NAMES = [
  "logo",
  "empty-achievement",
  "empty-day",
  "empty-error",
  "empty-forbidden",
  "empty-hosted",
  "empty-month-record",
  "empty-my-games",
  "empty-notification",
  "empty-party",
  "empty-profile",
  "empty-recruit-feed",
  "empty-review",
  "empty-rulebook",
  "empty-rulebook-search",
  "empty-schedule",
  "empty-search",
] as const;
export type UiAssetName = (typeof UI_ASSET_NAMES)[number];

// 파일을 바꿔 올릴 때는 버전을 올리고 이전 버전 폴더는 지운다. 파일이 immutable 캐시라 같은 경로는 갱신되지 않는다.
const UI_ASSET_BUCKET_PATH = "/storage/v1/object/public/ui-assets/v2";

export function uiAssetUrl(name: UiAssetName, theme: "light" | "dark" = "light") {
  const file = theme === "dark" ? `${name}-dark` : name;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}${UI_ASSET_BUCKET_PATH}/${file}.webp`;
}
