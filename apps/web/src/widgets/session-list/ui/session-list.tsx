import { VStack } from "@trpg/ui";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";

export function SessionList({ items }: { items: SessionCardModel[] }) {
  return (
    <VStack gap="125">
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </VStack>
  );
}
