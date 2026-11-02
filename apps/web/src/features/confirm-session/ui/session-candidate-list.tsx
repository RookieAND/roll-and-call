"use client";

import { cn, RadioCard, RadioGroup } from "@roll-and-call/ui";

import type { SessionWindow } from "@/entities/availability";

import { abbreviatedNames } from "../model/abbreviated-names";
import { sessionWindowLabel } from "../model/session-window-label";

interface SessionCandidateListProps {
  candidates: SessionWindow[];
  playMinutes: number;
  respondents: string[];
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
          <RadioCard.Root
            key={candidate.iso}
            value={candidate.iso}
            indicator="radio"
            className="data-checked:border-primary-600 data-checked:bg-tinted-bg"
          >
            <RadioCard.Title className="in-data-checked:text-tinted-ink">
              {sessionWindowLabel({ iso: candidate.iso, playMinutes })}
            </RadioCard.Title>
            <RadioCard.Description
              className={cn(everyone && "text-success-700", "in-data-checked:text-tinted-ink")}
            >
              {everyone
                ? `${candidate.members.length}명 전원 가능`
                : `${candidate.members.length}명 가능 · ${abbreviatedNames(absent)} 불가`}
            </RadioCard.Description>
            <RadioCard.Indicator />
          </RadioCard.Root>
        );
      })}
    </RadioGroup>
  );
}
