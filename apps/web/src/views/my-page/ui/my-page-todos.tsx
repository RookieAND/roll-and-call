import { Text, VStack } from "@roll-and-call/ui";

import { TODO_ITEM_TYPE, type TodoItem } from "@/widgets/session-list";

import { CertTodoCard } from "./cert-todo-card";
import { TodoCard } from "./todo-card";
import { TodoMore } from "./todo-more";

interface MyPageTodosProps {
  items: TodoItem[];
}

export function MyPageTodos({ items }: MyPageTodosProps) {
  const cards = items.map((item) =>
    item.type === TODO_ITEM_TYPE.cert ? (
      <CertTodoCard key={item.key} item={item} />
    ) : (
      <TodoCard key={item.key} item={item} />
    ),
  );
  const [first, ...rest] = cards;
  if (!first) return null;

  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        할 일 {cards.length}건
      </Text>
      <VStack gap="125">
        {first}
        {rest.length > 0 && <TodoMore count={rest.length}>{rest}</TodoMore>}
      </VStack>
    </VStack>
  );
}
