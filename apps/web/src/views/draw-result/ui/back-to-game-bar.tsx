import { Button, FloatingBar } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface BackToGameBarProps {
  gameId: string;
}

export function BackToGameBar({ gameId }: BackToGameBarProps) {
  return (
    <>
      <FloatingBar.Spacer />
      <FloatingBar.Content>
        <Button
          render={<ServerLink path={`/games/${gameId}`} />}
          variant="outline"
          size="lg"
          className="w-full"
        >
          구인 글로 돌아가기
        </Button>
      </FloatingBar.Content>
    </>
  );
}
