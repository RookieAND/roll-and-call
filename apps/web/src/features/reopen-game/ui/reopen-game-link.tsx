import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ReopenGameLinkProps {
  gameId: string;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
}

export function ReopenGameLink({ gameId, variant = "outline", size = "lg" }: ReopenGameLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/new?from=${gameId}`} />}
      variant={variant}
      size={size}
      className="w-full"
    >
      같은 내용으로 다시 열기
    </Button>
  );
}
