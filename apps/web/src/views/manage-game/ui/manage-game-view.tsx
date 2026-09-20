import { Badge, Card, Container, Grid, HStack, Text } from "@trpg/ui";

import {
  countConfirmed,
  deriveGameStatus,
  gameStatusColor,
  gameStatusLabel,
  scheduleLine,
} from "@/entities/game";
import { DeleteGameRow } from "@/features/delete-game";
import { getResponseCounts, requireGmGame } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { manageRows } from "../model/manage-rows";
import { ManageGameStat } from "./manage-game-stat";
import { ManageRow } from "./manage-row";

// GM 도구는 모두가 읽는 02 상세가 아니라 이 화면에 모은다.
export async function ManageGameView({ id }: { id: string }) {
  const game = await requireGmGame(id, { next: `/games/${id}/manage` });

  const responseCounts = await getResponseCounts([id]);
  const confirmedCount = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
    waitlistEnabled: game.waitlistEnabled,
  });
  const line = scheduleLine(game);
  const rows = manageRows(game, responseCounts.get(id) ?? 0);

  return (
    <>
      <AppBar
        back={`/games/${id}`}
        title="운영 관리"
        action={
          <Badge color="primary" className="mr-100">
            GM
          </Badge>
        }
      />
      <Container size="sm" className="px-0">
        <div className="border-b border-gray-100 px-200 pt-225 pb-175">
          <HStack align="start" gap="125">
            <Text
              typography="heading2"
              render={<h1 />}
              className="min-w-0 flex-1 tracking-[-0.02em]"
            >
              {game.title}
            </Text>
            <Badge color={gameStatusColor[status]} className="shrink-0">
              {gameStatusLabel[status]}
            </Badge>
          </HStack>
          <Grid cols={2} gap="100" className="mt-150">
            <ManageGameStat label="일정" value={line.text} />
            <ManageGameStat label="확정" value={`${confirmedCount} / ${game.maxPlayers}명`} />
          </Grid>
        </div>

        <div className="p-200">
          <Card radius={500} background="none" padding="none" className="overflow-hidden">
            {rows.map((row) => (
              <ManageRow key={row.key} row={row} />
            ))}
            <DeleteGameRow gameId={id} confirmedCount={confirmedCount} />
          </Card>
        </div>
      </Container>
    </>
  );
}
