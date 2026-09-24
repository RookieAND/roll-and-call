import { HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { GrantCandidate } from "@/shared/server";
import { PICK_STATE, PickButton } from "@/shared/ui";

interface GrantCandidateRowProps {
  candidate: GrantCandidate;
  selected: boolean;
  onToggle: () => void;
}

const metaOf = (candidate: GrantCandidate) => {
  if (candidate.state === "certified" && candidate.approvedAt) {
    return `${formatDate(candidate.approvedAt)} 인증`;
  }
  if (candidate.state === "pending" && candidate.appliedAt) {
    return `${formatDate(candidate.appliedAt)}에 신청한 심사가 대기 중입니다`;
  }
  const sessions = `최근 90일 세션 ${candidate.recentSessionCount}회`;
  return candidate.hasApplied ? sessions : `신청 기록이 없습니다 · ${sessions}`;
};

const pickStateOf = (candidate: GrantCandidate, selected: boolean) => {
  if (candidate.state === "certified") return PICK_STATE.done;
  return selected ? PICK_STATE.picked : PICK_STATE.open;
};

export function GrantCandidateRow({ candidate, selected, onToggle }: GrantCandidateRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className="border-t border-(--rc-color-border-subtle) px-150 py-125 first:border-t-0"
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight="medium" truncate>
          {candidate.nickname}
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          {metaOf(candidate)}
        </Text>
      </VStack>
      <PickButton state={pickStateOf(candidate, selected)} onClick={onToggle} />
    </HStack>
  );
}
