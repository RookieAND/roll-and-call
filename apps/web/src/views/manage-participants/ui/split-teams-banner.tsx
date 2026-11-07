"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { useState } from "react";

import type { SplitCandidate } from "../model/split-candidate";
import { SplitTeamsSheet } from "./split-teams-sheet";

interface SplitTeamsBannerProps {
  gameId: string;
  gameTitle: string;
  candidates: SplitCandidate[];
  // 추첨·선발 판정 전이면 대기 자리에 신청자가 선다.
  beforeResult: boolean;
  carriesApplicationNote: boolean;
}

export function SplitTeamsBanner({
  gameId,
  gameTitle,
  candidates,
  beforeResult,
  carriesApplicationNote,
}: SplitTeamsBannerProps) {
  const [open, setOpen] = useState(false);
  const countLabel = `${beforeResult ? "신청" : "대기"} ${candidates.length}명`;

  return (
    <>
      <Callout.Root colorPalette="primary" variant="outline">
        <Callout.Icon />
        <Callout.Title>{countLabel}으로 팀 나누기</Callout.Title>
        <Callout.Description>
          대기자를 새 구인으로 나누어 따로 진행할 수 있습니다.
        </Callout.Description>
        <Callout.Action>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            팀 나누기
          </Button>
        </Callout.Action>
      </Callout.Root>
      <SplitTeamsSheet
        open={open}
        onOpenChange={setOpen}
        gameId={gameId}
        gameTitle={gameTitle}
        countLabel={countLabel}
        candidates={candidates}
        carriesApplicationNote={carriesApplicationNote}
      />
    </>
  );
}
