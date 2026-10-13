import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  // 표 머리글을 스크롤해도 머리말 아래에 붙여 둔다. 표 칸의 가로 스크롤 영역을 풀고 둥근 모서리는 clip으로 자른다.
  stickyHead?: boolean;
}

export function Panel({
  title,
  description,
  right,
  children,
  footer,
  className,
  bodyClassName,
  stickyHead = false,
}: PanelProps) {
  return (
    <VStack
      render={<section />}
      className={cn(
        "min-h-0 overflow-hidden rounded-600 border border-gray-200 bg-surface",
        stickyHead && "overflow-clip",
        className,
      )}
    >
      {title || description || right ? (
        <HStack
          align="center"
          gap="100"
          render={<header />}
          className="border-b border-(--rc-color-border-subtle) px-175 py-125 whitespace-nowrap"
        >
          {title ? (
            <Text typography="heading3" render={<h2 />}>
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text typography="body4" foreground="hint">
              {description}
            </Text>
          ) : null}
          {right ? (
            <HStack align="center" gap="075" className="ml-auto">
              {right}
            </HStack>
          ) : null}
        </HStack>
      ) : null}
      <div
        className={cn(
          "min-h-0 flex-1 **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0",
          stickyHead &&
            "**:data-[slot=table-container]:overflow-visible **:data-[slot=table-header]:sticky **:data-[slot=table-header]:top-(--rc-size-appbar) **:data-[slot=table-header]:z-1 **:data-[slot=table-header]:shadow-[0_1px_0_0_var(--color-gray-200)]",
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer}
    </VStack>
  );
}
