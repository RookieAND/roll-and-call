import { Badge, Table, Text } from "@roll-and-call/ui";

import { formatSessionTime } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { Panel } from "@/shared/ui";

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
          <col className="w-[150px]" />
          <col className="w-[66px]" />
          <col />
          <col className="w-[160px]" />
          <col className="w-[100px]" />
          <col className="w-[104px]" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head>역할</Table.Head>
            <Table.Head>세션</Table.Head>
            <Table.Head>룰북</Table.Head>
            <Table.Head>GM</Table.Head>
            <Table.Head aria-label="불참" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
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
              <Table.Cell>
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
