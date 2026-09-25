import { Badge, Table, Text } from "@roll-and-call/ui";

import { formatSessionTime, paginate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EMPTY_IMAGE, ListPager, Panel, TableEmptyRow, UrlSelect, TableColumns } from "@/shared/ui";

import { ACTIVITY_ROLE, type ActivityRole } from "../model/activity-role";

interface ActivityPanelProps {
  activities: UserDetail["activities"];
  role: ActivityRole;
  page?: string;
}

export function ActivityPanel({ activities, role, page }: ActivityPanelProps) {
  const rows =
    role === ACTIVITY_ROLE.all
      ? activities
      : activities.filter((activity) => activity.hosted === (role === ACTIVITY_ROLE.hosted));
  const paged = paginate(rows, page);
  return (
    <Panel
      title={`활동 ${rows.length}건`}
      right={
        <UrlSelect
          param="role"
          allLabel="전체"
          options={[
            { label: "연 세션", value: ACTIVITY_ROLE.hosted },
            { label: "참여 세션", value: ACTIVITY_ROLE.played },
          ]}
          className="w-[132px] [&_[data-slot=select-trigger]]:h-[32px] [&_[data-slot=select-trigger]]:min-h-[32px]"
        />
      }
      footer={
        <ListPager page={paged.page} totalPages={paged.totalPages} total={rows.length} unit="건" />
      }
    >
      <Table.Root className="table-equal">
        <TableColumns widths={[192, 66, 200, 140, 100, 96]} />
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head align="center">역할</Table.Head>
            <Table.Head>세션</Table.Head>
            <Table.Head>룰북</Table.Head>
            <Table.Head>GM</Table.Head>
            <Table.Head aria-label="불참" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.length === 0 ? (
            <TableEmptyRow
              colSpan={6}
              image={EMPTY_IMAGE.party}
              title="아직 참여하거나 연 세션이 없습니다"
              description="세션에 참여하거나 구인을 열면 이곳에 기록됩니다."
            />
          ) : null}
          {paged.rows.map((activity) => (
            <Table.Row
              key={activity.sessionId}
              className={activity.noShow?.cancelled ? "opacity-50" : undefined}
            >
              <Table.Cell>
                <Text typography="body3" foreground="hint" numeric>
                  {formatSessionTime(activity.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
                {activity.hosted ? (
                  <Badge colorPalette="primary">GM</Badge>
                ) : (
                  <Badge colorPalette="gray">참여</Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate title={activity.title}>
                  {activity.title}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="muted" truncate>
                  {activity.rulebook}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate>
                  {activity.hosted ? "—" : activity.gmNickname}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {activity.noShow ? (
                  activity.noShow.cancelled ? (
                    <Badge colorPalette="gray">불참 취소됨</Badge>
                  ) : (
                    <Badge colorPalette="danger">불참</Badge>
                  )
                ) : null}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
