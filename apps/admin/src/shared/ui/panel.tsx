import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

// 카드 한 장. 안에 든 표는 바깥 테두리를 지워 패널 테두리 하나만 남긴다.
export function Panel({ title, right, children, footer, className, bodyClassName }: PanelProps) {
  return (
    <VStack
      render={<section />}
      className={cn(
        "min-h-0 overflow-hidden rounded-600 border border-gray-200 bg-surface",
        className,
      )}
    >
      {title || right ? (
        <HStack
          align="center"
          gap="100"
          render={<header />}
          className="border-b border-(--rc-color-border-subtle) px-175 py-125 whitespace-nowrap"
        >
          {title ? (
            <Text typography="subtitle1" render={<h2 />}>
              {title}
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
          "min-h-0 flex-1 [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-0",
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer}
    </VStack>
  );
}
