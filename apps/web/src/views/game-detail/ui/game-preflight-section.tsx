import { VStack } from "@roll-and-call/ui";

import { GAME_TAG, gameTagLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { AiImageBlock } from "./ai-image-block";
import { GameNoticeBlock } from "./game-notice-block";
import { GameTagBlock } from "./game-tag-block";
import { PlayTypeBlock } from "./play-type-block";

const TRIGGER_NOTE_LINES = [
  "신청 전에 확인해 주세요.",
  "불편한 소재가 있으면 GM에게 미리 말해도 됩니다.",
] as const;

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
          noteLines={TRIGGER_NOTE_LINES}
          tone="notice"
        />
      )}
      {game.notice && <GameNoticeBlock notice={game.notice} />}
      <PlayTypeBlock playType={game.playType} />
      {game.platforms.length > 0 && (
        <GameTagBlock label={gameTagLabel[GAME_TAG.platforms]} tags={game.platforms} />
      )}
      <AiImageBlock label={game.aiImage ? "사용" : "사용 안 함"} />
    </VStack>
  );
}
