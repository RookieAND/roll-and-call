import { HStack, Table, Text } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import { formatShortDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ReviewStatusBadge, TableColumns, ServerLink } from "@/shared/ui";

interface ReviewsTableProps {
  reviews: PostDetail["reviews"];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  return (
    <Table.Root className="table-equal">
      <TableColumns widths={[160, 120, 64, 80, 96]} />
      <Table.Header>
        <Table.Row>
          <Table.Head>작성자</Table.Head>
          <Table.Head aria-sort="descending" className="text-gray-900">
            <HStack align="center" gap="050" render={<span />}>
              작성 시각
              <ArrowDown size={10} strokeWidth={2.4} aria-hidden />
            </HStack>
          </Table.Head>
          <Table.Head align="end">사진</Table.Head>
          <Table.Head align="center">스포일러</Table.Head>
          <Table.Head align="center">상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {reviews.map((review) => (
          <Table.Row key={review.id} interactive className="relative">
            <Table.Cell>
              <Text
                typography="body3"
                weight="bold"
                truncate
                title={review.authorNickname}
                render={<ServerLink path={`/posts/reviews/${review.id}`} />}
                className="block after:absolute after:inset-0"
              >
                {review.authorNickname}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text typography="body3" foreground="hint">
                {formatShortDateTime(review.createdAt)}
              </Text>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {review.photoCount ? (
                `${review.photoCount}장`
              ) : (
                <Text typography="body3" foreground="hint">
                  —
                </Text>
              )}
            </Table.Cell>
            <Table.Cell align="center">
              {review.spoiler ? (
                "포함"
              ) : (
                <Text typography="body3" foreground="hint">
                  —
                </Text>
              )}
            </Table.Cell>
            <Table.Cell align="center">
              <ReviewStatusBadge
                openReportCount={review.openReportCount}
                hidden={review.hidden}
                held={review.held}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
