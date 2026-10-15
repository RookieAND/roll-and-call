import { VStack } from "@roll-and-call/ui";

import { TODO_ITEM_TYPE, type TodoList } from "@/widgets/session-list";

import { TODO_GRID_CLASS } from "../lib/notifications-desktop-class";
import { CertTodoCard } from "./cert-todo-card";
import { TodoCard } from "./todo-card";

interface TodoCardListProps {
  list: TodoList;
}

// 데스크톱은 폭에 맞춰 열 수가 정해지는 격자다.
export function TodoCardList({ list }: TodoCardListProps) {
  return (
    <VStack gap="125" className={TODO_GRID_CLASS}>
      {list.items.map((item) =>
        item.type === TODO_ITEM_TYPE.cert ? (
          <CertTodoCard key={item.key} item={item} />
        ) : (
          <TodoCard key={item.key} item={item} />
        ),
      )}
    </VStack>
  );
}
