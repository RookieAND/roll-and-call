import { Button, Card, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, Clock } from "lucide-react";

import { LineBreaks, ServerLink } from "@/shared/ui";
import type { SessionTodoItem } from "@/widgets/session-list";

const todoCard = cva("p-175", {
  variants: { blocked: { true: "border-danger-200 bg-danger-50", false: "" } },
});

interface TodoCardProps {
  item: SessionTodoItem;
}

export function TodoCard({ item }: TodoCardProps) {
  const Icon = item.blocked ? CircleAlert : Clock;

  const buttonVariant = item.blocked ? "solid" : "tinted";
  const buttonPalette = item.blocked ? "success" : "primary";

  return (
    <Card.Root padding="none" className={todoCard({ blocked: item.blocked })}>
      <HStack
        align="center"
        gap="100"
        className={item.blocked ? "text-danger-600" : "text-warning-600"}
      >
        <Icon size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
        <Text weight="bold" typography="body4" foreground="inherit">
          {item.eyebrow}
        </Text>
      </HStack>
      <Text truncate typography="heading3" render={<h3 />} className="mt-100">
        {item.title}
      </Text>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="mt-050 [text-wrap:pretty]"
      >
        <LineBreaks lines={item.lines} />
      </Text>
      <Button
        render={<ServerLink path={item.action.href} />}
        variant={buttonVariant}
        colorPalette={buttonPalette}
        className="mt-150 w-full"
      >
        {item.action.label}
      </Button>
    </Card.Root>
  );
}
