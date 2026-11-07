import { Avatar, HStack, Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { listHomebrewQueue } from "@/entities/homebrew/server";
import { formatFullDateTime } from "@/shared/lib";
import { EMPTY_IMAGE, ServerLink, TableEmptyRow } from "@/shared/ui";

import { MakerQueueHead } from "./maker-queue-head";

interface MakerQueueTableProps {
  rows: Awaited<ReturnType<typeof listHomebrewQueue>>;
}

export function MakerQueueTable({ rows }: MakerQueueTableProps) {
  return (
    <Table.Root className="table-equal">
      <MakerQueueHead linked />
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow
            colSpan={4}
            image={EMPTY_IMAGE.myGames}
            title="심사할 자작 룰이 없습니다"
            description="새 신청이 들어오면 이 표에 쌓입니다."
          />
        ) : null}
        {rows.map((row) => (
          <Table.Row key={row.id} interactive className="relative">
            <Table.Cell>
              <HStack align="center" gap="100" className="min-w-0">
                <Avatar src={row.applicantAvatarUrl} name={row.applicantNickname} size="sm" />
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<ServerLink path={`/cert/maker/${row.id}`} />}
                  className="block after:absolute after:inset-0"
                >
                  {row.applicantNickname}
                </Text>
              </HStack>
            </Table.Cell>
            <Table.Cell>
              <HStack align="baseline" gap="075" className="min-w-0">
                <Text typography="body3" truncate title={row.name}>
                  {row.name}
                </Text>
                {row.edition ? (
                  <Text typography="body4" foreground="hint" className="flex-none">
                    {row.edition}
                  </Text>
                ) : null}
              </HStack>
            </Table.Cell>
            <Table.Cell numeric>{formatFullDateTime(row.appliedAt)}</Table.Cell>
            <Table.Cell align="end">
              <ChevronRight size={16} aria-hidden className="inline text-hint" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
