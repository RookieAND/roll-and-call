import { Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { Check } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { StaffCandidate } from "@/shared/server";

interface StaffCandidateRowProps {
  candidate: StaffCandidate;
  selected: boolean;
  onToggle: () => void;
}

export function StaffCandidateRow({ candidate, selected, onToggle }: StaffCandidateRowProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "h-auto w-full justify-start gap-125 rounded-none border-t border-(--rc-color-border-subtle) px-150 py-125 text-left font-normal",
        selected && "bg-(--rc-color-bg-primary-weakest) hover:bg-(--rc-color-bg-primary-weakest)",
      )}
    >
      <HStack align="center" justify="center" className="size-[18px] shrink-0 text-primary-600">
        {selected ? <Check size={18} aria-hidden /> : null}
      </HStack>
      <Text
        typography="body4"
        weight="bold"
        foreground="muted"
        aria-hidden
        className="grid size-7 shrink-0 place-items-center rounded-full bg-gray-200"
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
    </Button>
  );
}
