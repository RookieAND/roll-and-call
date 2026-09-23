import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";

interface SimilarGamesLinkProps {
  size?: ButtonProps["size"];
  className?: string;
}

export function SimilarGamesLink({ size, className }: SimilarGamesLinkProps) {
  return (
    <Button render={<Link href="/games" />} variant="outline" size={size} className={className}>
      비슷한 글 찾기
    </Button>
  );
}
