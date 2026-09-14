import Link from "next/link";
import { Button } from "@trpg/ui";
import { EmptyState } from "@/shared/ui";
// 참여 예정 세션 0건.
export function UpcomingSessionsEmpty() {
  return (
    <EmptyState
      image="/empty-states/empty-my-games.png"
      imageAlt="아직 참여 예정인 세션이 없습니다"
      size="section"
      title="아직 참여 예정인 세션이 없습니다"
      action={
        <Button asChild size="sm">
          <Link href="/games">구인 목록 보기</Link>
        </Button>
      }
    />
  );
}

// 운영 중 세션 0건. 두 블록이 함께 비면 이미지는 첫 블록에만 → withImage로 상위가 제어.
// 지난 운영 세션이 있으면 "아직 연 적 없다"는 사실이 아니므로 문구를 바꾼다.
export function HostedSessionsEmpty({
  withImage,
  hostedBefore,
}: {
  withImage: boolean;
  hostedBefore: boolean;
}) {
  const title = hostedBefore ? "지금 운영 중인 세션이 없습니다" : "아직 본인이 연 세션이 없습니다";

  return (
    <EmptyState
      image={withImage ? "/empty-states/empty-hosted.png" : undefined}
      imageAlt={title}
      size="section"
      title={title}
      action={
        <Button asChild size="sm">
          <Link href="/games/new">새 구인 등록</Link>
        </Button>
      }
    />
  );
}
