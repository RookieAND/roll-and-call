import { bucketHosted, bucketJoined } from "@/widgets/session-list";

type SessionGames = Parameters<typeof bucketHosted>[0];

// 마이페이지가 보여줄 두 줄기(참여 예정 · 운영 중)와 지난 세션 요약.
// 버킷 전체 중 이 화면이 쓰는 것만 골라 이름을 붙인다.
export function summarizeMySessions({
  hosted,
  joined,
  viewerId,
}: {
  hosted: SessionGames;
  joined: SessionGames;
  viewerId: string;
}) {
  const hostedBuckets = bucketHosted(hosted, viewerId);
  const joinedBuckets = bucketJoined(joined, viewerId);

  return {
    upcoming: joinedBuckets.confirmed,
    hosting: hostedBuckets.recruiting,
    pastCount: joinedBuckets.closed.length + hostedBuckets.closed.length,
    // 지난 세션은 실제로 쌓여 있는 탭으로 보낸다.
    pastHref:
      joinedBuckets.closed.length > 0
        ? "/me/sessions/joined?tab=closed"
        : "/me/sessions/hosted?tab=closed",
  };
}
