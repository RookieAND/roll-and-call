import { Callout } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";

interface ReviewHiddenBannerProps {
  hidden: NonNullable<ReviewDetail["hidden"]>;
  held: boolean;
}

export function ReviewHiddenBanner({ hidden, held }: ReviewHiddenBannerProps) {
  const editedLine = hidden.editedAfterHidden
    ? "숨긴 뒤 작성자가 후기를 고쳤습니다."
    : "숨긴 뒤 작성자가 후기를 고치지 않았습니다.";
  return (
    <Callout.Root colorPalette="warning">
      <Callout.Icon />
      <Callout.Title>
        {formatDateTime(hidden.at)}에 {hidden.by}님이 숨겼습니다
      </Callout.Title>
      <Callout.Description>
        사유: {hidden.reason} · {editedLine}
        {held ? (
          <>
            <br />
            작성자가 불참으로 기록되어 해제해도 공개되지 않습니다.
          </>
        ) : null}
      </Callout.Description>
    </Callout.Root>
  );
}
