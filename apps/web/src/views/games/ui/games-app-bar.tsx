import { Button } from "@trpg/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { AppBar } from "@/shared/ui";

export function GamesAppBar() {
  return (
    <AppBar
      title="구인 목록"
      brand
      action={
        <Button asChild size="sm">
          <Link href="/games/new">
            <Plus size={16} strokeWidth={2.5} aria-hidden />새 구인
          </Link>
        </Button>
      }
    />
  );
}
