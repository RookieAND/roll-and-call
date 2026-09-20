import type { SessionCardModel } from "../model/session-card-model";
import { SessionCard } from "./session-card";

export function SessionList({ items }: { items: SessionCardModel[] }) {
  return (
    <div className="flex flex-col gap-125">
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </div>
  );
}
