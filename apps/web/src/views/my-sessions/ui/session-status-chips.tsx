import { Chip } from "@trpg/ui";
import Link from "next/link";

import { SESSION_CHIPS, type SessionBucket } from "@/widgets/session-list";

import { sessionsHref } from "../model/sessions-href";

type ChipKey = (typeof SESSION_CHIPS)[SessionBucket][number]["key"];

export function SessionStatusChips({
  activeTab,
  activeChip,
}: {
  activeTab: SessionBucket;
  activeChip: ChipKey;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5">
      {SESSION_CHIPS[activeTab].map((chip) => {
        const selected = chip.key === activeChip;
        return (
          <Chip key={chip.key} asChild selected={selected} className="h-[34px]">
            <Link
              href={sessionsHref(activeTab, chip.key)}
              aria-current={selected ? "page" : undefined}
            >
              {chip.label}
            </Link>
          </Chip>
        );
      })}
    </div>
  );
}
