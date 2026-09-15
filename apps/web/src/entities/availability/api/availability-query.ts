import { queryOptions } from "@tanstack/react-query";

import type { AvailabilityAggregate } from "../model/availability";

// blocked: 다른 확정 세션과 겹쳐 고를 수 없는 슬롯.
export type ScheduleAvailability = { aggregate: AvailabilityAggregate; blocked: string[] };

// 그리드(저장 후 invalidate)·히트맵·확정 후보가 같은 키를 읽는다.
export function availabilityQuery(gameId: string) {
  return queryOptions({
    queryKey: ["games", gameId, "availability"] as const,
    queryFn: async (): Promise<ScheduleAvailability> => {
      const response = await fetch(`/api/games/${gameId}/availability`);
      if (!response.ok) throw new Error("가능 시간을 불러오지 못했습니다.");
      return response.json();
    },
  });
}
