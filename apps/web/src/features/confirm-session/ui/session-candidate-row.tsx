import { HStack, IconButton, Text } from "@trpg/ui";
import { Check } from "lucide-react";

import type { SessionWindow } from "@/entities/availability";

import { sessionWindowLabel } from "../model/session-window-label";

interface SessionCandidateRowProps {
  candidate: SessionWindow;
  playMinutes: number;
  absentNames: string[];
  onPick: (iso: string) => void;
}

export function SessionCandidateRow({
  candidate,
  playMinutes,
  absentNames,
  onPick,
}: SessionCandidateRowProps) {
  const everyone = absentNames.length === 0;
  const detail = everyone
    ? `${candidate.members.length}명 전원 가능`
    : `${candidate.members.length}명 가능 · ${absentNames.join(", ")} 불가`;
  const detailForeground = everyone ? "success" : "muted";

  return (
    <HStack
      align="center"
      gap="150"
      className="border-b border-gray-100 px-150 py-125 last:border-b-0"
    >
      <span className="min-w-0 flex-1">
        <Text numeric typography="subtitle2" className="block">
          {sessionWindowLabel(candidate.iso, playMinutes)}
        </Text>
        <Text typography="body4" foreground={detailForeground} className="block">
          {detail}
        </Text>
      </span>
      <IconButton
        variant="outline"
        aria-label="이 시간으로 채우기"
        className="shrink-0 rounded-500 border-primary-200 bg-primary-50 text-primary-ink hover:bg-primary-100"
        onClick={() => onPick(candidate.iso)}
      >
        <Check size={18} />
      </IconButton>
    </HStack>
  );
}
