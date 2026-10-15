import { Card, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileSectionProps {
  title?: ReactNode;
  // 키-값 목록처럼 위아래 여백을 줄 안에서 갖는 내용이면 flush로 좌우 여백만 둔다.
  flush?: boolean;
  children: ReactNode;
}

// 모바일 상세의 흰 카드 한 칸
export function MobileSection({ title, flush, children }: MobileSectionProps) {
  return (
    <Card.Root
      padding="none"
      render={<VStack gap="125" render={<section />} />}
      className={flush ? "px-175" : "px-175 py-150"}
    >
      {title ? (
        <Text typography="subtitle1" render={<h2 />}>
          {title}
        </Text>
      ) : null}
      {children}
    </Card.Root>
  );
}
