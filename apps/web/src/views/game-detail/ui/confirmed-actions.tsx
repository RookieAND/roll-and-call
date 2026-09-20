import { ConfirmedSessionNotice } from "@/entities/game";

interface ConfirmedActionsProps {
  confirmedAt: Date;
}

// 세션 시간이 잡힌 뒤엔 조율이 끝났다. 일정 조율로 가는 길을 여기서 닫는다.
export function ConfirmedActions({ confirmedAt }: ConfirmedActionsProps) {
  return (
    <ConfirmedSessionNotice confirmedAt={confirmedAt} note="시작 1시간 전 디스코드로 알립니다." />
  );
}
