import { Badge, Button, Callout, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { BOOK_ROW, type CategoryCard as CategoryCardData } from "../model/book-row";
import { bookTitle } from "../model/book-title";
import { CategoryBookRow } from "./category-book-row";

const applyHref = (rulebookIds: string[]) =>
  `/me/rulebooks/apply?${new URLSearchParams(rulebookIds.map((id) => ["rulebook", id]))}`;

// 상세가 있는 줄(내가 낸 신청·인증)만 상세로 간다.
const DETAIL_ROWS: string[] = [
  BOOK_ROW.certified,
  BOOK_ROW.pending,
  BOOK_ROW.rejected,
  BOOK_ROW.revoked,
];

interface CategoryCardProps {
  card: CategoryCardData;
}

// 카테고리 하나. 머리에 GM 가능 여부, 세트가 모자라면 채우라는 안내, 아래에 책마다 한 줄.
export function CategoryCard({ card }: CategoryCardProps) {
  return (
    <Card.Root padding="none" className="overflow-hidden">
      <VStack gap="075" className="px-175 pt-175 pb-150">
        <HStack align="center" gap="100">
          <Text
            typography="subtitle1"
            weight="extrabold"
            render={<h3 />}
            className="min-w-0 flex-1"
          >
            {card.name}
          </Text>
          <Badge colorPalette={card.badge.palette}>{card.badge.label}</Badge>
        </HStack>
        {card.summary && (
          <Text typography="body3" foreground="muted">
            {card.summary}
          </Text>
        )}
        {card.cta && (
          <Callout.Root colorPalette="primary" className="mt-050">
            <Callout.Description className="break-keep">{card.cta.text}</Callout.Description>
            <Callout.Action>
              <Button render={<Link href={applyHref(card.cta.rulebookIds)} />} size="sm">
                {card.cta.button}
              </Button>
            </Callout.Action>
          </Callout.Root>
        )}
      </VStack>
      {card.rows.map(({ rulebook, type, meta }) => (
        <CategoryBookRow
          key={rulebook.id}
          type={type}
          title={bookTitle(rulebook)}
          kind={rulebook.kind}
          meta={meta}
          href={DETAIL_ROWS.includes(type) ? `/me/rulebooks/${rulebook.id}` : undefined}
          applyHref={type === BOOK_ROW.add ? applyHref([rulebook.id]) : undefined}
        />
      ))}
    </Card.Root>
  );
}
