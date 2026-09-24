import { Button, HStack, Table, Text, cn } from "@roll-and-call/ui";
import { Ban } from "lucide-react";
import Link from "next/link";

import { GuideDmButton } from "@/features/send-cert-guide-dm";
import type { GmCertRow } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

import { GmCertStateBadge } from "./gm-cert-state-badge";

const LIST_LIMIT = 2;

interface GmCertTableProps {
  rows: GmCertRow[];
}

// "크툴루의 부름 7판, 인세인 외 2개"
const listRulebooks = (rulebooks: string[]) =>
  rulebooks.length > LIST_LIMIT
    ? `${rulebooks.slice(0, LIST_LIMIT).join(", ")} 외 ${rulebooks.length - LIST_LIMIT}개`
    : rulebooks.join(", ");

export function GmCertTable({ rows }: GmCertTableProps) {
  const none = (
    <Text typography="body3" foreground="hint">
      없음
    </Text>
  );
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[190px]" />
        <col className="w-[120px]" />
        <col />
        <col className="w-[160px]" />
        <col className="w-[64px]" />
        <col className="w-[110px]" />
        <col className="w-[110px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>GM</Table.Head>
          <Table.Head align="end">최근 90일 세션</Table.Head>
          <Table.Head>인증 완료</Table.Head>
          <Table.Head>심사 대기 룰북</Table.Head>
          <Table.Head align="end">대기</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>
            <span className="sr-only">조치</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.userId} className={cn(row.state === "unapplied" && "bg-danger-50")}>
            <Table.Cell>
              <HStack align="center" gap="075" className="min-w-0">
                <Text typography="body3" weight="bold" truncate>
                  {row.nickname}
                </Text>
                {row.sanctioned ? (
                  <IconBadge icon={Ban} colorPalette="danger">
                    제재 중
                  </IconBadge>
                ) : null}
              </HStack>
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.recentSessionCount}
            </Table.Cell>
            <Table.Cell className="truncate">
              {row.certifiedRulebooks.length ? listRulebooks(row.certifiedRulebooks) : none}
            </Table.Cell>
            <Table.Cell className="truncate">
              {row.pending ? row.pending.rulebook : none}
            </Table.Cell>
            <Table.Cell align="end" numeric>
              {row.pending ? (
                <Text typography="body3" weight={row.pending.waitedDays >= 5 ? "bold" : undefined}>
                  {row.pending.waitedDays}일
                </Text>
              ) : (
                <Text typography="body3" foreground="hint">
                  —
                </Text>
              )}
            </Table.Cell>
            <Table.Cell>
              <GmCertStateBadge state={row.state} />
            </Table.Cell>
            <Table.Cell align="end">
              {row.state === "unapplied" ? (
                <GuideDmButton
                  userId={row.userId}
                  nickname={row.nickname}
                  disabled={row.sanctioned}
                />
              ) : null}
              {row.pending ? (
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={<Link href={`/cert/${row.pending.applicationId}`} />}
                >
                  심사하기
                </Button>
              ) : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
