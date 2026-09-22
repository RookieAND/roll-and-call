import { Button } from "@roll-and-call/ui";
import Link from "next/link";

interface SimilarGamesLinkProps {
  className: string;
}

export function SimilarGamesLink({ className }: SimilarGamesLinkProps) {
  return (
    <Button render={<Link href="/games" />} variant="outline" className={className}>
      비슷한 글 찾기
    </Button>
  );
}
