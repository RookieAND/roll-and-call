import { Chip } from "@roll-and-call/ui";
import { X } from "lucide-react";

import type { Candidate } from "../model/candidate";

interface SelectedCandidateChipProps {
  candidate: Candidate;
  onRemove: () => void;
}

export function SelectedCandidateChip({ candidate, onRemove }: SelectedCandidateChipProps) {
  return (
    <Chip shape="pill" selected aria-label={`${candidate.username} 선택 해제`} onClick={onRemove}>
      {candidate.username}
      <X size={14} aria-hidden />
    </Chip>
  );
}
