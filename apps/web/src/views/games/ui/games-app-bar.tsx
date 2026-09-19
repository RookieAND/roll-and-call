import { Button } from "@trpg/ui";
import Link from "next/link";

import { AppBar } from "@/shared/ui";

export function GamesAppBar() {
  return (
    <AppBar
      title="구인 목록"
      brand
      action={
        <Button asChild size="sm">
          <Link href="/games/new">새 구인</Link>
        </Button>
      }
    />
  );
}
