import { Button } from "@roll-and-call/ui";
import Link from "next/link";

interface SimilarGamesLinkProps {
  className: string;
}

export function SimilarGamesLink({ className }: SimilarGamesLinkProps) {
  return (
    <Button asChild variant="outline" className={className}>
      <Link href="/games">비슷한 글 찾기</Link>
    </Button>
  );
}
