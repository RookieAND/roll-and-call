import { StatusNotice } from "@/shared/ui";

// "마감"은 기한 경과 한 뜻. 대기를 끈 게임의 정원 충족은 "정원이 차서"라고 쓴다.
export function RosterFullNotice() {
  return <StatusNotice tone="muted">정원이 차서 신청을 받지 않습니다</StatusNotice>;
}
