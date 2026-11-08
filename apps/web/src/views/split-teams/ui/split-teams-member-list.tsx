import { Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { SplitCandidate } from "../model/split-candidate";
import { SplitTeamsMemberRow } from "./split-teams-member-row";

interface SplitTeamsMemberListProps {
  candidates: SplitCandidate[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function SplitTeamsMemberList({
  candidates,
  selectedIds,
  onChange,
}: SplitTeamsMemberListProps) {
  const allSelected = selectedIds.length === candidates.length;
  const toggleAllLabel = allSelected ? "전체 해제" : "전체 선택";

  function toggleAll() {
    onChange(allSelected ? [] : candidates.map((candidate) => candidate.userId));
  }

  function toggle(userId: string, checked: boolean) {
    // 고른 순서가 아니라 명단 순서를 지킨다.
    const next = new Set(selectedIds);
    if (checked) next.add(userId);
    else next.delete(userId);
    onChange(
      candidates
        .map((candidate) => candidate.userId)
        .filter((candidateId) => next.has(candidateId)),
    );
  }

  return (
    <VStack gap="100">
      <HStack align="center" justify="between" gap="100">
        <Text typography="body4" weight="bold" foreground="muted">
          참여자 {selectedIds.length}명
        </Text>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {toggleAllLabel}
        </Button>
      </HStack>
      <Card.Root
        padding="none"
        radius={500}
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
      >
        {candidates.map((candidate) => (
          <SplitTeamsMemberRow
            key={candidate.userId}
            candidate={candidate}
            checked={selectedIds.includes(candidate.userId)}
            onToggle={(checked) => toggle(candidate.userId, checked)}
          />
        ))}
      </Card.Root>
    </VStack>
  );
}
