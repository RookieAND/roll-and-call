import { VStack } from "@roll-and-call/ui";

import { TODO_ITEM_TYPE, type TodoList } from "@/widgets/session-list";

import { CertTodoCard } from "./cert-todo-card";
import { TodoCard } from "./todo-card";

interface TodoCardListProps {
  list: TodoList;
}

// 카드가 둘 이상이면 데스크톱에서 2열로 놓고, 화면 틀이 이 표지를 보고 본문을 880px로 넓힌다.
export function TodoCardList({ list }: TodoCardListProps) {
  const multi = list.items.length >= 2;
  return (
    <VStack
      gap="125"
      data-todo-layout={multi ? "multi" : "single"}
      className={multi ? "desktop:grid desktop:grid-cols-2" : undefined}
    >
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
