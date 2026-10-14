"use client";

import type { GameSupplement } from "@roll-and-call/database";
import { Button, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { foldSupplements } from "@/entities/game";

interface GameSupplementListProps {
  supplements: GameSupplement[];
}

export function GameSupplementList({ supplements }: GameSupplementListProps) {
  const [expanded, setExpanded] = useState(false);
  const { visible, foldable, hiddenCount } = foldSupplements({ items: supplements, expanded });
  const foldLabel = expanded ? "접기" : `${hiddenCount}권 더 보기`;

  return (
    <VStack align="start" gap="025" className="min-w-0">
      <ul className="m-0 list-disc py-025 pl-225 marker:text-hint">
        {visible.map((item) => (
          <li key={item.rulebookId ?? `manual:${item.name}`} className="break-all">
            {item.name}
          </li>
        ))}
      </ul>
      {foldable && (
        <Button
          variant="ghost"
          colorPalette="primary"
          size="md"
          aria-expanded={expanded}
          className="-ml-150 h-11"
          onClick={() => setExpanded((value) => !value)}
        >
          {foldLabel}
        </Button>
      )}
    </VStack>
  );
}
