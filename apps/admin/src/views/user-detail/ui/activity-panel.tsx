import { Badge, Table, Text } from "@roll-and-call/ui";

import { formatSessionTime } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EMPTY_IMAGE, Panel, TableEmptyRow } from "@/shared/ui";

import { ACTIVITY_ROLE, type ActivityRole } from "../model/activity-role";
import { ActivityRoleFilter } from "./activity-role-filter";

interface ActivityPanelProps {
  activities: UserDetail["activities"];
  role: ActivityRole;
}

export function ActivityPanel({ activities, role }: ActivityPanelProps) {
  const rows =
    role === ACTIVITY_ROLE.all
      ? activities
      : activities.filter((activity) => activity.hosted === (role === ACTIVITY_ROLE.hosted));
  return (
    <Panel title="활동" right={<ActivityRoleFilter role={role} />}>
      <Table.Root className="table-fixed">
        <colgroup>
          <col className="w-[148px]" />
          <col className="w-[66px]" />
          <col />
          <col className="w-[140px]" />
          <col className="w-[100px]" />
          <col className="w-[96px]" />
        </colgroup>
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
          {rows.map((activity) => (
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
