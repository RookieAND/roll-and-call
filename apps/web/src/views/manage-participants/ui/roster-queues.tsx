"use client";

import { Badge, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import {
  DirectConfirmButton,
  MarkAbsentDialog,
  MemberSheet,
  type MemberSummary,
} from "@/features/adjust-roster";
import { toKst } from "@/shared/lib";
import { ExpandableRows } from "@/shared/ui";

import { confirmedHintLines } from "../model/confirmed-hint-lines";
import { confirmedRowNote } from "../model/confirmed-row-note";
import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { waitingHintLines } from "../model/waiting-hint-lines";
import { DrawResultLink } from "./draw-result-link";
import { RosterHint } from "./roster-hint";
import { RosterQueue } from "./roster-queue";
import { RosterRow } from "./roster-row";
import { RosterRowAction } from "./roster-row-action";
import { UnsubmittedNote } from "./unsubmitted-note";

interface RosterQueuesProps {
  gameId: string;
  confirmedRows: ManagedMember[];
  confirmedCount: number;
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
}

// 뽑기 전에는 대기 자리에 순번 없는 신청자가 선다. 먼저 신청한 사람이 유리해 보이지 않게 한다.
// 불참으로 내보낸 사람은 확정 목록에 남지만 확정 수에는 세지 않는다.
export function RosterQueues({
  gameId,
  confirmedRows,
  confirmedCount,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
}: RosterQueuesProps) {
  const [menuMember, setMenuMember] = useState<ManagedMember | null>(null);
  const [absentMember, setAbsentMember] = useState<MemberSummary | null>(null);
  const { beforeDraw, started, capacityRaised } = summary;

  const rowAction = (member: ManagedMember) => (
    <RosterRowAction
      member={member}
      started={started}
      onOpenMenu={setMenuMember}
      onMarkAbsent={setAbsentMember}
    />
  );
  const waitingCaption = summary.drawn ? "추첨으로 정해진 순서" : "신청 순서";
  const addDisabled = started && summary.isFull && capacityRaised;

  return (
    <VStack gap="250">
      <RosterQueue
        label="확정"
        count={confirmedCount}
        tag={summary.hasDrawResult && <DrawResultLink gameId={gameId} />}
        trailing={
          <DirectConfirmButton
            gameId={gameId}
            confirmedCount={confirmedCount}
            maxPlayers={maxPlayers}
            started={started}
            capacityRaised={capacityRaised}
            disabled={addDisabled}
          />
        }
        footnote={
          <>
            <RosterHint lines={confirmedHintLines(summary)} />
            {summary.unsubmittedCount > 0 && <UnsubmittedNote count={summary.unsubmittedCount} />}
          </>
        }
        emptyState={
          confirmedRows.length === 0 && (
            <VStack gap="075">
              <Text typography="subtitle2" weight="bold">
                아직 확정한 참여자가 없습니다
              </Text>
              {beforeDraw && (
                <Text typography="body4" foreground="muted" render={<p />}>
                  {maxPlayers}자리 모두 추첨으로 정해집니다.
                </Text>
              )}
            </VStack>
          )
        }
      >
        {confirmedRows.map((member) => {
          const note = confirmedRowNote({ member, isCoordinate, started });
          return (
            <RosterRow
              key={member.userId}
              member={member}
              note={note.text}
              noteForeground={note.foreground}
              badge={member.removed && <Badge colorPalette="danger">불참</Badge>}
              dimmed={member.removed}
              action={rowAction(member)}
            />
          );
        })}
      </RosterQueue>

      {waiting.length > 0 && (
        <RosterQueue
          label={beforeDraw ? "신청자" : "대기"}
          count={waiting.length}
          trailing={
            <Text typography="body4" foreground="hint">
              {waitingCaption}
            </Text>
          }
          footnote={<RosterHint lines={waitingHintLines(summary)} />}
        >
          <ExpandableRows>
            {waiting.map((member) => (
              <RosterRow
                key={member.userId}
                member={member}
                rank={beforeDraw ? null : member.waitlistRank}
                note={`${toKst(member.joinedAt).format("M월 D일 HH:mm:ss")} 신청`}
                noteForeground="hint"
                action={rowAction(member)}
              />
            ))}
          </ExpandableRows>
        </RosterQueue>
      )}

      <MemberSheet
        gameId={gameId}
        member={menuMember}
        confirmedCount={confirmedCount}
        waitingCount={waiting.length}
        maxPlayers={maxPlayers}
        isCoordinate={isCoordinate}
        beforeDraw={beforeDraw}
        started={started}
        capacityRaised={capacityRaised}
        onMarkAbsent={setAbsentMember}
        onClose={() => setMenuMember(null)}
      />
      <MarkAbsentDialog
        gameId={gameId}
        member={absentMember}
        onClose={() => setAbsentMember(null)}
      />
    </VStack>
  );
}
