import { isNull } from "es-toolkit";

import { LoginButton } from "@/features/auth";
import type { MenuServer } from "@/shared/ui";

import { NoServerNotice } from "./no-server-notice";
import { ServerCtaButton } from "./server-cta-button";
import { ServerSplitButton } from "./server-split-button";

interface IndexCtaProps {
  // null이면 비로그인
  servers: MenuServer[] | null;
  compact?: boolean;
}

// 첫 화면 주 버튼. compact는 스크롤 뒤 헤더에 붙는 작은 버전이다.
export function IndexCta({ servers, compact = false }: IndexCtaProps) {
  if (isNull(servers)) {
    const loginClass = compact ? "h-8 px-150 text-body3" : "w-full";
    return <LoginButton next="/" className={loginClass} />;
  }
  const [recent, ...rest] = servers;
  if (!recent) return compact ? null : <NoServerNotice />;
  if (rest.length === 0) {
    const buttonClass = compact ? undefined : "w-full";
    return <ServerCtaButton server={recent} compact={compact} className={buttonClass} />;
  }
  return <ServerSplitButton servers={[recent, ...rest]} compact={compact} />;
}
