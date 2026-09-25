import { Table, Text } from "@roll-and-call/ui";
import Link from "next/link";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { EMPTY_IMAGE, TableEmptyRow } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;
const COLUMN_COUNT = 5;

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

// 참여자 탭과 대기자 탭이 같은 표를 쓴다. 마지막 열만 불참 횟수와 대기 순번으로 갈리고, 행을 누르면 유저 상세로 간다.
export function MemberPanel({ members, waiting = false }: MemberPanelProps) {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col className="w-[160px]" />
        <col className="w-[180px]" />
        <col className="w-[180px]" />
        <col className="w-[96px]" />
        <col />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>닉네임</Table.Head>
          <Table.Head>디스코드 ID</Table.Head>
          <Table.Head>신청 일시</Table.Head>
          {waiting ? (
            <Table.Head align="center">대기 순번</Table.Head>
          ) : (
            <Table.Head align="end">불참 횟수</Table.Head>
          )}
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.length === 0 ? (
          <TableEmptyRow
            colSpan={COLUMN_COUNT}
            image={EMPTY_IMAGE.party}
            {...EMPTY_COPY[waiting ? "waitlist" : "members"]}
          />
        ) : null}
        {members.map((member) => {
          const frequentNoShow =
            "recentNoShowCount" in member && member.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
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
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate>
                  @{member.discordHandle}
                </Text>
              </Table.Cell>
              <Table.Cell numeric>
                <Text typography="body3" foreground="muted">
                  {member.joinedAt ? formatDateTime(member.joinedAt) : "—"}
                </Text>
              </Table.Cell>
              {"queueOrder" in member ? (
                <Table.Cell align="center" numeric>
                  {member.queueOrder}
                </Table.Cell>
              ) : (
                <Table.Cell align="end" numeric>
                  <Text
                    typography="body3"
                    weight={frequentNoShow ? "bold" : undefined}
                    foreground={frequentNoShow ? "danger" : "normal"}
                  >
                    {member.recentNoShowCount}회
                  </Text>
                </Table.Cell>
              )}
              <Table.Cell />
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
