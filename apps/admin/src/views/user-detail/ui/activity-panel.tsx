import { Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { UserDetail } from "@/entities/user/server";
import { formatFullSessionTime, paginate, parsePageSize } from "@/shared/lib";
import {
  EMPTY_IMAGE,
  ListPager,
  Panel,
  ServerLink,
  TableEmptyRow,
  TableColumns,
  Tag,
  UrlSelect,
  TABLE_COLUMN,
  EmptyDash,
} from "@/shared/ui";

import { ACTIVITY_ROLE, type ActivityRole } from "../model/activity-role";

interface ActivityPanelProps {
  activities: UserDetail["activities"];
  role: ActivityRole;
  page?: string;
  pageSize?: string;
}

export function ActivityPanel({
  activities,
  role,
  page,
  pageSize: pageSizeParam,
}: ActivityPanelProps) {
  const rows =
    role === ACTIVITY_ROLE.all
      ? activities
      : activities.filter((activity) => activity.hosted === (role === ACTIVITY_ROLE.hosted));
  const pageSize = parsePageSize(pageSizeParam);
  const paged = paginate(rows, page, pageSize);
  return (
    <Panel
      right={
        <UrlSelect
          param="role"
          allLabel="전체"
          options={[
            { label: "연 세션", value: ACTIVITY_ROLE.hosted },
            { label: "참여 세션", value: ACTIVITY_ROLE.played },
          ]}
          className="w-[132px] **:data-[slot=select-trigger]:h-8 **:data-[slot=select-trigger]:min-h-8"
        />
      }
      footer={
        <ListPager
          page={paged.page}
          totalPages={paged.totalPages}
          total={rows.length}
          unit="건"
          pageSize={pageSize}
        />
      }
    >
      <Table.Root className="table-equal">
        <TableColumns
          widths={[
            TABLE_COLUMN.dateTime,
            TABLE_COLUMN.badge,
            TABLE_COLUMN.title,
            TABLE_COLUMN.rulebook,
            TABLE_COLUMN.nickname,
            TABLE_COLUMN.badge,
            TABLE_COLUMN.chevron,
          ]}
        />
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head>역할</Table.Head>
            <Table.Head>세션</Table.Head>
            <Table.Head>룰북</Table.Head>
            <Table.Head>GM</Table.Head>
            <Table.Head aria-label="불참" />
            <Table.Head aria-hidden />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.length === 0 ? (
            <TableEmptyRow
              colSpan={7}
              image={EMPTY_IMAGE.party}
              title="아직 참여하거나 연 세션이 없습니다"
              description="세션에 참여하거나 구인을 열면 이곳에 기록됩니다."
            />
          ) : null}
          {paged.rows.map((activity) => (
            <Table.Row
              key={activity.sessionId}
              interactive
              className={activity.noShow?.cancelled ? "relative opacity-50" : "relative"}
            >
              <Table.Cell>
                <Text typography="body3" foreground="hint" numeric>
                  {formatFullSessionTime(activity.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Tag>{activity.hosted ? "GM" : "참여"}</Tag>
              </Table.Cell>
              <Table.Cell>
                <Text
                  typography="body3"
                  truncate
                  title={activity.title}
                  render={<ServerLink path={`/posts/${activity.sessionId}`} />}
                  className="after:absolute after:inset-0"
                >
                  {activity.title}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" title={activity.rulebook}>
                  {activity.rulebook}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {activity.hosted ? (
                  <EmptyDash />
                ) : (
                  <Text typography="body3" truncate title={activity.gmNickname}>
                    {activity.gmNickname}
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell>{activity.noShow ? <Tag>불참</Tag> : <EmptyDash />}</Table.Cell>
              <Table.Cell align="end">
                <ChevronRight size={16} aria-hidden className="inline text-hint" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
