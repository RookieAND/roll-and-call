import { Table, Text } from "@roll-and-call/ui";

import { NoShowStatusTag } from "@/entities/no-show";
import type { UserDetail } from "@/entities/user/server";
import { formatFullSessionTime, paginate, parsePageSize, withQuery } from "@/shared/lib";
import {
  EMPTY_IMAGE,
  ListPager,
  Panel,
  ServerLink,
  TableColumns,
  TableEmptyRow,
  TABLE_COLUMN,
} from "@/shared/ui";

import { noShowStatus } from "../model/no-show-status";

interface NoShowPanelProps {
  noShows: UserDetail["noShows"];
  page?: string;
  pageSize?: string;
}

export function NoShowPanel({ noShows, page, pageSize: pageSizeParam }: NoShowPanelProps) {
  const pageSize = parsePageSize(pageSizeParam);
  const paged = paginate(noShows, page, pageSize);
  return (
    <Panel
      footer={
        <ListPager
          page={paged.page}
          totalPages={paged.totalPages}
          total={noShows.length}
          unit="건"
          pageSize={pageSize}
        />
      }
    >
      <Table.Root className="table-equal">
        <TableColumns
          widths={[
            TABLE_COLUMN.dateTime,
            TABLE_COLUMN.title,
            TABLE_COLUMN.staff,
            TABLE_COLUMN.badge,
          ]}
        />
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head>세션</Table.Head>
            <Table.Head>처리한 사람</Table.Head>
            <Table.Head>상태</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {noShows.length === 0 ? (
            <TableEmptyRow
              colSpan={4}
              image={EMPTY_IMAGE.schedule}
              title="불참 기록이 없습니다"
              description="GM이 출석 확인에서 불참을 기록하면 이곳에 표시됩니다."
            />
          ) : null}
          {paged.rows.map((noShow) => (
            <Table.Row
              key={noShow.id}
              interactive
              className={noShow.cancelled ? "relative opacity-50" : "relative"}
            >
              <Table.Cell>
                <Text typography="body3" foreground="hint" numeric>
                  {formatFullSessionTime(noShow.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text
                  typography="body3"
                  truncate
                  title={noShow.sessionTitle}
                  render={<ServerLink path={withQuery("/noshow", {}, { record: noShow.id })} />}
                  className="block after:absolute after:inset-0"
                >
                  {noShow.sessionTitle}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3">{noShow.recordedBy}</Text>
              </Table.Cell>
              <Table.Cell>
                <NoShowStatusTag status={noShowStatus(noShow)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
