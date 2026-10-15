// 1100px 이상에서 탭과 목록을 담는 흰 카드. 폭은 구인 목록과 같은 넓은 틀(shared/ui WIDE_*)이 정한다.
export const NOTIFICATIONS_CARD_CLASS =
  "desktop:overflow-clip desktop:rounded-700 desktop:border desktop:border-gray-200 desktop:bg-surface";

// [할 일] 카드 격자: 카드 하나의 최소 폭 22.5rem, 남는 폭만큼 열이 늘어난다(1100px 2열, 1440px 3열). 카드가 하나면 첫 칸만 쓴다.
export const TODO_GRID_CLASS =
  "desktop:grid desktop:grid-cols-[repeat(auto-fill,minmax(22.5rem,1fr))]";
