import { Badge, HStack, Table, Text } from "@roll-and-call/ui";
import { Ban, CircleCheck } from "lucide-react";
import Link from "next/link";

import { formatMonthDay } from "@/shared/lib";
import type { UserRow } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

import { formatIsoDate } from "../model/format-iso-date";

const NO_SHOW_WARNING_COUNT = 2;

interface UsersTableProps {
  rows: UserRow[];
}

export function UsersTable({ rows }: UsersTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col />
        <col className="w-[100px]" />
        <col className="w-[74px]" />
        <col className="w-[82px]" />
        <col className="w-[112px]" />
        <col className="w-[82px]" />
        <col className="w-[96px]" />
        <col className="w-[92px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>가입일</Table.Head>
          <Table.Head align="end">연 세션</Table.Head>
          <Table.Head align="end">참여 세션</Table.Head>
          <Table.Head align="end">최근 3개월 불참</Table.Head>
          <Table.Head align="end">인증 룰북</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>제재 종료</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => {
          const frequentNoShow = row.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
          return (
            <Table.Row key={row.id} interactive className="relative">
              <Table.Cell>
                <HStack align="center" gap="075">
                  <Text
                    typography="body3"
                    weight="bold"
                    truncate
                    render={<Link href={`/users/${row.id}`} />}
                    className="after:absolute after:inset-0"
                  >
                    {row.nickname}
                  </Text>
                  {row.isNew ? <Badge colorPalette="primary">신규</Badge> : null}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint">
                  {formatIsoDate(row.joinedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.hostedCount}
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.playedCount}
              </Table.Cell>
              <Table.Cell align="end" numeric>
                <Text
                  typography="body3"
                  weight={frequentNoShow ? "bold" : undefined}
                  foreground={frequentNoShow ? "danger" : "normal"}
                >
                  {row.recentNoShowCount}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.certifiedCount}
              </Table.Cell>
              <Table.Cell>
                {row.sanctioned ? (
                  <IconBadge icon={Ban} colorPalette="danger">
                    제재 중
                  </IconBadge>
                ) : (
                  <IconBadge icon={CircleCheck} colorPalette="gray">
                    정상
                  </IconBadge>
                )}
              </Table.Cell>
              <Table.Cell>
                {row.sanctioned ? (
                  <Text typography="body3" foreground="danger">
                    {row.sanctionUntil ? formatMonthDay(row.sanctionUntil) : "무기한"}
                  </Text>
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
