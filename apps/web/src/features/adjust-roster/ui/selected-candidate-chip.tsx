import { X } from "lucide-react";

import type { Candidate } from "../model/candidate";

interface SelectedCandidateChipProps {
  candidate: Candidate;
  onRemove: () => void;
}

export function SelectedCandidateChip({ candidate, onRemove }: SelectedCandidateChipProps) {
  return (
    <button
      type="button"
      aria-label={`${candidate.username} 선택 해제`}
      onClick={onRemove}
      className="inline-flex h-[30px] items-center gap-075 rounded-full bg-primary-50 pr-075 pl-125 text-body4 font-bold text-tinted-ink"
    >
      {candidate.username}
      <X size={14} aria-hidden />
    </button>
  );
}
