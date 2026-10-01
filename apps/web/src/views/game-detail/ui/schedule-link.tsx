import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";

interface ScheduleLinkProps {
  gameId: string;
  label?: "일정 조율" | "일정 보기";
  size?: ButtonProps["size"];
  className?: string;
}

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
