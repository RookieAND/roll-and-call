import { Card, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ManageGroupProps {
  title: string;
  children: ReactNode;
}

export function ManageGroup({ title, children }: ManageGroupProps) {
  return (
    <div>
      <Text render={<div />} typography="subtitle2" foreground="muted" className="px-050 pb-100">
        {title}
      </Text>
      <Card.Root
        radius={600}
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
      >
        {children}
      </Card.Root>
    </div>
  );
}
