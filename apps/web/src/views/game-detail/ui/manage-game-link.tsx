import { Button } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";

interface ManageGameLinkProps {
  gameId: string;
}

export function ManageGameLink({ gameId }: ManageGameLinkProps) {
  return (
    <Button
      render={<Link href={`/games/${gameId}/manage`} />}
      variant="tinted"
      className={ACTION_PRIMARY_CLASS}
    >
      운영 관리
      <ChevronRight size={15} aria-hidden />
    </Button>
  );
}
