import { Chip, HStack } from "@roll-and-call/ui";

import type { SessionRole } from "@/entities/game";
import { TabCount, ServerLink } from "@/shared/ui";
import { SESSION_CHIPS, sessionsHref, type SessionChipKey } from "@/widgets/session-list";

interface SessionStatusChipsProps {
  activeTab: SessionRole;
  activeChip: SessionChipKey;
  counts: Partial<Record<SessionChipKey, number>>;
}

export function SessionStatusChips({ activeTab, activeChip, counts }: SessionStatusChipsProps) {
  return (
    <HStack
      gap="075"
      className="overflow-x-auto px-200 pt-175 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      {SESSION_CHIPS[activeTab].map((chip) => {
        const selected = chip.key === activeChip;
        return (
          <Chip
            key={chip.key}
            render={
              <ServerLink
                path={sessionsHref({ role: activeTab, status: chip.key })}
                aria-current={selected ? "page" : undefined}
              />
            }
            selected={selected}
          >
            {chip.label}
            <TabCount count={counts[chip.key] ?? 0} />
          </Chip>
        );
      })}
    </HStack>
  );
}
