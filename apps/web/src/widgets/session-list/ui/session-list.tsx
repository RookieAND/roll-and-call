import { VStack } from "@trpg/ui";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";

interface SessionListProps {
  items: SessionCardModel[];
}

export function SessionList({ items }: SessionListProps) {
  return (
    <VStack gap="125">
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </VStack>
  );
}
