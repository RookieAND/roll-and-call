import { Badge, Button, Table, Text } from "@roll-and-call/ui";
import { Users } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import type { CertifiedGm } from "@/shared/server";
import { EmptyState, Panel } from "@/shared/ui";

interface CertifiedGmPanelProps {
  gms: CertifiedGm[];
}

export function CertifiedGmPanel({ gms }: CertifiedGmPanelProps) {
  return (
    <Panel
      title="이 룰북으로 인증된 GM"
      right={<Badge colorPalette="gray">{gms.length}명</Badge>}
      className="flex-1"
    >
      {gms.length === 0 ? (
        <EmptyState icon={Users} title="인증된 GM이 없어요" />
      ) : (
        <Table.Root className="table-fixed">
          <colgroup>
            <col />
            <col className="w-[120px]" />
            <col className="w-[130px]" />
            <col className="w-[110px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>닉네임</Table.Head>
              <Table.Head>인증일</Table.Head>
              <Table.Head align="end">최근 90일 세션</Table.Head>
              <Table.Head>
                <span className="sr-only">유저 상세</span>
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {gms.map((gm) => (
              <Table.Row key={gm.userId}>
                <Table.Cell>
                  <Text typography="body3" weight="bold" truncate>
                    {gm.nickname}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground="hint">
                    {formatDate(gm.approvedAt)}
                  </Text>
                </Table.Cell>
                <Table.Cell align="end" numeric>
                  {gm.recentSessionCount}
                </Table.Cell>
                <Table.Cell align="end">
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    size="sm"
                    render={<Link href={`/users/${gm.userId}`} />}
                  >
                    유저 상세
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Panel>
  );
}
