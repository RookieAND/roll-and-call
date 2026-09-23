import { Checkbox, cn } from "@roll-and-call/ui";
import { Check } from "lucide-react";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { EMPTY_BIO_TEXT, ProfileRow } from "@/entities/profile";

import type { Candidate } from "../model/candidate";
import { CandidateStatusTag } from "./candidate-status-tag";

interface CandidateRowProps {
  candidate: Candidate;
  picked: boolean;
  capped: boolean;
  onToggle: () => void;
}

// 사람은 닉네임과 한 줄 소개로만 가린다. 이미 확정된 사람은 고를 수 없다. 행 전체가 체크박스의 라벨이다.
export function CandidateRow({ candidate, picked, capped, onToggle }: CandidateRowProps) {
  const joined = candidate.status === PARTICIPANT_STATUS.confirmed;
  const disabled = joined || capped;

  return (
    <label
      className={cn(
        "flex min-h-15 items-center gap-125 px-175 py-100",
        picked && "bg-tinted-bg",
        disabled ? "opacity-55" : "cursor-pointer hover:bg-gray-50",
      )}
    >
      <ProfileRow
        name={candidate.username}
        avatarUrl={candidate.avatarUrl}
        nameAddon={<CandidateStatusTag status={candidate.status} />}
        subline={candidate.bio ?? EMPTY_BIO_TEXT}
        sublineForeground="hint"
      />
      <Checkbox.Root
        checked={picked || joined}
        disabled={disabled}
        onCheckedChange={onToggle}
        aria-label={candidate.username}
      >
        <Checkbox.Indicator>
          <Check size={14} strokeWidth={3} aria-hidden />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </label>
  );
}
