import { Button, Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { PostDetail } from "@/shared/server";
import { EmptyState } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;
const CONFIRMED = "확정";

interface MemberPanelProps {
  members: PostDetail["members"];
}

export function MemberPanel({ members }: MemberPanelProps) {
  if (members.length === 0) return <EmptyState title="참여자가 없어요" />;
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[200px]" />
        <col className="w-[120px]" />
        <col className="w-[130px]" />
        <col />
        <col className="w-[110px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>참여 상태</Table.Head>
          <Table.Head align="end">최근 3개월 불참</Table.Head>
          <Table.Head />
          <Table.Head>
            <span className="sr-only">유저 상세</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map((member) => {
          const frequentNoShow = member.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
          return (
            <Table.Row key={member.userId}>
              <Table.Cell>
                <Text typography="body3" weight="bold" truncate>
                  {member.nickname}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text
                  typography="body3"
                  foreground={member.state === CONFIRMED ? "normal" : "hint"}
                >
                  {member.state}
                </Text>
              </Table.Cell>
              <Table.Cell align="end" numeric>
                <Text
                  typography="body3"
                  weight={frequentNoShow ? "bold" : undefined}
                  foreground={frequentNoShow ? "danger" : "normal"}
                >
                  {member.recentNoShowCount}회
                </Text>
              </Table.Cell>
              <Table.Cell />
              <Table.Cell align="end">
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={<Link href={`/users/${member.userId}`} />}
                >
                  유저 상세
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
