import { cn, HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { ServerLink } from "./server-link";

interface AdminHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  trail?: { href: string; label: string }[];
  actions?: ReactNode;
  withAside?: boolean;
  // 본문이 920px 칸인 화면은 제목을 그 칸의 시작선에 맞춘다.
  contentWidth?: boolean;
}

export function AdminHeader({
  title,
  sub,
  trail = [],
  actions,
  withAside,
  contentWidth,
}: AdminHeaderProps) {
  return (
    <HStack
      align="center"
      gap="100"
      render={<header data-full-bleed />}
      className={cn(
        "sticky top-0 z-(--rc-z-sticky) h-(--rc-size-appbar) shrink-0 border-b border-gray-200 bg-surface whitespace-nowrap",
        withAside && "pr-150 pl-center-200",
        contentWidth && "px-content",
        !withAside && !contentWidth && "px-page",
      )}
    >
      {trail.map((step) => (
        <HStack
          key={step.label}
          align="center"
          gap="050"
          render={<ServerLink path={step.href} />}
          className="text-hint hover:text-gray-600"
        >
          <Text typography="heading1" weight="medium" foreground="inherit">
            {step.label}
          </Text>
          <ChevronRight size={16} aria-hidden />
        </HStack>
      ))}
      <Text typography="heading1" render={<h1 />}>
        {title}
      </Text>
      {sub ? (
        <Text typography="body3" foreground="hint" numeric>
          {sub}
        </Text>
      ) : null}
      <HStack align="center" gap="100" className="ml-auto">
        {actions}
      </HStack>
    </HStack>
  );
}
