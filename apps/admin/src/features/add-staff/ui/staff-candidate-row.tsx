import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { StaffCandidate } from "@/shared/server";
import { PICK_STATE, PickButton } from "@/shared/ui";

interface StaffCandidateRowProps {
  candidate: StaffCandidate;
  selected: boolean;
  onToggle: () => void;
}

export function StaffCandidateRow({ candidate, selected, onToggle }: StaffCandidateRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className={cn(
        "border-t border-(--rc-color-border-subtle) px-150 py-125 first:border-t-0",
        selected && "bg-(--rc-color-bg-primary-weakest)",
      )}
    >
      <Text
        typography="body4"
        weight="bold"
        foreground="muted"
        aria-hidden
        className="grid size-[28px] shrink-0 place-items-center rounded-full bg-gray-200"
      >
        {candidate.nickname.slice(0, 1)}
      </Text>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight="bold" truncate>
          {candidate.nickname}
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          @{candidate.discordHandle} · {formatDate(candidate.joinedAt)} 가입
        </Text>
      </VStack>
      <PickButton state={selected ? PICK_STATE.picked : PICK_STATE.open} onClick={onToggle} />
    </HStack>
  );
}
