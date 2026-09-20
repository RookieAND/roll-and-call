import { Badge, Container, Text } from "@trpg/ui";
import { notFound, redirect } from "next/navigation";

import {
  countConfirmed,
  deriveGameStatus,
  gameStatusColor,
  gameStatusLabel,
  isGameGm,
  scheduleLine,
} from "@/entities/game";
import { DeleteGameRow } from "@/features/delete-game";
import { getCurrentUser, getGameById, getResponseCounts } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { manageRows } from "../model/manage-rows";
import { ManageRow } from "./manage-row";

// GM 도구는 모두가 읽는 02 상세가 아니라 이 화면에 모은다.
export async function ManageGameView({ id }: { id: string }) {
  const [user, game] = await Promise.all([getCurrentUser(), getGameById(id)]);
  if (!game) notFound();
  if (!user) redirect(`/?next=/games/${id}/manage`);
  if (!isGameGm({ gmId: game.gmId, userId: user.id })) redirect(`/games/${id}`);

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
          <div className="flex items-start gap-125">
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
          </div>
          <Text typography="body3" foreground="muted" render={<p />} className="mt-100">
            {[game.rule, line.text, `확정 ${confirmedCount}/${game.maxPlayers}`]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </div>

        <div className="p-200">
          <div className="overflow-hidden rounded-500 border border-gray-200">
            {rows.map((row) => (
              <ManageRow key={row.key} row={row} />
            ))}
            <DeleteGameRow gameId={id} confirmedCount={confirmedCount} />
          </div>
        </div>
      </Container>
    </>
  );
}
