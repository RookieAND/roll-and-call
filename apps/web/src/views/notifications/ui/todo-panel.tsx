import { VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { EmptyState } from "@/shared/ui";
import { loadTodos, TODO_ITEM_TYPE } from "@/widgets/session-list";

import { nullOnError } from "../api/null-on-error";
import { CertTodoCard } from "./cert-todo-card";
import { ReloadButton } from "./reload-button";
import { TodoCard } from "./todo-card";

interface TodoPanelProps {
  serverId: string;
  userId: string;
}

// 카드는 모두 펼쳐 보인다.
export async function TodoPanel({ serverId, userId }: TodoPanelProps) {
  const list = await nullOnError(loadTodos(serverId, userId));
  if (isNull(list)) {
    return (
      <EmptyState
        image="/empty-states/empty-error.png"
        title="할 일을 불러오지 못했습니다"
        description="잠시 뒤 다시 시도해 주세요."
        action={<ReloadButton />}
      />
    );
  }
  if (list.count === 0) {
    return (
      <EmptyState
        image="/empty-states/empty-schedule.png"
        title="지금 처리할 일이 없습니다"
        description="새로 할 일이 생기면 홈 맨 위에도 알려 드립니다."
      />
    );
  }
  return (
    <VStack gap="125">
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
