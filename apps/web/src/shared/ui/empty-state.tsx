import { Text, VStack, cn } from "@trpg/ui";
import Image from "next/image";
import type { ReactNode } from "react";

// dashed-card 빈 상태 레이아웃 셸: 이미지·제목·설명·CTA 슬롯만 담는다.
// 화면별 문구/에셋은 각 슬라이스의 전용 empty 컴포넌트가 이걸 조합해 채운다.
// size: 전체 화면 140px, 섹션 단위 104px.
export function EmptyState({
  image,
  imageAlt = "",
  size = "full",
  title,
  description,
  action,
  className,
}: {
  image?: string;
  imageAlt?: string;
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
        "items-center rounded-2xl border border-dashed border-[#E2E2E9] p-6 text-center",
        className,
      )}
    >
      {image && <Image src={image} alt={imageAlt} width={imagePx} height={imagePx} />}
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
