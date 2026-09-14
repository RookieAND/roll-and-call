import type { SessionCardModel } from "../model/session-card";
import { SessionCard } from "./session-card";

// 세션 카드 목록. 홈·내 세션 공용.
export function SessionList({ items }: { items: SessionCardModel[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((model) => (
        <SessionCard key={model.id} model={model} />
      ))}
    </div>
  );
}
