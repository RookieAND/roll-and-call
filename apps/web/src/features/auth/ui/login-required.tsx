import type { UiAssetName } from "@roll-and-call/ui";

import { EmptyState } from "@/shared/ui";

import { LoginButton } from "./login-button";

interface LoginRequiredProps {
  title?: string;
  description?: string;
  image?: UiAssetName;
}

export function LoginRequired({
  title = "로그인이 필요한 화면입니다",
  description,
  image,
}: LoginRequiredProps) {
  return (
    <EmptyState
      image={image}
      title={title}
      description={description ?? "디스코드 계정으로 로그인하면 이 화면으로 돌아옵니다."}
      action={<LoginButton className="h-11 w-full" />}
    />
  );
}
