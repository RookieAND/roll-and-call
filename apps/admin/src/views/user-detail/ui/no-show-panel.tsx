import { Table, Text } from "@roll-and-call/ui";

import { formatSessionTime, paginate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import {
  EMPTY_IMAGE,
  ListPager,
  NoShowStatusTag,
  Panel,
  TableColumns,
  TableEmptyRow,
} from "@/shared/ui";

import { noShowStatus } from "../model/no-show-status";
import { NoShowRowMenu } from "./no-show-row-menu";

interface NoShowPanelProps {
  noShows: UserDetail["noShows"];
  page?: string;
}

export function NoShowPanel({ noShows, page }: NoShowPanelProps) {
  const paged = paginate(noShows, page);
  return (
    <Panel
      footer={
        <ListPager
          page={paged.page}
          totalPages={paged.totalPages}
          total={noShows.length}
          unit="건"
        />
      }
    >
      <Table.Root className="table-equal">
        <TableColumns
          widths={[{ fixed: 192 }, 200, { fixed: 140 }, { fixed: 96 }, { fixed: 56 }]}
        />
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head>세션</Table.Head>
            <Table.Head>처리한 사람</Table.Head>
            <Table.Head align="center">상태</Table.Head>
            <Table.Head aria-label="더 보기" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {noShows.length === 0 ? (
            <TableEmptyRow
              colSpan={5}
              image={EMPTY_IMAGE.schedule}
              title="불참 기록이 없습니다"
              description="GM이 출석 확인에서 불참을 기록하면 이곳에 표시됩니다."
            />
          ) : null}
          {paged.rows.map((noShow) => (
            <Table.Row key={noShow.id} className={noShow.cancelled ? "opacity-50" : undefined}>
              <Table.Cell>
                <Text typography="body3" foreground="hint" numeric>
                  {formatSessionTime(noShow.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate title={noShow.sessionTitle}>
                  {noShow.sessionTitle}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate>
                  {noShow.recordedBy}
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
                <NoShowStatusTag status={noShowStatus(noShow)} />
              </Table.Cell>
              <Table.Cell align="end">
                <NoShowRowMenu recordId={noShow.id} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
