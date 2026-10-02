import { formatDate, formatDateTime, formatSessionTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import type { FactRow } from "@/shared/ui";

const ATTENDANCE_WAITING = "대기 중";

// 후기 탭에서는 모집 정보 대신 출석 확인과 후기 작성 기한을 보여 준다(시안 RvSummary).
export function summaryRows({
  post,
  reviewsTab,
}: {
  post: PostDetail;
  reviewsTab: boolean;
}): [FactRow[], FactRow[]] {
  const sessionTime = { label: "세션 일정", value: formatSessionTime(post.startsAt) };
  const rule = { label: "룰", value: post.rulebook };
  const gm = { label: "GM", value: post.gm.nickname };
  if (!reviewsTab) {
    const deadline = post.recruitDeadline ? formatDateTime(post.recruitDeadline) : "—";
    return [
      [sessionTime, { label: "플레이타임", value: post.playTime ?? "—" }, rule],
      [{ label: "모집 마감일", value: deadline }, gm],
    ];
  }
  const { confirmedAt, reviewDeadline } = post.attendance;
  if (!confirmedAt || !reviewDeadline) {
    return [[sessionTime, rule, gm], [{ label: "출석 확인", value: ATTENDANCE_WAITING }]];
  }
  return [
    [sessionTime, rule, gm],
    [
      { label: "출석 확인", value: formatDateTime(confirmedAt) },
      { label: "후기 작성 기한", value: `${formatDate(reviewDeadline)}까지` },
    ],
  ];
}
