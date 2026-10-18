import { NO_SHOW_STATUS, NoShowStatusTag } from "@/entities/no-show";
import type { UserDetail } from "@/entities/user/server";
import { formatFullSessionTime, withoutYear, withQuery } from "@/shared/lib";
import { EMPTY_IMAGE, EmptyState, InfiniteList, ListRow } from "@/shared/ui";

import { noShowStatus } from "../../model/no-show-status";

interface NoShowRowsProps {
  noShows: UserDetail["noShows"];
}

export function NoShowRows({ noShows }: NoShowRowsProps) {
  if (noShows.length === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.schedule}
        title="불참 기록이 없습니다"
        description="GM이 출석 확인에서 불참을 기록하면 이곳에 표시됩니다."
      />
    );
  }
  return (
    <InfiniteList>
      {noShows.map((noShow) => {
        const status = noShowStatus(noShow);
        return (
          <ListRow
            key={noShow.id}
            path={withQuery("/noshow", {}, { record: noShow.id })}
            title={noShow.sessionTitle}
            trailing={status === NO_SHOW_STATUS.valid ? null : <NoShowStatusTag status={status} />}
            meta={`${withoutYear(formatFullSessionTime(noShow.startsAt))} · ${noShow.recordedBy}`}
            muted={noShow.cancelled}
          />
        );
      })}
    </InfiniteList>
  );
}
