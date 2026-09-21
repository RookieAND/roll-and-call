import { Avatar, HStack, Text, cn } from "@trpg/ui";
import { Check } from "lucide-react";

import { PARTICIPANT_STATUS } from "@/entities/game";

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
    capped && !joined
      ? "남은 자리를 모두 채웠습니다"
      : (candidate.bio ?? "소개를 아직 쓰지 않았습니다");

  // ponytail: 행 전체가 체크박스라 @trpg/ui에 맞는 프리미티브가 없다. 체크 표시만 손으로 그린다.
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
      <Avatar src={candidate.avatarUrl} name={candidate.username} size="md" className="h-9 w-9" />
      <div className={cn("min-w-0 flex-1", joined && "text-hint")}>
        <HStack align="center" gap="075" render={<span />} className="min-w-0">
          <Text truncate typography="subtitle2" foreground={joined ? "inherit" : "normal"}>
            {candidate.username}
          </Text>
          <CandidateStatusTag status={candidate.status} />
        </HStack>
        <Text
          truncate
          typography="body4"
          foreground="muted"
          className={cn("mt-025 block", (joined || (!candidate.bio && !capped)) && "text-hint")}
        >
          {note}
        </Text>
      </div>
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
