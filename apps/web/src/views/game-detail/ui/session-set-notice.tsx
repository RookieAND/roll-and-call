import { StatusNotice } from "@/shared/ui";

// 기한이 남았어도 시간이 정해지면 새 신청을 받지 않는다.
export function SessionSetNotice() {
  return <StatusNotice tone="muted">세션 시간이 정해져 신청을 받지 않습니다</StatusNotice>;
}
