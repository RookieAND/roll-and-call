import { Badge, Card, Container, HStack, Text } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { countConfirmed, isSessionEnded } from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { DeleteGameRow } from "@/features/delete-game";
import { getCurrentUser, getGameById, getResponseCounts } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { manageRows } from "../model/manage-rows";
import { manageSummary } from "../model/manage-summary";
import { ManageGameStat } from "./manage-game-stat";
import { ManageRow } from "./manage-row";

// GM 도구는 모두가 읽는 02 상세가 아니라 이 화면에 모은다. 다섯 줄은 항상 보이고, 못 하는 일은 흐리게 둔다.
export async function ManageGameView({ id }: { id: string }) {
  const [game, user, responseCounts] = await Promise.all([
    getGameById(id),
    getCurrentUser(),
    getResponseCounts([id]),
  ]);
  if (!game) notFound();
  if (user?.id !== game.gmId) {
    return (
      <>
        <AppBar back={`/games/${id}`} title="운영 관리" />
        <Container size="sm" className="py-300">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 운영 관리는 GM만 열 수 있습니다."
          />
        </Container>
      </>
    );
  }
  const responses = responseCounts.get(id) ?? 0;
  const confirmedCount = countConfirmed(game.participants);
  const { stage, stats } = manageSummary(game, responses);
  const rows = manageRows(game);

  return (
    <>
      <AppBar
        back={`/games/${id}`}
        title="운영 관리"
        action={
          <Badge colorPalette="primary" className="mr-100">
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
            <Badge colorPalette="gray" className="shrink-0">
              {stage}
            </Badge>
          </HStack>
          <HStack
            align="stretch"
            className="mt-150 overflow-hidden rounded-500 border border-gray-200 divide-x divide-gray-200"
          >
            {stats.map((stat, index) => (
              <ManageGameStat key={stat.label} stat={stat} wide={index === 0} />
            ))}
          </HStack>
        </div>

        <div className="p-200">
          <Card.Root radius={500} background="none" padding="none" className="overflow-hidden">
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
          </Card.Root>
        </div>
      </Container>
    </>
  );
}
