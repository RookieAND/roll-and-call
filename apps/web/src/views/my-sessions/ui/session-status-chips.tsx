import { Chip, HStack } from "@roll-and-call/ui";
import Link from "next/link";

import type { SessionRole } from "@/entities/game";
import { SESSION_CHIPS, sessionsHref, type SessionChipKey } from "@/widgets/session-list";

interface SessionStatusChipsProps {
  activeTab: SessionRole;
  activeChip: SessionChipKey;
  counts: Partial<Record<SessionChipKey, number>>;
}

export function SessionStatusChips({ activeTab, activeChip, counts }: SessionStatusChipsProps) {
  return (
    <HStack gap="075" className="overflow-x-auto px-200 pt-175 [scrollbar-width:none]">
      {SESSION_CHIPS[activeTab].map((chip) => {
        const selected = chip.key === activeChip;
        const count = counts[chip.key] ?? 0;
        const label = count > 0 ? `${chip.label} ${count}` : chip.label;
        return (
          <Chip
            key={chip.key}
            render={
              <Link
                href={sessionsHref(activeTab, chip.key)}
                aria-current={selected ? "page" : undefined}
              />
            }
            selected={selected}
          >
            {label}
          </Chip>
        );
      })}
    </HStack>
  );
}
