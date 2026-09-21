import { Collapsible, Text, VStack } from "@trpg/ui";
import { ChevronDown } from "lucide-react";

import type { TodoItem } from "../model/session-todos";
import { TodoCard } from "./todo-card";

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
          <Collapsible.Root>
            <Collapsible.Panel>
              <VStack gap="125" className="pb-125">
                {rest.map((item) => (
                  <TodoCard key={item.id} item={item} />
                ))}
              </VStack>
            </Collapsible.Panel>
            <Collapsible.Trigger className="group flex min-h-[46px] w-full cursor-pointer items-center gap-100 rounded-600 border border-gray-200 px-175 text-left transition-colors hover:bg-gray-50">
              <Text typography="body3" weight="bold" className="flex-1 text-gray-700">
                <span className="group-data-panel-open:hidden">할 일 {rest.length}건 더 보기</span>
                <span className="hidden group-data-panel-open:inline">접기</span>
              </Text>
              <ChevronDown
                size={16}
                strokeWidth={2.2}
                aria-hidden
                className="text-hint transition-transform group-data-panel-open:rotate-180"
              />
            </Collapsible.Trigger>
          </Collapsible.Root>
        )}
      </VStack>
    </VStack>
  );
}
