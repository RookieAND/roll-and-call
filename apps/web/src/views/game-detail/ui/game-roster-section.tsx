"use client";

import { Button, VStack } from "@trpg/ui";
import Link from "next/link";
import { useState } from "react";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { RosterGroupSection } from "./roster-group-section";
import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheet, type RosterSheetSection } from "./roster-sheet";

export function GameRosterSection({
  gameId,
  gm,
  confirmed,
  waiting,
  maxPlayers,
  recruitMethod,
  drawn,
  isGm,
  viewerId,
}: {
  gameId: string;
  gm: { userId: string; username?: string; avatarUrl?: string | null; bio?: string | null };
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  recruitMethod: RecruitMethod;
  drawn: boolean;
  isGm: boolean;
  viewerId: string | null;
}) {
  const [openSection, setOpenSection] = useState<RosterSheetSection | null>(null);
  // 추첨은 뽑기 전까지 확정과 대기를 가르지 않는다 — 한 덩어리의 "신청"으로 본다.
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery && !drawn;
  const hasMembers = confirmed.length + waiting.length > 0;
  const viewerWaiting = waiting.find((member) => member.userId === viewerId);

  const rosterAction = isGm ? (
    <Button asChild variant="ghost" size="sm" className="text-primary-ink">
      <Link href={`/games/${gameId}/participants`}>관리</Link>
    </Button>
  ) : (
    hasMembers && (
      <Button
        variant="ghost"
        size="sm"
        className="text-primary-ink"
        onClick={() => setOpenSection("confirmed")}
      >
        명단 보기
      </Button>
    )
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
          {waiting.length > 0 && (
            <RosterGroupSection
              label="대기"
              members={waiting}
              action={
                !isGm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-ink"
                    onClick={() => setOpenSection("waiting")}
                  >
                    명단 보기
                  </Button>
                )
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

      <RosterSheet
        open={openSection !== null}
        onOpenChange={(next) => !next && setOpenSection(null)}
        section={openSection ?? "confirmed"}
        gm={gm}
        confirmed={confirmed}
        waiting={waiting}
        isLottery={isLottery}
        viewerId={viewerId}
      />
    </VStack>
  );
}
