import { HStack, Text } from "@trpg/ui";
import type { ReactNode } from "react";

interface DangerNoticeProps {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
}

export function DangerNotice({ icon, title, children }: DangerNoticeProps) {
  return (
    <HStack
      align="start"
      gap="100"
      className="rounded-400 border border-danger-200 bg-danger-50 px-150 py-150"
    >
      <span aria-hidden className="mt-025 flex-none text-danger-600">
        {icon}
      </span>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="min-w-0 flex-1 text-pretty leading-[1.55]"
      >
        <b className="text-danger-600">{title}</b>
        <br />
        {children}
      </Text>
    </HStack>
  );
}
