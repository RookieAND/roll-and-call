import { Grid } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import type { LockedSpecialTitle, SpecialTitle } from "../model/special-titles";
import { DexLockedTitleTile } from "./dex-locked-title-tile";
import { DexSection } from "./dex-section";
import { DexSpecialTitleTile } from "./dex-special-title-tile";
import { DexUnknownTitleTile } from "./dex-unknown-title-tile";

interface DexSpecialTabProps {
  lockedTitle: LockedSpecialTitle | null;
  titles: SpecialTitle[];
  unknownCount: number;
}

export function DexSpecialTab({ lockedTitle, titles, unknownCount }: DexSpecialTabProps) {
  return (
    <DexSection title="특별 칭호">
      <Grid cols={4} gap="100">
        {lockedTitle && <DexLockedTitleTile title={lockedTitle} />}
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
