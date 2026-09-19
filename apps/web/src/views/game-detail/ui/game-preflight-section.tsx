import { Chip, Text, VStack } from "@trpg/ui";

import { GAME_TAG_KEYS, gameTagLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

export function GamePreflightSection({ game }: { game: GameDetailData }) {
  const filledKeys = GAME_TAG_KEYS.filter((key) => game[key].length > 0);
  if (filledKeys.length === 0 && !game.notice) return null;

  return (
    <VStack gap={4}>
      {filledKeys.map((key) => (
        <VStack key={key} gap={2}>
          <Text typography="heading3" render={<h2 />}>
            {gameTagLabel[key]}
          </Text>
          <div className="flex flex-wrap gap-1.5">
            {game[key].map((tag) => (
              <Chip key={tag} asChild>
                <span>{tag}</span>
              </Chip>
            ))}
          </div>
        </VStack>
      ))}

      {game.notice && (
        <VStack gap={2}>
          <Text typography="heading3" render={<h2 />}>
            주의 사항
          </Text>
          <Text typography="body3" foreground="muted" className="whitespace-pre-wrap">
            {game.notice}
          </Text>
        </VStack>
      )}
    </VStack>
  );
}
