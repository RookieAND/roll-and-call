import { WIDE_INNER_PX, WIDE_SHELL_CLASS } from "@/shared/ui";

export const GAMES_INNER_PX = WIDE_INNER_PX;
export const GAMES_SHELL_CLASS = WIDE_SHELL_CLASS;
export const GAMES_INNER_MX = "desktop:mx-[max(1rem,calc((100%-1296px)/2))]";

// 진행 중 목록은 데스크톱에서 카드 폭 300px 이상으로 가능한 만큼 열을 늘린다(1280px에서 2열).
export const LIVE_GRID_CLASS =
  "desktop:grid desktop:grid-cols-[repeat(auto-fill,minmax(18.75rem,1fr))]";
