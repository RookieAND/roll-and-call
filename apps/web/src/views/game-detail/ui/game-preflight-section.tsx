import { VStack } from "@roll-and-call/ui";

import { GAME_TAG, gameTagLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { AiImageBlock } from "./ai-image-block";
import { GameNoticeBlock } from "./game-notice-block";
import { GameTagBlock } from "./game-tag-block";

const TRIGGER_NOTE = "신청 전에 확인해 주세요.\n불편한 소재가 있으면 GM에게 미리 말해도 됩니다.";

interface GamePreflightSectionProps {
  game: GameDetailData;
}

export function GamePreflightSection({ game }: GamePreflightSectionProps) {
  return (
    <VStack gap="175">
      {game.genres.length > 0 && (
        <GameTagBlock label={gameTagLabel[GAME_TAG.genres]} tags={game.genres} tone="neutral" />
      )}
      {game.triggers.length > 0 && (
        <GameTagBlock
          label={gameTagLabel[GAME_TAG.triggers]}
          tags={game.triggers}
          note={TRIGGER_NOTE}
          tone="notice"
        />
      )}
      {game.notice && <GameNoticeBlock notice={game.notice} />}
      {game.platforms.length > 0 && (
        <GameTagBlock label={gameTagLabel[GAME_TAG.platforms]} tags={game.platforms} />
      )}
      <AiImageBlock label={game.aiImage ? "사용" : "사용 안 함"} />
    </VStack>
  );
}
