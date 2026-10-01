import { Text, VStack } from "@roll-and-call/ui";

import type { MyRulebook } from "@/entities/rulebook";

import type { TodoItem } from "../model/session-todos";
import { CertTodoCard } from "./cert-todo-card";
import { TodoCard } from "./todo-card";
import { TodoMore } from "./todo-more";

interface MyPageTodosProps {
  todos: TodoItem[];
  rejectedRulebooks: MyRulebook[];
}

export function MyPageTodos({ todos, rejectedRulebooks }: MyPageTodosProps) {
  const cards = [
    ...todos.map((item) => <TodoCard key={item.id} item={item} />),
    ...rejectedRulebooks.map((rulebook) => <CertTodoCard key={rulebook.id} rulebook={rulebook} />),
  ];
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
