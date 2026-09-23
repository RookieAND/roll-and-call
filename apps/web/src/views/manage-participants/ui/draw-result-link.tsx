import { Badge } from "@roll-and-call/ui";
import Link from "next/link";

interface DrawResultLinkProps {
  gameId: string;
}

// 확정 명단이 추첨으로 정해졌다는 표시이자 결과 화면(12)으로 가는 입구.
export function DrawResultLink({ gameId }: DrawResultLinkProps) {
  return (
    <Badge colorPalette="primary" render={<Link href={`/games/${gameId}/draw`} />}>
      추첨 결과
    </Badge>
  );
}
