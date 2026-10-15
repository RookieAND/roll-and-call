import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileTitleProps {
  title: ReactNode;
  sub?: ReactNode;
}

// 모바일 헤더 제목 아래 작은 보조 줄(「48건」, 「구인 상세」). AdminHeader의 title로 넘긴다.
export function MobileTitle({ title, sub }: MobileTitleProps) {
  return (
    <>
      <span className="block truncate">{title}</span>
      {sub ? (
        <Text typography="body4" foreground="hint" render={<span />} className="block truncate">
          {sub}
        </Text>
      ) : null}
    </>
  );
}
