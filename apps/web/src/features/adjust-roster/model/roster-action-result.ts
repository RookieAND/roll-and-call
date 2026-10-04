import type { ActionResult } from "@/shared/api";

// 세션 시작 뒤 정원을 1명 늘려 넣었으면 capacityRaised가 true다(토스트 문구용).
export type RosterActionResult = ActionResult & { capacityRaised?: boolean };
