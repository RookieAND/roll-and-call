import { cn } from "@roll-and-call/ui";
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

// 사람은 닉네임과 한 줄 소개로만 가린다. 이미 확정된 사람은 고를 수 없다.
export function CandidateRow({ candidate, picked, capped, onToggle }: CandidateRowProps) {
  const joined = candidate.status === PARTICIPANT_STATUS.confirmed;
  const disabled = joined || capped;
  const note =
    capped && !joined ? "남은 자리를 모두 채웠습니다" : (candidate.bio ?? EMPTY_BIO_TEXT);
  const noteForeground = joined || (!candidate.bio && !capped) ? "hint" : "muted";

  // ponytail: 행 전체가 체크박스라 @roll-and-call/ui에 맞는 프리미티브가 없다. 체크 표시만 손으로 그린다.
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={picked || joined}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex min-h-[62px] w-full items-center gap-150 px-250 py-100 text-left enabled:hover:bg-gray-50",
        picked && "bg-gray-50",
        capped && !joined && "opacity-45",
      )}
    >
      <ProfileRow
        name={candidate.username}
        avatarUrl={candidate.avatarUrl}
        nameAddon={<CandidateStatusTag status={candidate.status} />}
        subline={note}
        sublineForeground={noteForeground}
        dimmed={joined}
      />
      <span
        aria-hidden
        className={cn(
          "flex size-[22px] shrink-0 items-center justify-center rounded-200 border-[1.5px] border-gray-200",
          picked && "border-primary-600 bg-primary-600 text-white",
          (joined || capped) && "border-0 bg-gray-200 text-gray-400",
        )}
      >
        {(picked || joined) && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}
