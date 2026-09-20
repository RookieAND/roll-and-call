import { VStack } from "@trpg/ui";

import { GAME_TAG, gameTagLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { AiImageBlock } from "./ai-image-block";
import { GameNoticeBlock } from "./game-notice-block";
import { GameTagBlock } from "./game-tag-block";

const TRIGGER_NOTE = "신청 전에 확인해주세요. 불편한 소재가 있으면 GM에게 미리 말해도 됩니다.";

// 06에서 받은 값을 신청 판단 순서대로 읽힌다 — 장르 · 트리거 · 주의 사항 · 사용 플랫폼 · AI 이미지.
export function GamePreflightSection({ game }: { game: GameDetailData }) {
  return (
    <VStack gap="250">
      {game.genres.length > 0 && (
        <GameTagBlock label={gameTagLabel[GAME_TAG.genres]} tags={game.genres} />
      )}
      {game.triggers.length > 0 && (
        <GameTagBlock
          label={gameTagLabel[GAME_TAG.triggers]}
          tags={game.triggers}
          note={TRIGGER_NOTE}
        />
      )}
      {game.notice && <GameNoticeBlock notice={game.notice} />}
      {game.platforms.length > 0 && (
        <GameTagBlock label={gameTagLabel[GAME_TAG.platforms]} tags={game.platforms} />
      )}
      {game.aiImage ? <AiImageBlock label="사용" /> : <AiImageBlock label="사용 안 함" />}
    </VStack>
  );
}
