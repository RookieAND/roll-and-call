import { GameScheduleLink } from "@/features/coordinate-session";

interface ScheduleLinkProps {
  gameId: string;
  className: string;
}

// 조율 화면으로 가는 버튼은 라벨 "일정 조율" 하나로 고정한다.
export function ScheduleLink({ gameId, className }: ScheduleLinkProps) {
  return <GameScheduleLink gameId={gameId} label="일정 조율" className={className} />;
}
