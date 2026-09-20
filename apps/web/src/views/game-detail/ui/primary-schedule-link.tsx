import { GameScheduleLink } from "@/features/coordinate-session";

interface PrimaryScheduleLinkProps {
  gameId: string;
  className: string;
}

// 아직 가능 시간을 내지 않은 사람에게는 조율이 주 CTA라 솔리드로 선다.
export function PrimaryScheduleLink({ gameId, className }: PrimaryScheduleLinkProps) {
  return (
    <GameScheduleLink gameId={gameId} label="일정 조율" variant="solid" className={className} />
  );
}
