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
        <Button asChild size="sm" className="h-8 rounded-400 px-175 text-body3 font-bold">
          <Link href="/games/new">
            <Plus size={16} strokeWidth={2.5} aria-hidden />새 구인
          </Link>
        </Button>
      }
    />
  );
}
