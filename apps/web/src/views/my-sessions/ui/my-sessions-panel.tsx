import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { SessionRole } from "@/entities/game";
import {
  countableCards,
  isOngoingCard,
  ONGOING_CHIP,
  type SessionCardModel,
  sessionWhen,
} from "@/widgets/session-list";

import { nextSession } from "../model/next-session";
import { SUMMARY_ROWS, SUMMARY_TITLE } from "../model/summary-rows";

interface MySessionsPanelProps {
  role: SessionRole;
  cards: SessionCardModel[];
}

export function MySessionsPanel({ role, cards }: MySessionsPanelProps) {
  const now = new Date();
  const countable = countableCards(cards);
  const next = nextSession({ cards, now });

  return (
    <>
      <Card.Root padding="md" radius={600}>
        <Text typography="subtitle1" render={<h2 />}>
          {SUMMARY_TITLE[role]}
        </Text>
        <VStack className="mt-100 divide-y divide-gray-200">
          {SUMMARY_ROWS[role].map((row) => (
            <HStack key={row.key} align="center" justify="between" className="py-100">
              <Text typography="body3" foreground="muted">
                {row.label}
              </Text>
              <Text typography="subtitle1" numeric>
                {
                  countable.filter((card) =>
                    row.key === ONGOING_CHIP ? isOngoingCard(card) : card.chip === row.key,
                  ).length
                }
              </Text>
            </HStack>
          ))}
        </VStack>
      </Card.Root>
      {next && (
        <Card.Root padding="md" radius={600}>
          <Text typography="subtitle1" render={<h2 />}>
            다음 일정
          </Text>
          <VStack gap="025" className="mt-100">
            <Text typography="subtitle2">{next.title}</Text>
            <Text typography="body4" foreground="muted">
              {sessionWhen({ startsAt: new Date(next.startsAt!), now })}
            </Text>
          </VStack>
        </Card.Root>
      )}
    </>
  );
}
