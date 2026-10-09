import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ReopenGameLinkProps {
  gameId: string;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  label?: string;
}

export function ReopenGameLink({
  gameId,
  variant = "outline",
  size = "lg",
  label = "다시 열기",
}: ReopenGameLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/new?from=${gameId}`} />}
      variant={variant}
      size={size}
      className="w-full"
    >
      {label}
    </Button>
  );
}
