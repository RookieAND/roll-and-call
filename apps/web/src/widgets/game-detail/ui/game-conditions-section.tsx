import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { ParticipationCondition } from "@/entities/game";

interface GameConditionsSectionProps {
  conditions: ParticipationCondition[];
}

export function GameConditionsSection({ conditions }: GameConditionsSectionProps) {
  if (conditions.length === 0) return null;
  return (
    <VStack gap="100" render={<section />}>
      <Text typography="subtitle2" render={<h2 />}>
        참여 조건
      </Text>
      <Card.Root radius={500} padding="none" className="overflow-hidden">
        {conditions.map((condition) => (
          <HStack
            key={condition.key}
            align="center"
            gap="150"
            className="min-h-14 border-t border-gray-200 px-175 py-125 first:border-t-0"
          >
            <VStack gap="025" className="min-w-0 flex-1">
              <Text typography="subtitle2" render={<p />}>
                {condition.title}
              </Text>
              {condition.mine && (
                <Text typography="body4" foreground="muted" render={<p />}>
                  {condition.mine}
                </Text>
              )}
            </VStack>
            {condition.met !== null && (
              <Badge colorPalette={condition.met ? "success" : "danger"}>
                {condition.met ? "충족" : "미충족"}
              </Badge>
            )}
          </HStack>
        ))}
      </Card.Root>
    </VStack>
  );
}
