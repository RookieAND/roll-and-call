import { Badge, HStack } from "@roll-and-call/ui";

import { GROUP_STATUS_BADGE } from "@/features/decide-cert";
import type { CertStatus } from "@/shared/server";

import { GROUP_STATUS_SHORT_LABEL, type GroupBookEntry } from "../model/group-books";
import { GroupBookChip } from "./group-book-chip";

interface GroupBookStatusGroupProps {
  status: CertStatus;
  books: GroupBookEntry[];
}

export function GroupBookStatusGroup({ status, books }: GroupBookStatusGroupProps) {
  const badge = GROUP_STATUS_BADGE[status];
  const shortLabel = GROUP_STATUS_SHORT_LABEL[status];

  return (
    <HStack align="start" gap="100" role="group" aria-label={`${shortLabel} ${books.length}권`}>
      <HStack className="w-22 shrink-0">
        <Badge colorPalette={badge.colorPalette}>{`${shortLabel} ${books.length}`}</Badge>
      </HStack>
      <HStack wrap gap="050" className="min-w-0 flex-1">
        {books.map((book) => (
          <GroupBookChip key={book.href} label={book.label} href={book.href} />
        ))}
      </HStack>
    </HStack>
  );
}
