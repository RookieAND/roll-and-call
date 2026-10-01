import { Button, type ButtonProps } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ScheduleLinkProps {
  gameId: string;
  label?: "일정 조율" | "일정 보기";
  size?: ButtonProps["size"];
  className?: string;
}

export function ScheduleLink({ gameId, label = "일정 조율", size, className }: ScheduleLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/${gameId}/schedule`} />}
      variant="tinted"
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
