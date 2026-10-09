import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PreviewCardProps {
  icon: LucideIcon;
  title: string;
  aside?: string;
  wide?: boolean;
  children: ReactNode;
}

// 캐러셀 속 "실제 화면 조각" 한 장. 넓은 카드는 두 칸을 다 쓴다.
export function PreviewCard({
  icon: Icon,
  title,
  aside,
  wide = false,
  children,
}: PreviewCardProps) {
  return (
    <VStack
      gap={wide ? "175" : "125"}
      className={cn(
        "min-w-0 rounded-700 border border-gray-200 bg-surface shadow-[0_14px_36px_rgb(23_23_28/0.08)]",
        wide ? "col-span-2 p-225" : "p-175",
      )}
    >
      <HStack align="center" gap="100">
        <span className="flex size-6.5 flex-none items-center justify-center rounded-300 bg-gray-100 text-gray-600">
          <Icon size={15} strokeWidth={2.2} aria-hidden />
        </span>
        <Text typography="body3" weight="extrabold" foreground="muted" className="flex-1 truncate">
          {title}
        </Text>
        {aside && (
          <Text typography="body4" weight="bold" foreground="hint" numeric>
            {aside}
          </Text>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
