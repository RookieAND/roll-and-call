"use client";

import { Card } from "@roll-and-call/ui";
import { useState } from "react";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { ROSTER_GAUGE } from "../model/roster-gauge";
import { ROSTER_SHEET, type RosterSheet } from "../model/roster-sheet";
import { ConfirmedRosterSheet } from "./confirmed-roster-sheet";
import { LotteryRosterSheet } from "./lottery-roster-sheet";
import type { RosterSheetGm } from "./roster-gm-group";
import { RosterGroupSection } from "./roster-group-section";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheetButton } from "./roster-sheet-button";
import { WaitingRosterSheet } from "./waiting-roster-sheet";

interface GameRosterSectionProps {
  gm: RosterSheetGm;
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  recruitMethod: RecruitMethod;
  drawn: boolean;
  viewerId: string | null;
}

export function GameRosterSection({
  gm,
  confirmed,
  waiting,
  maxPlayers,
  recruitMethod,
  drawn,
  viewerId,
}: GameRosterSectionProps) {
  const [openSheet, setOpenSheet] = useState<RosterSheet | null>(null);
  // 추첨은 뽑기 전까지 대기에 순번이 없다 — 정원 밖 줄을 "신청"으로 부른다.
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery && !drawn;

  function closeSheet(next: boolean) {
    if (!next) setOpenSheet(null);
  }

  // GM도 상세에서는 읽기만 한다. 승격·강등은 운영 관리가 맡는다.
  return (
    <>
      <Card.Root
        padding="md"
        radius={600}
        render={<section />}
        className="flex flex-col gap-175 [&>*+*]:border-t [&>*+*]:border-gray-200 [&>*+*]:pt-175"
      >
        <RosterGroupSection
          label="참여"
          gauge={ROSTER_GAUGE.capacity}
          members={confirmed}
          capacity={maxPlayers}
          action={
            confirmed.length > 0 && (
              <RosterSheetButton onClick={() => setOpenSheet(ROSTER_SHEET.confirmed)} />
            )
          }
          emptyText="아직 참여자가 없습니다."
        />
        {isLottery && (
          <RosterGroupSection
            label="신청"
            gauge={ROSTER_GAUGE.applicants}
            members={waiting}
            action={
              waiting.length > 0 && (
                <RosterSheetButton onClick={() => setOpenSheet(ROSTER_SHEET.lottery)} />
              )
            }
            emptyText="아직 신청자가 없습니다."
          />
        )}
        {!isLottery && waiting.length > 0 && (
          <RosterGroupSection
            label="대기"
            gauge={ROSTER_GAUGE.waiting}
            members={waiting}
            action={<RosterSheetButton onClick={() => setOpenSheet(ROSTER_SHEET.waiting)} />}
          />
        )}
      </Card.Root>

      <LotteryRosterSheet
        open={openSheet === ROSTER_SHEET.lottery}
        onOpenChange={closeSheet}
        gm={gm}
        applicants={waiting}
        viewerId={viewerId}
      />
      <ConfirmedRosterSheet
        open={openSheet === ROSTER_SHEET.confirmed}
        onOpenChange={closeSheet}
        gm={gm}
        confirmed={confirmed}
        viewerId={viewerId}
      />
      <WaitingRosterSheet
        open={openSheet === ROSTER_SHEET.waiting}
        onOpenChange={closeSheet}
        waiting={waiting}
        viewerId={viewerId}
      />
    </>
  );
}
