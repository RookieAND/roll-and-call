import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";

interface ScheduleLinkProps {
  gameId: string;
  label?: "일정 조율" | "일정 보기";
  size?: ButtonProps["size"];
  className?: string;
}

// 확정 전에는 조율하러, 확정 뒤에는 정해진 일정을 보러 같은 화면으로 간다.
export function ScheduleLink({ gameId, label = "일정 조율", size, className }: ScheduleLinkProps) {
  return (
    <Button
      render={<Link href={`/games/${gameId}/schedule`} />}
      variant="tinted"
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
