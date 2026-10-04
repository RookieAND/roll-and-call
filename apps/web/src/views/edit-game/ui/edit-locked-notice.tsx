import { Button } from "@roll-and-call/ui";

import { EmptyState, ServerLink } from "@/shared/ui";

interface EditLockedNoticeProps {
  gameId: string;
  title: string;
}

export function EditLockedNotice({ gameId, title }: EditLockedNoticeProps) {
  return (
    <EmptyState
      title={title}
      action={<Button render={<ServerLink path={`/games/${gameId}/manage`} />}>운영 관리로</Button>}
    />
  );
}
