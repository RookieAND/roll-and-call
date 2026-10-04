import { Button, Card, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";
import type { SessionTodoItem } from "@/widgets/session-list";

import { TodoCardBody } from "./todo-card-body";
import { TodoCardHead } from "./todo-card-head";

interface TodoCardProps {
  item: SessionTodoItem;
}

export function TodoCard({ item }: TodoCardProps) {
  const buttonVariant = item.blocked ? "solid" : "tinted";
  const buttonPalette = item.blocked ? "success" : "primary";

  return (
    <VStack gap="050" render={<Card.Root padding="none" className="p-175" />}>
      <TodoCardHead eyebrow={item.eyebrow} blocked={item.blocked} />
      <TodoCardBody title={item.title} lines={item.lines} />
      <Button
        render={<ServerLink path={item.action.href} />}
        variant={buttonVariant}
        colorPalette={buttonPalette}
        size="lg"
        className="mt-125 w-full"
      >
        {item.action.label}
      </Button>
    </VStack>
  );
}
