import { Avatar, Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { CircleCheck, Clock } from "lucide-react";

import { responseStatuses, type ScheduleMember } from "../model/response-statuses";

interface ResponseStatusPanelProps {
  members: ScheduleMember[];
  names: Record<string, string[]>;
}

export function ResponseStatusPanel({ members, names }: ResponseStatusPanelProps) {
  const statuses = responseStatuses({ members, names });
  const respondedCount = statuses.filter((member) => member.responded).length;

  return (
    <Card.Root background="subtle" render={<section />}>
      <VStack gap="150">
        <HStack align="baseline" gap="075">
          <Text typography="subtitle1" render={<h2 />}>
            응답 현황
          </Text>
          <Text typography="body3" foreground="muted" numeric render={<span />}>
            {respondedCount} / {statuses.length} 완료
          </Text>
        </HStack>
        <VStack render={<ul />}>
          {statuses.map(({ name, isGm, responded }) => (
            <HStack
              key={name}
              align="center"
              gap="125"
              className="min-h-11 border-gray-200 not-first:border-t"
              render={<li />}
            >
              <Avatar size="sm" name={name} />
              <Text typography="body2" weight="medium" className="min-w-0 flex-1" render={<span />}>
                {name}
              </Text>
              {isGm && <Badge colorPalette="primary">GM</Badge>}
              {responded ? (
                <CircleCheck
                  size={20}
                  role="img"
                  aria-label="응답 완료"
                  className="flex-none text-success-600"
                />
              ) : (
                <Clock
                  size={20}
                  role="img"
                  aria-label="아직 응답 안 함"
                  className="flex-none text-warning-600"
                />
              )}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Card.Root>
  );
}
