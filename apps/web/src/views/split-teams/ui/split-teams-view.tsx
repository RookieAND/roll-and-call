import { getApplicationNotes, getGameParticipants } from "@roll-and-call/database/games";
import { applicationQuestionOf } from "@roll-and-call/database/games/model";
import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { isSessionEnded, isSessionStarted, RECRUIT_METHOD, splitRoster } from "@/entities/game";
import { GmOnlyNotice } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, PageShell } from "@/shared/ui";

import { toSplitCandidate } from "../model/to-split-candidate";
import { SplitTeamsForm } from "./split-teams-form";

interface SplitTeamsViewProps {
  id: string;
}

export async function SplitTeamsView({ id }: SplitTeamsViewProps) {
  const server = await getCurrentServer();
  const [data, user] = await Promise.all([
    getGameParticipants({ serverId: server.id, gameId: id }),
    getCurrentSessionUser(),
  ]);
  if (!data) notFound();
  const { game } = data;

  if (!user || user.id !== game.gmId) {
    return (
      <PageShell appBar={<AppBar back={`/games/${id}`} title="팀 나누기" />}>
        <Container size="sm" className="desktop:px-0 desktop:max-w-none">
          <div className="py-300 desktop:py-0">
            <GmOnlyNotice
              gameId={id}
              signedIn={!!user}
              description="팀 나누기는 이 구인글의 GM만 열 수 있습니다."
            />
          </div>
        </Container>
      </PageShell>
    );
  }
  const participantsPath = serverPath({ slug: server.slug, path: `/games/${id}/participants` });
  if (game.cancelledAt || isSessionEnded(game)) {
    redirect(serverPath({ slug: server.slug, path: `/games/${id}/manage` }));
  }

  const roster = splitRoster(game.participants);
  // 세션이 시작했거나 나눌 대기자가 없으면 이 화면을 열 이유가 없다.
  if (isSessionStarted(game) || roster.waiting.length === 0) redirect(participantsPath);

  // 신청글은 GM 확인을 거친 뒤에만 읽는다.
  const applicationNotes = new Map(
    (await getApplicationNotes({ serverId: server.id, gameId: id, gmId: user.id })).map(
      ({ userId, note }) => [userId, note],
    ),
  );
  const candidates = roster.waiting.map((participant) =>
    toSplitCandidate({
      userId: participant.userId,
      username: participant.user?.username ?? "익명",
      applicationNote: applicationNotes.get(participant.userId) ?? null,
      bio: participant.user?.bio ?? null,
    }),
  );
  // 추첨·선발 판정 전이면 대기 자리에 신청자가 선다.
  const beforeResult =
    (game.recruitMethod === RECRUIT_METHOD.lottery && !game.drawnAt) ||
    (game.recruitMethod === RECRUIT_METHOD.selection && !game.selectionFinishedAt);

  return (
    <SplitTeamsForm
      gameId={game.id}
      gameTitle={game.title}
      ruleLabel={game.rule}
      countLabel={`${beforeResult ? "신청" : "대기"} ${candidates.length}명`}
      gameLine={`${game.rule} · 정원 ${game.maxPlayers}명 · 확정 ${roster.confirmed.length}명`}
      candidates={candidates}
      carriesApplicationNote={applicationQuestionOf(game) !== null}
    />
  );
}
