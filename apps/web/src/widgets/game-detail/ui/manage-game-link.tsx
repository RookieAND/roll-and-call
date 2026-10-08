import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ManageGameLinkProps {
  gameId: string;
}

export function ManageGameLink({ gameId }: ManageGameLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/${gameId}/manage`} />}
      variant="tinted"
      size="lg"
      className="w-full"
    >
      운영 관리
    </Button>
  );
}
