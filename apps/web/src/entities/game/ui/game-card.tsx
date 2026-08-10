import Link from "next/link";
import { Box, HStack, VStack } from "@trpg/ui";
import type { Game } from "@/shared/api/db";
import { deriveGameStatus, gameStatusLabel } from "../model/status";

type Props = {
  game: Game & {
    kp: { username: string } | null;
    participants: { userId: string }[];
  };
};

export function GameCard({ game }: Props) {
  const count = game.participants.length;
  const status = deriveGameStatus(game, count);

  return (
    <Link href={`/games/${game.id}`}>
      <Box className="h-full rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
        <VStack gap={2}>
          <HStack justify="between" align="center">
            <span className="font-bold">{game.title}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {gameStatusLabel[status]}
            </span>
          </HStack>
          <span className="text-sm text-gray-500">{game.rule}</span>
          <HStack justify="between" className="text-sm text-gray-600">
            <span>KP {game.kp?.username ?? "?"}</span>
            <span>
              {count}/{game.maxPlayers}명
            </span>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
