import { EmptyState } from "@/shared/ui";
import { LoginButton } from "./login-button";

// 로그인이 필요한 화면에 비로그인으로 왔을 때: 홈으로 튕기지 않고 그 자리에서 안내한다.
// 로그인 후에는 이 화면으로 돌아온다(LoginButton 기본 next = 현재 경로).
export function LoginRequired({ description }: { description?: string }) {
  return (
    <EmptyState
      title="로그인이 필요한 화면입니다"
      description={description ?? "디스코드 계정으로 로그인하면 이 화면으로 돌아옵니다."}
      action={<LoginButton className="h-11 w-full" />}
    />
  );
}
