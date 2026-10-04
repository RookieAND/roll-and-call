import { Badge, Checkbox, cn } from "@roll-and-call/ui";
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

export function CandidateRow({ candidate, picked, capped, onToggle }: CandidateRowProps) {
  const joined = candidate.status === PARTICIPANT_STATUS.confirmed;
  const sanctioned = candidate.sanctioned === true;
  const disabled = joined || capped || sanctioned;

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
      {sanctioned ? (
        <Badge className="flex-none">활동 정지 중</Badge>
      ) : (
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
      )}
    </label>
  );
}
