import { Button } from "@roll-and-call/ui";
import Link from "next/link";

interface ManageGameLinkProps {
  gameId: string;
}

export function ManageGameLink({ gameId }: ManageGameLinkProps) {
  return (
    <Button
      render={<Link href={`/games/${gameId}/manage`} />}
      variant="tinted"
      size="lg"
      className="w-full"
    >
      운영 관리
    </Button>
  );
}
