import { Text, VStack } from "@trpg/ui";

import { SessionCard } from "@/widgets/session-list";

import type { TodoItem } from "../model/session-todos";

export function MyPageTodos({ todos }: { todos: TodoItem[] }) {
  return (
    <section className="flex flex-col gap-125">
      <div>
        <Text typography="heading3" render={<h2 />}>
          할 일 {todos.length}건
        </Text>
        <Text typography="body4" foreground="hint" render={<p />} className="mt-025">
          먼저 처리하면 좋은 것부터 보여줍니다.
        </Text>
      </div>
      <VStack gap="125">
        {todos.map(({ card, eyebrow }) => (
          <SessionCard key={card.id} model={card} eyebrow={eyebrow} />
        ))}
      </VStack>
    </section>
  );
}
