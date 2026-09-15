import { Text } from "@trpg/ui";

import { SessionCard } from "@/widgets/session-list";

import type { AgendaItem } from "../model/home-agenda";

export function HomeTodos({ todos }: { todos: AgendaItem[] }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div>
        <Text typography="heading3" render={<h2 />}>
          할 일 {todos.length}건
        </Text>
        <Text typography="body4" foreground="hint" render={<p />} className="mt-0.5">
          먼저 처리하면 좋은 것부터 보여줍니다.
        </Text>
      </div>
      <div className="flex flex-col gap-2.5">
        {todos.map(({ card, eyebrow }) => (
          <SessionCard key={card.id} model={card} eyebrow={eyebrow} />
        ))}
      </div>
    </section>
  );
}
