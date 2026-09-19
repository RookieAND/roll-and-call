import { Button } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";

export function ManageGameLink({ gameId }: { gameId: string }) {
  return (
    <Button asChild variant="tinted" className={ACTION_PRIMARY_CLASS}>
      <Link href={`/games/${gameId}/manage`}>
        운영 관리
        <ChevronRight size={15} aria-hidden />
      </Link>
    </Button>
  );
}
