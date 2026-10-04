import { isNull } from "es-toolkit";

import { LoginButton } from "@/features/auth";
import type { MenuServer } from "@/shared/ui";

import { AuthErrorNotice } from "./auth-error-notice";
import { MyServersButton } from "./my-servers-button";
import { NoServerNotice } from "./no-server-notice";
import { ReturningNotice } from "./returning-notice";
import { ServerCtaButton } from "./server-cta-button";
import { ServerSplitButton } from "./server-split-button";

interface IndexCtaProps {
  // null이면 비로그인
  servers: MenuServer[] | null;
  joinable: MenuServer[];
  compact?: boolean;
  authError?: boolean;
}

// 첫 화면 주 버튼. compact는 스크롤 뒤 헤더에 붙는 작은 버전이다.
export function IndexCta({ servers, joinable, compact = false, authError = false }: IndexCtaProps) {
  if (isNull(servers)) {
    if (compact) {
      return (
        <LoginButton
          next="/"
          label={
            <>
              <span className="@max-2xl:hidden">디스코드로 로그인</span>
              <span className="@2xl:hidden">로그인</span>
            </>
          }
          className="h-8 px-150 text-body3"
        />
      );
    }
    return (
      <>
        {authError && <AuthErrorNotice />}
        <LoginButton next="/" className="w-full" />
      </>
    );
  }

  const [recent, ...rest] = servers;
  if (recent) {
    if (rest.length === 0) {
      const buttonClass = compact ? undefined : "w-full";
      return (
        <ServerCtaButton server={recent} mode="member" compact={compact} className={buttonClass} />
      );
    }
    if (compact) return <MyServersButton servers={[recent, ...rest]} />;
    return <ServerSplitButton servers={[recent, ...rest]} mode="member" />;
  }

  const [first, ...others] = joinable;
  if (!first) return compact ? null : <NoServerNotice />;
  if (compact) return <ServerCtaButton server={first} mode="join" compact />;
  return (
    <>
      {others.length === 0 ? (
        <ServerCtaButton server={first} mode="join" compact={false} className="w-full" />
      ) : (
        <ServerSplitButton servers={[first, ...others]} mode="join" />
      )}
      {first.returning && <ReturningNotice />}
    </>
  );
}
