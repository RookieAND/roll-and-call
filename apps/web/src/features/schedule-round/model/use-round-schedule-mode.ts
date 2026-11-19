"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  isRoundScheduleMode,
  ROUND_SCHEDULE_MODE,
  type RoundScheduleMode,
} from "./round-schedule-mode";

// 모드는 주소(?mode=)가 들고 있다. 입력하던 값을 잃지 않도록 서버를 다시 부르지 않고 주소만 바꾼다.
export function useRoundScheduleMode() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("mode");
  const mode: RoundScheduleMode = isRoundScheduleMode(param) ? param : ROUND_SCHEDULE_MODE.direct;

  function setMode(next: RoundScheduleMode) {
    const params = new URLSearchParams(searchParams);
    params.set("mode", next);
    window.history.replaceState(null, "", `${pathname}?${params}`);
  }

  return { mode, setMode };
}
