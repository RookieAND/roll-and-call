import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound } from "next/navigation";

import { reviewEditDeadline } from "@/entities/review";
import { LoginRequired } from "@/features/auth";
import { ReviewForm, reviewBlockOf } from "@/features/write-review";
import { formatMonthDayTime } from "@/shared/lib";
import { getCurrentSessionUser, getReviewDraftTarget, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface WriteReviewViewProps {
  gameId: string;
}

export async function WriteReviewView({ gameId }: WriteReviewViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back={`/games/${gameId}`} title="후기 쓰기" />
        <Container size="sm" className="py-300">
          <LoginRequired />
        </Container>
      </>
    );
  }

  const server = await getCurrentServer();
  const target = await getReviewDraftTarget({ serverId: server.id, gameId, userId: user.id });
  if (!target) notFound();
  const { game, review } = target;
  const when = game.confirmedAt ? `${formatMonthDayTime(game.confirmedAt)} · ` : "";
  const editable = review && !review.removedAt ? review : null;

  return (
    <ReviewForm
      serverId={server.id}
      gameId={gameId}
      heading={{ title: game.title, rule: game.rule, subline: `${when}GM ${game.gmName}` }}
      review={
        editable && {
          id: editable.id,
          body: editable.body,
          spoiler: editable.spoiler,
          photoUrls: editable.photoUrls,
          hidden: !isNull(editable.hiddenAt),
        }
      }
      editUntil={reviewEditDeadline(editable?.createdAt ?? new Date())}
      initialBlock={reviewBlockOf(target)}
    />
  );
}
