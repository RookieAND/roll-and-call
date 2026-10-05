import { Text } from "@roll-and-call/ui";

import type { ReviewDetail } from "@/shared/server";
import { HiddenBanner } from "@/shared/ui";

interface ReviewHiddenBannerProps {
  hidden: NonNullable<ReviewDetail["hidden"]>;
  held: boolean;
}

export function ReviewHiddenBanner({ hidden, held }: ReviewHiddenBannerProps) {
  const editedLine = hidden.editedAfterHidden
    ? "숨긴 뒤 작성자가 후기를 고쳤습니다."
    : "숨긴 뒤 작성자가 후기를 고치지 않았습니다.";
  return (
    <HiddenBanner hidden={hidden}>
      <Text typography="body4" foreground="muted">
        {editedLine}
      </Text>
      {held ? (
        <Text typography="body4" foreground="muted">
          작성자가 불참으로 기록되어 해제해도 공개되지 않습니다.
        </Text>
      ) : null}
    </HiddenBanner>
  );
}
