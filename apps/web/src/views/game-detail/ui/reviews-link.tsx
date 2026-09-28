import { Button } from "@roll-and-call/ui";
import Link from "next/link";

interface ReviewsLinkProps {
  gameId: string;
}

export function ReviewsLink({ gameId }: ReviewsLinkProps) {
  return (
    <Button
      render={<Link href={`/games/${gameId}/reviews`} />}
      variant="outline"
      size="lg"
      className="min-w-0 flex-1"
    >
      후기 보기
    </Button>
  );
}
