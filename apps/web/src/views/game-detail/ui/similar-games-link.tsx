import { Button } from "@trpg/ui";
import Link from "next/link";

interface SimilarGamesLinkProps {
  className: string;
}

export function SimilarGamesLink({ className }: SimilarGamesLinkProps) {
  return (
    <Button asChild variant="outline" className={className}>
      <Link href="/games">비슷한 구인 보기</Link>
    </Button>
  );
}
