import { Container } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { reviewEditDeadline } from "@/entities/review";
import { LoginRequired } from "@/features/auth";
import { ReviewForm, reviewBlockOf } from "@/features/write-review";
import { formatMonthDayTime } from "@/shared/lib";
import { getCurrentUser, getReviewDraftTarget } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface WriteReviewViewProps {
  gameId: string;
}

// 이미 쓴 후기가 있으면 고치기 화면이 된다. 막혀 있으면 폼 위에 까닭을 띄우고 닫으면 떠난다.
export async function WriteReviewView({ gameId }: WriteReviewViewProps) {
  const user = await getCurrentUser();
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

  const target = await getReviewDraftTarget(gameId, user.id);
  if (!target) notFound();
  const { game, review } = target;
  const when = game.confirmedAt ? `${formatMonthDayTime(game.confirmedAt)} · ` : "";
  const editable = review && !review.removedAt ? review : null;

  return (
    <ReviewForm
      gameId={gameId}
      heading={{ title: game.title, rule: game.rule, subline: `${when}GM ${game.gmName}` }}
      review={
        editable && {
          id: editable.id,
          body: editable.body,
          spoiler: editable.spoiler,
          photoUrls: editable.photoUrls,
          hidden: editable.hiddenAt !== null,
        }
      }
      editUntil={reviewEditDeadline(editable?.createdAt ?? new Date())}
      initialBlock={reviewBlockOf(target)}
    />
  );
}
