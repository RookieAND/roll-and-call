import { Chip } from "@trpg/ui";
import Link from "next/link";

import type { SessionRole } from "@/entities/game";
import {
  SESSION_CHIP,
  SESSION_CHIPS,
  sessionsHref,
  type SessionChipKey,
} from "@/widgets/session-list";

export function SessionStatusChips({
  activeTab,
  activeChip,
  endedCount,
}: {
  activeTab: SessionRole;
  activeChip: SessionChipKey;
  endedCount: number;
}) {
  return (
    <div className="flex gap-075 overflow-x-auto px-200 py-125">
      {SESSION_CHIPS[activeTab].map((chip) => {
        const selected = chip.key === activeChip;
        const label =
          chip.key === SESSION_CHIP.ended && endedCount > 0
            ? `${chip.label} ${endedCount}`
            : chip.label;
        return (
          <Chip key={chip.key} asChild selected={selected} className="h-[34px]">
            <Link
              href={sessionsHref(activeTab, chip.key)}
              aria-current={selected ? "page" : undefined}
            >
              {label}
            </Link>
          </Chip>
        );
      })}
    </div>
  );
}
