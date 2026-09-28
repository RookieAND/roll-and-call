import { Text } from "@roll-and-call/ui";

import { UserPreview } from "@/shared/ui";

interface AuthorMessagePreviewProps {
  removing: boolean;
  reasonLabel: string | null;
}

export function AuthorMessagePreview({ removing, reasonLabel }: AuthorMessagePreviewProps) {
  const message = removing
    ? `운영진이 이 후기를 제거했습니다. 사유: ${reasonLabel}.`
    : `운영진이 이 후기를 숨겼습니다. 사유: ${reasonLabel}. 후기를 고친 뒤 디스코드로 해제를 요청할 수 있습니다.`;
  return (
    <UserPreview title="작성자에게 이렇게 보입니다">
      {reasonLabel ? (
        message
      ) : (
        <Text typography="body3" foreground="hint">
          사유를 고르면 보낼 문구가 표시됩니다.
        </Text>
      )}
    </UserPreview>
  );
}
