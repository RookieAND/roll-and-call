import { Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { PostDetail } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;

const EMPTY_COPY = {
  members: {
    title: "확정된 참여자가 없습니다",
    description: "참가 신청이 확정되면 이곳에 표시됩니다.",
  },
  waitlist: {
    title: "대기자가 없습니다",
    description: "정원이 찬 뒤 대기 신청을 하면 이곳에 순서대로 표시됩니다.",
  },
} as const;

interface MemberPanelProps {
  members: PostDetail["members"] | PostDetail["waitlist"];
  waiting?: boolean;
}

// 참여자 탭과 대기자 탭이 같은 표를 쓴다. 대기자 표에만 대기 순번 열이 붙고, 행을 누르면 유저 상세로 간다.
export function MemberPanel({ members, waiting = false }: MemberPanelProps) {
  const columnCount = waiting ? 4 : 3;
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[180px]" />
        {waiting ? <col className="w-[104px]" /> : null}
        <col className="w-[120px]" />
        <col />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          {waiting ? <Table.Head align="center">대기 순번</Table.Head> : null}
          <Table.Head align="center">최근 3개월 불참</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.length === 0 ? (
          <TableEmptyRow
            colSpan={columnCount}
            image={EMPTY_IMAGE.party}
            {...EMPTY_COPY[waiting ? "waitlist" : "members"]}
          />
        ) : null}
        {members.map((member) => {
          const frequentNoShow = member.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
          return (
            <Table.Row key={member.userId} interactive className="relative">
              <Table.Cell>
                <Text
                  typography="body3"
                  weight="bold"
                  truncate
                  render={<Link href={`/users/${member.userId}`} />}
                  className="block after:absolute after:inset-0"
                >
                  {member.nickname}
                </Text>
              </Table.Cell>
              {"queueOrder" in member ? (
                <Table.Cell align="center">
                  <Text typography="body3" foreground="muted">
                    {member.queueOrder}번
                  </Text>
                </Table.Cell>
              ) : null}
              <Table.Cell align="center" numeric>
                <Text
                  typography="body3"
                  weight={frequentNoShow ? "bold" : undefined}
                  foreground={frequentNoShow ? "danger" : "normal"}
                >
                  {member.recentNoShowCount}회
                </Text>
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
