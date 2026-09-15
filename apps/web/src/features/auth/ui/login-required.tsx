import { EmptyState } from "@/shared/ui";

import { LoginButton } from "./login-button";

export function LoginRequired({ description }: { description?: string }) {
  return (
    <EmptyState
      title="로그인이 필요한 화면입니다"
      description={description ?? "디스코드 계정으로 로그인하면 이 화면으로 돌아옵니다."}
      action={<LoginButton className="h-11 w-full" />}
    />
  );
}
