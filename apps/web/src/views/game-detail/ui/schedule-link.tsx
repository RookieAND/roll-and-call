import { Button, type ButtonProps } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ScheduleLinkProps {
  gameId: string;
  label?: "일정 조율" | "일정 보기";
  variant?: "outline" | "tinted";
  size?: ButtonProps["size"];
  className?: string;
}

export function ScheduleLink({
  gameId,
  label = "일정 조율",
  variant = "tinted",
  size,
  className,
}: ScheduleLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/${gameId}/schedule`} />}
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
