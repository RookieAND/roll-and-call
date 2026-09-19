import { Button } from "@trpg/ui";
import Link from "next/link";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";

export function ManageParticipantsLink({ gameId }: { gameId: string }) {
  return (
    <Button asChild className={ACTION_PRIMARY_CLASS}>
      <Link href={`/games/${gameId}/participants`}>운영 관리</Link>
    </Button>
  );
}
