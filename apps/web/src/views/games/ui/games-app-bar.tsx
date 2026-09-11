import { Button } from "@trpg/ui";
import Link from "next/link";
import { AppBar } from "@/shared/ui";

// 목록 화면과 그 로딩 폴백이 같은 머리말을 쓴다.
export function GamesAppBar() {
  return (
    <AppBar
      title="구인 목록"
      action={
        <Button asChild size="sm">
          <Link href="/games/new">새 구인</Link>
        </Button>
      }
    />
  );
}
