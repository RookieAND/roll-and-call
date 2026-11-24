import { Card, VStack } from "@roll-and-call/ui";

import type { UpcomingGroup } from "../model/group-upcoming-rows";
import { UpcomingDayHeader } from "./upcoming-day-header";
import { UpcomingItemLink } from "./upcoming-item-link";

interface UpcomingListProps {
  groups: readonly UpcomingGroup[];
  now: Date;
}

export function UpcomingList({ groups, now }: UpcomingListProps) {
  return (
    <VStack gap="250">
      {groups.map((group) => (
        <VStack key={group.key} gap="100" render={<section />}>
          <UpcomingDayHeader startsAt={group.startsAt} now={now} />
          <VStack gap="100" render={<ul />}>
            {group.rows.map((row) => (
              <li key={row.id}>
                <Card.Root interactive padding="none" className="overflow-hidden">
                  <UpcomingItemLink row={row} />
                </Card.Root>
              </li>
            ))}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );
}
