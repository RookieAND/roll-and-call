// 구인 목록 데스크톱의 안쪽 폭: 목록 최대 960 + 간격 24 + 패널 320 = 1304px를 영역 가운데에 두고, 좁으면 양옆 32px를 남긴다.
export const GAMES_INNER_PX = "desktop:px-[max(2rem,calc((100%-1304px)/2))]";
export const GAMES_INNER_MX = "desktop:mx-[max(2rem,calc((100%-1304px)/2))]";

// 진행 중 목록은 데스크톱에서 카드 폭 300px 이상으로 가능한 만큼 열을 늘린다(1280px에서 2열).
export const LIVE_GRID_CLASS =
  "desktop:grid desktop:grid-cols-[repeat(auto-fill,minmax(18.75rem,1fr))]";
