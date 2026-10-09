import { Button, Skeleton, Table, Text } from "@roll-and-call/ui";

import { LoadingRegion, Panel, TableColumns } from "@/shared/ui";

import { DiscordFrame } from "./discord-frame";

const SECTIONS = [
  { title: "모집 상태", columnLabel: "모집 단계", rows: 3 },
  { title: "룰 분류", columnLabel: "룰 분류", rows: 4 },
  { title: "플레이 유형", columnLabel: "플레이 유형", rows: 2 },
  { title: "구분", columnLabel: "구분", rows: 2 },
] as const;

export function ForumTagsLoading() {
  return (
    <DiscordFrame
      title="포럼 태그"
      active="/discord/tags"
      actions={<Button disabled>변경 저장</Button>}
    >
      <LoadingRegion label="포럼 태그를 불러오는 중입니다" className="max-w-[880px] gap-150">
        <Text typography="body3" foreground="muted">
          모집 상태와 룰 분류마다 디스코드 포럼 태그를 하나씩 연결합니다. 연결하지 않으면 해당
          태그는 붙지 않습니다.
        </Text>
        {SECTIONS.map(({ title, columnLabel, rows }) => (
          <Panel
            key={title}
            title={title}
            right={<Skeleton width={56} height={14} />}
            bodyClassName="p-0"
          >
            <Table.Root className="table-equal">
              <TableColumns widths={[200, { fixed: 192 }, { fixed: 96 }, { fixed: 204 }]} />
              <Table.Header>
                <Table.Row>
                  <Table.Head>{columnLabel}</Table.Head>
                  <Table.Head>연결된 태그</Table.Head>
                  <Table.Head>상태</Table.Head>
                  <Table.Head>태그 바꾸기</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array.from({ length: rows }, (_, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Skeleton width={96} height={14} />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton width={96} height={18} />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton width={56} height={18} />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton width={188} height={28} rounded={400} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Panel>
        ))}
      </LoadingRegion>
    </DiscordFrame>
  );
}
