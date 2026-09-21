import { Badge, Card, Container, Grid, HStack, Text } from "@trpg/ui";

import { countConfirmed, isSessionEnded } from "@/entities/game";
import { DeleteGameRow } from "@/features/delete-game";
import { getResponseCounts, requireGmGame } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { manageRows } from "../model/manage-rows";
import { manageSummary } from "../model/manage-summary";
import { ManageGameStat } from "./manage-game-stat";
import { ManageRow } from "./manage-row";

// GM 도구는 모두가 읽는 02 상세가 아니라 이 화면에 모은다.
export async function ManageGameView({ id }: { id: string }) {
  const game = await requireGmGame(id, { next: `/games/${id}/manage` });

  const responseCounts = await getResponseCounts([id]);
  const responses = responseCounts.get(id) ?? 0;
  const confirmedCount = countConfirmed(game.participants);
  const { stage, time } = manageSummary(game, responses);
  const rows = manageRows(game, responses);

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
            <Badge color={stage.color} className="shrink-0">
              {stage.label}
            </Badge>
          </HStack>
          <Grid cols={2} gap="100" className="mt-150">
            <ManageGameStat label={time.label} value={time.value} />
            <ManageGameStat label="확정" value={`${confirmedCount} / ${game.maxPlayers}명`} />
          </Grid>
        </div>

        <div className="p-200">
          <Card radius={500} background="none" padding="none" className="overflow-hidden">
            {rows.map((row) => (
              <ManageRow key={row.key} row={row} />
            ))}
            <DeleteGameRow
              gameId={id}
              confirmedCount={confirmedCount}
              lockedReason={
                isSessionEnded(game) ? "이미 치른 세션은 취소할 수 없습니다" : undefined
              }
            />
          </Card>
        </div>
      </Container>
    </>
  );
}
