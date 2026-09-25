import { Badge, HStack, Table, Text } from "@roll-and-call/ui";
import { Ban, CircleCheck } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import type { UserRow } from "@/shared/server";
import { EMPTY_IMAGE, IconBadge, TableEmptyRow } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;

interface UsersTableProps {
  rows: UserRow[];
}

export function UsersTable({ rows }: UsersTableProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[180px]" />
        <col className="w-[132px]" />
        <col className="w-[74px]" />
        <col className="w-[82px]" />
        <col className="w-[120px]" />
        <col className="w-[82px]" />
        <col className="w-[98px]" />
        <col className="w-[132px]" />
        <col />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>가입일</Table.Head>
          <Table.Head align="end">연 세션</Table.Head>
          <Table.Head align="end">참여 세션</Table.Head>
          <Table.Head align="end">최근 3개월 불참</Table.Head>
          <Table.Head align="end">인증 룰북</Table.Head>
          <Table.Head align="center">상태</Table.Head>
          <Table.Head>제재 종료</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <TableEmptyRow colSpan={9} image={EMPTY_IMAGE.search} title="조건에 맞는 유저가 없어요" />
        ) : null}
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
                  {formatDate(row.joinedAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.hostedCount}회
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.playedCount}회
              </Table.Cell>
              <Table.Cell align="end" numeric>
                <Text
                  typography="body3"
                  weight={frequentNoShow ? "bold" : undefined}
                  foreground={frequentNoShow ? "danger" : "normal"}
                >
                  {row.recentNoShowCount}회
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                {row.certifiedCount}개
              </Table.Cell>
              <Table.Cell align="center">
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
                    {row.sanctionUntil ? formatDate(row.sanctionUntil) : "무기한"}
                  </Text>
                ) : (
                  <Text typography="body3" foreground="hint">
                    —
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
