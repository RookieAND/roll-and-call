import { Callout } from "@roll-and-call/ui";

import { AUTH_ERROR_MESSAGE, type AuthError } from "@/shared/lib";

interface AuthErrorNoticeProps {
  error: AuthError;
}

export function AuthErrorNotice({ error }: AuthErrorNoticeProps) {
  return (
    <Callout.Root colorPalette="danger" size="sm">
      <Callout.Icon />
      <Callout.Description>{AUTH_ERROR_MESSAGE[error]}</Callout.Description>
    </Callout.Root>
  );
}
