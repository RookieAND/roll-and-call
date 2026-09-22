import { Chip } from "@roll-and-call/ui";
import { X } from "lucide-react";

import type { Candidate } from "../model/candidate";

interface SelectedCandidateChipProps {
  candidate: Candidate;
  onRemove: () => void;
}

export function SelectedCandidateChip({ candidate, onRemove }: SelectedCandidateChipProps) {
  return (
    <Chip
      selected
      aria-label={`${candidate.username} 선택 해제`}
      onClick={onRemove}
      className="gap-075 pr-075 pl-125"
    >
      {candidate.username}
      <X size={14} aria-hidden />
    </Chip>
  );
}
