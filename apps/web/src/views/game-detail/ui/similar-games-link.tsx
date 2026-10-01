import { Button, type ButtonProps } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface SimilarGamesLinkProps {
  size?: ButtonProps["size"];
  className?: string;
}

export function SimilarGamesLink({ size, className }: SimilarGamesLinkProps) {
  return (
    <Button
      render={<ServerLink path={"/games"} />}
      variant="outline"
      size={size}
      className={className}
    >
      비슷한 글 찾기
    </Button>
  );
}
