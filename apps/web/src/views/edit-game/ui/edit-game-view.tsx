import { Container, VStack } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { GmOnlyNotice } from "@/features/auth";
import { getGameById, getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { EditGameForm } from "@/widgets/game-form";

import { editLockedTitle } from "../model/edit-locked-title";
import { EditLockedNotice } from "./edit-locked-notice";

interface EditGameViewProps {
  id: string;
}

export async function EditGameView({ id }: EditGameViewProps) {
  const server = await getCurrentServer();
  const [game, user] = await Promise.all([getGameById(server.id, id), getCurrentSessionUser()]);
  if (!game) notFound();
  const isGm = user?.id === game.gmId;
  const lockedTitle = isGm ? editLockedTitle(game) : null;
  if (isGm && !lockedTitle) return <EditGameForm serverId={server.id} game={game} />;

  return (
    <>
      <AppBar back={`/games/${id}`} title="구인 수정" />
      <Container size="md">
        <VStack gap="300" className="py-300">
          {lockedTitle ? (
            <EditLockedNotice gameId={id} title={lockedTitle} />
          ) : (
            <GmOnlyNotice
              gameId={id}
              signedIn={!!user}
              description="이 구인글의 수정은 GM만 할 수 있습니다."
            />
          )}
        </VStack>
      </Container>
    </>
  );
}
