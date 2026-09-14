import { Text, VStack, cn } from "@trpg/ui";
import Image from "next/image";
import type { ReactNode } from "react";

// dashed-card 빈 상태 레이아웃 셸: 이미지·제목·설명·CTA 슬롯만 담는다.
// 빈 상태·권한 없음·로그인 필요 안내가 모두 이 한 벌을 쓴다.
// size: 전체 화면 140px, 섹션 단위 104px. 버튼은 카드 안 마지막 줄, 최대 2개(주 액션이 오른쪽).
// 일러스트는 장식이라 alt="" — 제목이 이미 같은 말을 한다.
export function EmptyState({
  image,
  size = "full",
  title,
  description,
  action,
  className,
}: {
  image?: string;
  size?: "full" | "section";
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const imagePx = size === "full" ? 140 : 104;
  return (
    <VStack
      gap={3}
      className={cn(
        "items-center rounded-2xl border border-dashed border-gray-300 p-6 text-center",
        className,
      )}
    >
      {image && <Image src={image} alt="" width={imagePx} height={imagePx} />}
      <VStack gap={1} className="items-center">
        <Text typography="subtitle1">{title}</Text>
        {description && (
          <Text typography="body2" foreground="muted">
            {description}
          </Text>
        )}
      </VStack>
      {action}
    </VStack>
  );
}
