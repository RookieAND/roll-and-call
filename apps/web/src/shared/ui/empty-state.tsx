import { Text, VStack, cn } from "@trpg/ui";
import type { ReactNode } from "react";

// dashed-card 빈 상태: 아이콘·제목·설명·CTA 조합. home/my-page 등에서 공용.
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <VStack
      gap={3}
      className={cn(
        "items-center rounded-2xl border border-dashed border-[#E2E2E9] p-6 text-center",
        className,
      )}
    >
      {icon}
      <VStack gap={1} className="items-center">
        <Text weight="bold" size="sm">
          {title}
        </Text>
        {description && (
          <Text size="sm" color="muted">
            {description}
          </Text>
        )}
      </VStack>
      {action}
    </VStack>
  );
}
