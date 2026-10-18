import type { ReactNode } from "react";

import type { PostDetail } from "@/entities/post/server";
import { formatFullDate, formatFullDateTime, sessionTimeLabel } from "@/shared/lib";
import type { FactRow } from "@/shared/ui";

// GM 줄의 값(닉네임과 받은 조치 hint)은 그리는 쪽이 넘긴다.
export function summaryRows({
  post,
  gmValue,
}: {
  post: PostDetail;
  gmValue: ReactNode;
}): [FactRow[], FactRow[]] {
  const { confirmedAt, reviewDeadline } = post.attendance;
  const attendanceRows: FactRow[] =
    confirmedAt && reviewDeadline
      ? [
          { label: "출석 확인", value: formatFullDateTime(confirmedAt) },
          { label: "후기 작성 기한", value: `${formatFullDate(reviewDeadline)}까지` },
        ]
      : [];
  const deadline = post.recruitDeadline ? formatFullDateTime(post.recruitDeadline) : "미정";
  return [
    [
      { label: "세션 일정", value: sessionTimeLabel(post.sessionAt) },
      { label: "플레이타임", value: post.playTime ?? "—" },
    ],
    [{ label: "모집 마감일", value: deadline }, { label: "GM", value: gmValue }, ...attendanceRows],
  ];
}
