import { Text, VStack, cn } from "@trpg/ui";
import Image from "next/image";
import type { ReactNode } from "react";

interface EmptyStateProps {
  image?: string;
  size?: "full" | "section";
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// 일러스트는 장식이라 alt="": 제목이 이미 같은 말을 한다.
export function EmptyState({
  image,
  size = "full",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const imagePx = size === "full" ? 140 : 104;
  return (
    <VStack
      gap="150"
      className={cn(
        "items-center rounded-700 border border-dashed border-gray-300 p-300 text-center",
        className,
      )}
    >
      {image && <Image src={image} alt="" width={imagePx} height={imagePx} />}
      <VStack gap="050" className="items-center">
        <Text typography="subtitle1">{title}</Text>
        {description && (
          <Text typography="body2" foreground="muted" className="whitespace-pre-line">
            {description}
          </Text>
        )}
      </VStack>
      {action}
    </VStack>
  );
}
