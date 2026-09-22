import { Text, VStack } from "@roll-and-call/ui";

import type { TodoItem } from "../model/session-todos";
import { TodoCard } from "./todo-card";
import { TodoMore } from "./todo-more";

interface MyPageTodosProps {
  todos: TodoItem[];
}

// 제일 급한 한 장만 펼쳐 두고 나머지는 접는다. 펼치면 버튼이 아래로 밀려 "접기"가 된다.
export function MyPageTodos({ todos }: MyPageTodosProps) {
  const [first, ...rest] = todos;
  if (!first) return null;

  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        할 일 {todos.length}건
      </Text>
      <VStack gap="125">
        <TodoCard item={first} />
        {rest.length > 0 && (
          <TodoMore count={rest.length}>
            {rest.map((item) => (
              <TodoCard key={item.id} item={item} />
            ))}
          </TodoMore>
        )}
      </VStack>
    </VStack>
  );
}
