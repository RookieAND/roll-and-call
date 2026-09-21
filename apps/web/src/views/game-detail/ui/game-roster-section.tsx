"use client";

import { VStack } from "@trpg/ui";
import { useState } from "react";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { ConfirmedRosterSheet } from "./confirmed-roster-sheet";
import { LotteryRosterSheet } from "./lottery-roster-sheet";
import type { RosterSheetGm } from "./roster-gm-group";
import { RosterGroupSection } from "./roster-group-section";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetButton } from "./roster-sheet-button";
import { WaitingRosterSheet } from "./waiting-roster-sheet";

type RosterSheetName = "lottery" | "confirmed" | "waiting";

interface GameRosterSectionProps {
  gm: RosterSheetGm;
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  recruitMethod: RecruitMethod;
  drawn: boolean;
  showWaiting: boolean;
  viewerId: string | null;
}

export function GameRosterSection({
  gm,
  confirmed,
  waiting,
  maxPlayers,
  recruitMethod,
  drawn,
  showWaiting,
  viewerId,
}: GameRosterSectionProps) {
  const [openSheet, setOpenSheet] = useState<RosterSheetName | null>(null);
  // 추첨은 뽑기 전까지 대기에 순번이 없다 — 정원 밖 줄을 "신청"으로 부른다.
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery && !drawn;

  const confirmedEmptyText = isLottery ? undefined : "아직 참여자가 없습니다.";

  function closeSheet(next: boolean) {
    if (!next) setOpenSheet(null);
  }

  // GM도 상세에서는 읽기만 한다. 승격·강등은 운영 관리가 맡는다.
  return (
    <>
      <VStack gap="200" render={<section />} className="divide-y divide-gray-200 [&>*+*]:pt-200">
        <RosterGroupSection
          label="참여"
          members={confirmed}
          capacity={maxPlayers}
          action={
            confirmed.length > 0 && <RosterSheetButton onClick={() => setOpenSheet("confirmed")} />
          }
          emptyText={confirmedEmptyText}
        />
        {isLottery && (
          <RosterGroupSection
            label="신청"
            members={waiting}
            action={
              waiting.length > 0 && <RosterSheetButton onClick={() => setOpenSheet("lottery")} />
            }
            emptyText="아직 신청자가 없습니다."
          />
        )}
        {!isLottery && showWaiting && waiting.length > 0 && (
          <RosterGroupSection
            label="대기"
            members={waiting}
            action={<RosterSheetButton onClick={() => setOpenSheet("waiting")} />}
          />
        )}
      </VStack>

      <LotteryRosterSheet
        open={openSheet === "lottery"}
        onOpenChange={closeSheet}
        gm={gm}
        applicants={waiting}
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
    </>
  );
}
