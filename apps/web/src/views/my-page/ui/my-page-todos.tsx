import { Text, VStack } from "@trpg/ui";

import { SessionCard } from "@/widgets/session-list";

import type { TodoItem } from "../model/session-todos";

interface MyPageTodosProps {
  todos: TodoItem[];
}

export function MyPageTodos({ todos }: MyPageTodosProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        할 일 {todos.length}건
      </Text>
      <VStack gap="125">
        {todos.map(({ card, eyebrow }) => (
          <SessionCard key={card.id} model={card} eyebrow={eyebrow} />
        ))}
      </VStack>
    </VStack>
  );
}
