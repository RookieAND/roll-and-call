import type { GameSupplement } from "@roll-and-call/database";

interface GameSupplementListProps {
  supplements: GameSupplement[];
}

export function GameSupplementList({ supplements }: GameSupplementListProps) {
  return (
    <ul className="m-0 min-w-0 list-disc py-025 pl-225 marker:text-hint">
      {supplements.map((item) => (
        <li key={item.rulebookId ?? `manual:${item.name}`} className="break-all">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
