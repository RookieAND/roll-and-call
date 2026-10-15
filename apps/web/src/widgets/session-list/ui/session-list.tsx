import { VStack } from "@roll-and-call/ui";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";

interface SessionListProps {
  items: SessionCardModel[];
}

export function SessionList({ items }: SessionListProps) {
  return (
    <VStack
      gap="125"
      className="desktop:grid desktop:grid-cols-[repeat(auto-fill,minmax(22.5rem,1fr))]"
    >
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </VStack>
  );
}
