import { Table, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { formatSessionTime, paginate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import {
  EMPTY_IMAGE,
  ListPager,
  Panel,
  ServerLink,
  TableEmptyRow,
  TableColumns,
  Tag,
  UrlSelect,
} from "@/shared/ui";

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
        <TableColumns widths={[192, 66, 200, 140, 100, 96, { fixed: 44 }]} />
        <Table.Header>
          <Table.Row>
            <Table.Head>일시</Table.Head>
            <Table.Head align="center">역할</Table.Head>
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
                  {formatSessionTime(activity.startsAt)}
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
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
                <Text typography="body3" foreground="muted" truncate>
                  {activity.rulebook}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate>
                  {activity.hosted ? null : activity.gmNickname}
                </Text>
              </Table.Cell>
              <Table.Cell>{activity.noShow ? <Tag>불참</Tag> : null}</Table.Cell>
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
