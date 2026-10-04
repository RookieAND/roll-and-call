import type { ActionResult } from "@/shared/api";

// 이미 마쳤거나 끝난 세션이면 확인 창이 출석 확인으로 보낸다.
export type EndSessionResult = ActionResult & { goToAttendance?: true };
