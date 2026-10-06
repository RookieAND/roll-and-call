import { Grid } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import type { SpecialTitle } from "../model/special-titles";
import { DexSection } from "./dex-section";
import { DexSpecialTitleTile } from "./dex-special-title-tile";
import { DexUnknownTitleTile } from "./dex-unknown-title-tile";

interface DexSpecialTabProps {
  titles: SpecialTitle[];
  unknownCount: number;
}

export function DexSpecialTab({ titles, unknownCount }: DexSpecialTabProps) {
  return (
    <DexSection title="특별 칭호">
      <Grid cols={4} gap="100">
        {titles.map((title) => (
          <DexSpecialTitleTile key={title.key} title={title} />
        ))}
        {range(unknownCount).map((index) => (
          <DexUnknownTitleTile key={index} />
        ))}
      </Grid>
    </DexSection>
  );
}
