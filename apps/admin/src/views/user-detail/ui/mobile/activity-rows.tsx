import type { UserDetail } from "@/entities/user/server";
import { formatSessionTime } from "@/shared/lib";
import { EMPTY_IMAGE, EmptyState, InfiniteRows, ListRow, Tag } from "@/shared/ui";

import { stripYear } from "../../model/strip-year";

interface ActivityRowsProps {
  activities: UserDetail["activities"];
}

export function ActivityRows({ activities }: ActivityRowsProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.party}
        title="아직 참여하거나 연 세션이 없습니다"
        description="세션에 참여하거나 구인을 열면 이곳에 기록됩니다."
      />
    );
  }
  return (
    <InfiniteRows
      rows={activities.map((activity) => (
        <ListRow
          key={activity.sessionId}
          path={`/posts/${activity.sessionId}`}
          title={activity.title}
          badges={
            activity.hosted ? null : (
              <>
                <Tag>{`GM ${activity.gmNickname}`}</Tag>
                {activity.noShow ? <Tag>불참</Tag> : null}
              </>
            )
          }
          trailing={<Tag>{activity.hosted ? "GM" : "참여"}</Tag>}
          description={activity.rulebook}
          meta={stripYear(formatSessionTime(activity.startsAt))}
          muted={activity.noShow?.cancelled}
        />
      ))}
    />
  );
}
