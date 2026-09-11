import { HStack, Text } from "@trpg/ui";
import { GameStatusBadge, type GameStatus } from "@/entities/game";
import { GameGmMenu } from "./game-gm-menu";
// 제목 + 모집 상태. GM에게만 수정·삭제·참여자 관리 메뉴가 붙는다.
export function GameDetailHeader({
  gameId,
  title,
  status,
  isGm,
}: {
  gameId: string;
  title: string;
  status: GameStatus;
  isGm: boolean;
}) {
  return (
    <HStack justify="between" align="start" gap={2}>
      <Text typography="heading1" render={<h1 />}>
        {title}
      </Text>
      <HStack align="center" gap={1} className="mt-0.5 shrink-0">
        <GameStatusBadge status={status} />
        {isGm && <GameGmMenu gameId={gameId} />}
      </HStack>
    </HStack>
  );
}
