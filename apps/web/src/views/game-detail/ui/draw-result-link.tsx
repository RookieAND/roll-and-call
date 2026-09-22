import { Button, type ButtonProps } from "@roll-and-call/ui";
import Link from "next/link";

interface DrawResultLinkProps {
  gameId: string;
  variant: ButtonProps["variant"];
  className: string;
}

// 추첨으로 뽑힌 근거는 판이 끝난 뒤에도 남아야 해서, 발표 뒤 참여자에게는 이 입구를 계속 둔다.
export function DrawResultLink({ gameId, variant, className }: DrawResultLinkProps) {
  return (
    <Button
      render={<Link href={`/games/${gameId}/draw`} />}
      variant={variant}
      className={className}
    >
      결과 보러 가기
    </Button>
  );
}
