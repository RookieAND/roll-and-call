"use client";

import { Card, Text } from "@trpg/ui";

import type { SessionWindow } from "@/entities/availability";

import { SessionCandidateRow } from "./session-candidate-row";

export function SessionCandidateList({
  candidates,
  playMinutes,
  respondents,
  onPick,
}: {
  candidates: SessionWindow[];
  playMinutes: number;
  respondents: string[];
  onPick: (iso: string) => void;
}) {
  return (
    <>
      <Card radius={500} background="none" padding="none" className="overflow-hidden">
        {candidates.map((candidate) => (
          <SessionCandidateRow
            key={candidate.iso}
            candidate={candidate}
            playMinutes={playMinutes}
            absentNames={respondents.filter((name) => !candidate.members.includes(name))}
            onPick={onPick}
          />
        ))}
      </Card>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
        체크를 누르면 위 세션 시간 칸이 그 시간으로 채워집니다.
      </Text>
    </>
  );
}
