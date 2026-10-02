import { Button } from "@roll-and-call/ui";
import { ChevronRight, List } from "lucide-react";
import Link from "next/link";

import { serverPath } from "@/shared/lib";

interface BrowseGamesButtonProps {
  slug: string;
}

export function BrowseGamesButton({ slug }: BrowseGamesButtonProps) {
  return (
    <Button
      variant="outline"
      className="rounded-full bg-surface"
      render={<Link href={serverPath({ slug, path: "/games" })} />}
    >
      <List size={16} aria-hidden />
      구인 목록 둘러보기
      <ChevronRight size={14} aria-hidden />
    </Button>
  );
}
