import { VStack } from "@roll-and-call/ui";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";
import { SESSION_GRID_CLASS } from "./session-grid-class";

interface SessionListProps {
  items: SessionCardModel[];
}

export function SessionList({ items }: SessionListProps) {
  return (
    <VStack gap="125" className={SESSION_GRID_CLASS}>
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </VStack>
  );
}
