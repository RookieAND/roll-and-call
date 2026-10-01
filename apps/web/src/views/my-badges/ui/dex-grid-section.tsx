import { Grid, Text } from "@roll-and-call/ui";

import type { DexMedal } from "../model/dex-medal";
import type { LadderNext } from "../model/ladder-next";
import { DexMedalTile } from "./dex-medal-tile";
import { DexNextCard } from "./dex-next-card";
import { DexSection } from "./dex-section";

interface DexGridSectionProps {
  board: { title: string; hint: string; note: string; medals: DexMedal[]; next: LadderNext };
}

export function DexGridSection({ board }: DexGridSectionProps) {
  return (
    <DexSection title={board.title} hint={board.hint}>
      <Grid cols={5} gap="075">
        {board.medals.map((medal) => (
          <DexMedalTile key={medal.key} medal={medal} bordered />
        ))}
      </Grid>
      <DexNextCard
        next={board.next}
        note={
          <Text typography="body4" foreground="hint">
            {board.note}
          </Text>
        }
      />
    </DexSection>
  );
}
