import { VStack } from "@roll-and-call/ui";

import { CARD_GRID_CLASS } from "@/shared/ui";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";

interface SessionListProps {
  items: SessionCardModel[];
}

export function SessionList({ items }: SessionListProps) {
  return (
    <VStack gap="125" className={CARD_GRID_CLASS}>
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </VStack>
  );
}
