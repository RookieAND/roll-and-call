import type { ReactNode } from "react";

import { formatDate, formatDateTime, sessionTimeLabel } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
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
          { label: "출석 확인", value: formatDateTime(confirmedAt) },
          { label: "후기 작성 기한", value: `${formatDate(reviewDeadline)}까지` },
        ]
      : [];
  const deadline = post.recruitDeadline ? formatDateTime(post.recruitDeadline) : "미정";
  return [
    [
      { label: "세션 일정", value: sessionTimeLabel(post.sessionAt) },
      { label: "플레이타임", value: post.playTime ?? "미정" },
    ],
    [{ label: "모집 마감일", value: deadline }, { label: "GM", value: gmValue }, ...attendanceRows],
  ];
}
