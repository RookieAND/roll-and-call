"use client";

import { RadioCard, RadioGroup } from "@roll-and-call/ui";

import type { SessionWindow } from "@/entities/availability";

import { sessionWindowLabel } from "../model/session-window-label";

interface SessionCandidateListProps {
  candidates: SessionWindow[];
  playMinutes: number;
  respondents: string[];
  // 위 입력 칸이 후보와 같은 시각이면 그 후보가 골라진 것으로 보인다.
  value: string | null;
  onPick: (iso: string) => void;
}

export function SessionCandidateList({
  candidates,
  playMinutes,
  respondents,
  value,
  onPick,
}: SessionCandidateListProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(iso) => onPick(iso as string)}
      aria-label="추천 후보"
      className="flex flex-col gap-100"
    >
      {candidates.map((candidate) => {
        const absent = respondents.filter((name) => !candidate.members.includes(name));
        const everyone = absent.length === 0;
        return (
          <RadioCard.Root key={candidate.iso} value={candidate.iso} indicator="radio">
            <RadioCard.Title>{sessionWindowLabel(candidate.iso, playMinutes)}</RadioCard.Title>
            <RadioCard.Description className={everyone ? "text-success-700" : undefined}>
              {everyone
                ? `${candidate.members.length}명 전원 가능`
                : `${candidate.members.length}명 가능 · ${absent.join(", ")} 불가`}
            </RadioCard.Description>
            <RadioCard.Indicator />
          </RadioCard.Root>
        );
      })}
    </RadioGroup>
  );
}
