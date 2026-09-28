import { VStack } from "@roll-and-call/ui";

import { ReviewCard, ReviewEmpty, reviewEditDeadline } from "@/entities/review";
import { formatMonthDay } from "@/shared/lib";
import type { ReviewCardRow } from "@/shared/server";

import { reviewCardText } from "../model/review-card-text";
import type { ReviewPerspective } from "../model/review-perspective";
import { ReviewMenu } from "./review-menu";

interface ReviewListProps {
  rows: ReviewCardRow[];
  perspective: ReviewPerspective;
  viewerId: string | null;
  emptyText: string;
}

// 공개된 후기만 온다. 본인 후기의 숨김·보류 같은 상태는 내가 쓴 후기에서 본다.
export function ReviewList({ rows, perspective, viewerId, emptyText }: ReviewListProps) {
  if (rows.length === 0) return <ReviewEmpty text={emptyText} />;
  const now = Date.now();

  return (
    <VStack gap="150">
      {rows.map((row) => {
        const { title, meta } = reviewCardText(row, perspective);
        const own = row.authorId === viewerId;
        const editable = own && reviewEditDeadline(row.createdAt).getTime() > now;
        const menu = viewerId && (
          <ReviewMenu
            reviewId={row.id}
            own={own}
            editHref={editable ? `/games/${row.gameId}/review` : null}
            deleteSubject={`${row.gameTitle} · ${formatMonthDay(row.createdAt)} 후기`}
            reportSubject={`${row.authorName}님의 후기 · ${row.gameTitle}`}
          />
        );
        return (
          <ReviewCard
            key={row.id}
            title={title}
            meta={meta}
            body={row.body}
            photoUrls={row.photoUrls}
            spoiler={row.spoiler}
            menu={menu}
          />
        );
      })}
    </VStack>
  );
}
