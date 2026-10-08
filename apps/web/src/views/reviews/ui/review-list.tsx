import { VStack } from "@roll-and-call/ui";

import { ReviewCard, ReviewEmpty, reviewEditDeadline } from "@/entities/review";
import { formatDate } from "@/shared/lib";
import type { ReviewCardRow } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

import { reviewCardText } from "../model/review-card-text";
import type { ReviewPerspective } from "../model/review-perspective";
import { ReviewMenu } from "./review-menu";

interface ReviewListProps {
  rows: ReviewCardRow[];
  perspective: ReviewPerspective;
  viewerId: string | null;
  emptyText: string;
}

export function ReviewList({ rows, perspective, viewerId, emptyText }: ReviewListProps) {
  if (rows.length === 0) return <ReviewEmpty text={emptyText} />;
  const now = Date.now();

  return (
    <VStack gap="150">
      {rows.map((row) => {
        const { title, byline, meta } = reviewCardText({ row, perspective });
        const author = (
          <ServerLink path={`/users/${row.authorId}`} className="hover:underline">
            {row.authorName}
          </ServerLink>
        );
        const metaLine = byline ? (
          <>
            {author} · {meta}
          </>
        ) : (
          meta
        );
        const own = row.authorId === viewerId;
        const editable = own && reviewEditDeadline(row.createdAt).getTime() > now;
        const menu = own && (
          <ReviewMenu
            reviewId={row.id}
            editPath={editable ? `/games/${row.gameId}/review` : null}
            deleteSubject={`${row.gameTitle} · ${formatDate(row.createdAt)} 후기`}
          />
        );
        return (
          <ReviewCard
            key={row.id}
            authorName={row.authorName}
            authorAvatarUrl={row.authorAvatarUrl}
            title={title ?? author}
            meta={metaLine}
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
