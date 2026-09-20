import { EmptyState } from "@/shared/ui";

import { CopyLinkButton } from "./copy-link-button";

export function RosterEmptyState({ gameId }: { gameId: string }) {
  return (
    <EmptyState
      image="/empty-states/empty-hosted.png"
      size="section"
      title="아직 신청한 사람이 없습니다"
      description="구인글 링크를 디스코드에 공유하면 모집이 빨라집니다."
      action={<CopyLinkButton gameId={gameId} />}
    />
  );
}
