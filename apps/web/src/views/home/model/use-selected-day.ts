import { useSearchParams } from "next/navigation";

import { resolveCalendarView } from "./resolve-calendar-view";

// 같은 달 안의 날짜 선택은 pushState로 주소만 바꾸므로, 선택 날짜는 서버 props가 아니라 주소에서 읽는다.
export function useSelectedDay(initialSelectedKey: string) {
  return resolveCalendarView(useSearchParams().get("date") ?? initialSelectedKey);
}
