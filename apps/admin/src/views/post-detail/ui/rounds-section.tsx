"use client";

import { Button, HStack, Table, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { TableColumns, TABLE_COLUMN, Tag } from "@/shared/ui";

import type { AdminRoundsView } from "../model/admin-rounds";
import { roundsBadges } from "../model/rounds-badges";
import { ContentSection } from "./content-section";
import { RoundAttendeeDialog } from "./round-attendee-dialog";
import { RoundRow } from "./round-row";
import { RoundSkipsPopover } from "./round-skips-popover";

const PAGE_SIZE = 10;

export function RoundsSection({ rounds }: { rounds: AdminRoundsView }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openRoundNo, setOpenRoundNo] = useState<number | null>(null);
  // 닫히는 동안에도 내용이 남도록 마지막으로 연 회차를 기억한다.
  const [shownRoundNo, setShownRoundNo] = useState<number | null>(null);
  const shownRound = rounds.rounds.find((round) => round.roundNo === shownRoundNo) ?? null;
  const open = (roundNo: number) => {
    setOpenRoundNo(roundNo);
    setShownRoundNo(roundNo);
  };
  return (
    <ContentSection
      title="회차"
      right={
        <HStack gap="050">
          {roundsBadges(rounds).map((label) => (
            <Tag key={label}>{label}</Tag>
          ))}
        </HStack>
      }
    >
      <Table.Root className="table-equal">
        <TableColumns
          widths={[
            TABLE_COLUMN.numberMid,
            TABLE_COLUMN.title,
            TABLE_COLUMN.badgeLong,
            TABLE_COLUMN.numberMid,
          ]}
        />
        <Table.Header>
          <Table.Row>
            <Table.Head>회차</Table.Head>
            <Table.Head>일시</Table.Head>
            <Table.Head>상태</Table.Head>
            <Table.Head align="end">출석</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rounds.rounds.slice(0, visibleCount).map((round) => (
            <RoundRow key={round.roundNo} round={round} now={rounds.now} onOpen={open} />
          ))}
        </Table.Body>
      </Table.Root>
      <VStack align="start" gap="050">
        {rounds.rounds.length > visibleCount && (
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            더 보기
          </Button>
        )}
        {rounds.skips.length > 0 && <RoundSkipsPopover skips={rounds.skips} />}
      </VStack>
      <RoundAttendeeDialog
        open={openRoundNo !== null}
        round={shownRound}
        onClose={() => setOpenRoundNo(null)}
      />
    </ContentSection>
  );
}
