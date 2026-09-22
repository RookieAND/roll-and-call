import { Button } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { AppBar } from "@/shared/ui";

export function GamesAppBar() {
  return (
    <AppBar
      title="구인 목록"
      brand
      action={
        <Button
          render={<Link href="/games/new" />}
          size="sm"
          className="h-8 rounded-400 px-175 text-body3 font-bold"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden />새 구인
        </Button>
      }
    />
  );
}
