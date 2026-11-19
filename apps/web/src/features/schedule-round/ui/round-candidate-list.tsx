"use client";

import { Button, Text, VStack } from "@roll-and-call/ui";

import type { RoundCandidate } from "../model/round-candidate";

interface RoundCandidateListProps {
  candidates: readonly RoundCandidate[];
  startsAt: string;
  endsAt: string;
  onPick: (candidate: RoundCandidate) => void;
}

export function RoundCandidateList({
  candidates,
  startsAt,
  endsAt,
  onPick,
}: RoundCandidateListProps) {
  return (
    <VStack gap="100">
      <Text typography="body3" weight="bold">
        겹치는 시간 상위 3개
      </Text>
      {candidates.map((candidate) => {
        const selected = candidate.startsAt === startsAt && candidate.endsAt === endsAt;
        return (
          <Button
            key={candidate.startsAt}
            variant={selected ? "tinted" : "outline"}
            disabled={Boolean(candidate.conflictHint)}
            className="h-auto w-full justify-start py-100 text-left"
            onClick={() => onPick(candidate)}
          >
            <VStack>
              <Text typography="body3" weight="bold">
                {candidate.line}
              </Text>
              {candidate.conflictHint && (
                <Text typography="body4" foreground="hint">
                  {candidate.conflictHint}
                </Text>
              )}
            </VStack>
          </Button>
        );
      })}
    </VStack>
  );
}
