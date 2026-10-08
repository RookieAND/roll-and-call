import { Avatar, Badge, Callout, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { ReviewBody } from "@/entities/review";
import { LineBreaks } from "@/shared/ui";

import type { MyReviewCardModel } from "../model/my-review-card";
import { MyReviewActions } from "./my-review-actions";

interface MyReviewCardProps {
  card: MyReviewCardModel;
}

export function MyReviewCard({ card }: MyReviewCardProps) {
  return (
    <Card.Root padding="md" radius={500} render={<article />}>
      <VStack gap="125">
        <HStack align="center" gap="125">
          <Avatar name={card.authorName} size="md" />
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="subtitle2" truncate render={<h3 />}>
              {card.title}
            </Text>
            <Text typography="body4" foreground="hint" truncate numeric>
              {card.meta}
            </Text>
          </VStack>
          {card.badge && <Badge colorPalette={card.badge.palette}>{card.badge.label}</Badge>}
        </HStack>
        <div aria-hidden className="h-px bg-gray-200" />
        {card.body && <ReviewBody body={card.body} lines={2} muted={card.bodyMuted} />}
        {card.callout && (
          <Callout.Root colorPalette={card.callout.palette} size="sm">
            <Callout.Icon />
            <Callout.Title>{card.callout.title}</Callout.Title>
            {card.callout.lines.length > 0 && (
              <Callout.Description>
                <LineBreaks lines={card.callout.lines} />
              </Callout.Description>
            )}
          </Callout.Root>
        )}
        <MyReviewActions card={card} />
      </VStack>
    </Card.Root>
  );
}
