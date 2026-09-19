"use client";

import { Button, VStack } from "@trpg/ui";
import { useState } from "react";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { ConfirmedRosterSheet } from "./confirmed-roster-sheet";
import { LotteryRosterSheet } from "./lottery-roster-sheet";
import type { RosterSheetGm } from "./roster-gm-group";
import { RosterGroupSection } from "./roster-group-section";
import type { DetailRosterMember } from "./roster-member-row";
import { WaitingRosterSheet } from "./waiting-roster-sheet";

type RosterSheetName = "lottery" | "confirmed" | "waiting";

export function GameRosterSection({
  gm,
  confirmed,
  waiting,
  maxPlayers,
  recruitMethod,
  drawn,
  showWaiting,
  viewerId,
}: {
  gm: RosterSheetGm;
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  recruitMethod: RecruitMethod;
  drawn: boolean;
  showWaiting: boolean;
  viewerId: string | null;
}) {
  const [openSheet, setOpenSheet] = useState<RosterSheetName | null>(null);
  // 추첨은 뽑기 전까지 확정과 대기를 가르지 않는다 — 한 덩어리의 "신청"으로 본다.
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery && !drawn;
  const hasMembers = confirmed.length + waiting.length > 0;
  const viewerWaiting = waiting.find((member) => member.userId === viewerId);

  function closeSheet(next: boolean) {
    if (!next) setOpenSheet(null);
  }

  // GM도 상세에서는 읽기만 한다. 승격·강등은 운영 관리가 맡는다.
  const rosterAction = hasMembers && (
    <Button
      variant="ghost"
      size="sm"
      className="text-primary-ink"
      onClick={() => setOpenSheet(isLottery ? "lottery" : "confirmed")}
    >
      명단 보기
    </Button>
  );

  return (
    <VStack gap={5}>
      {isLottery ? (
        <RosterGroupSection
          label="신청"
          members={[...confirmed, ...waiting]}
          capacity={maxPlayers}
          action={rosterAction}
          emptyText="아직 신청자가 없어요."
        />
      ) : (
        <>
          <RosterGroupSection
            label="참여자"
            members={confirmed}
            capacity={maxPlayers}
            action={rosterAction}
            emptyText="아직 참여자가 없어요."
          />
          {showWaiting && waiting.length > 0 && (
            <RosterGroupSection
              label="대기"
              members={waiting}
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-ink"
                  onClick={() => setOpenSheet("waiting")}
                >
                  명단 보기
                </Button>
              }
              note={
                viewerWaiting
                  ? `내 순번 ${viewerWaiting.waitlistRank}번 · 자리가 나면 순서대로 확정됩니다.`
                  : undefined
              }
            />
          )}
        </>
      )}

      <LotteryRosterSheet
        open={openSheet === "lottery"}
        onOpenChange={closeSheet}
        gm={gm}
        applicants={[...confirmed, ...waiting]}
        viewerId={viewerId}
      />
      <ConfirmedRosterSheet
        open={openSheet === "confirmed"}
        onOpenChange={closeSheet}
        gm={gm}
        confirmed={confirmed}
        viewerId={viewerId}
      />
      <WaitingRosterSheet
        open={openSheet === "waiting"}
        onOpenChange={closeSheet}
        waiting={waiting}
        viewerId={viewerId}
      />
    </VStack>
  );
}
