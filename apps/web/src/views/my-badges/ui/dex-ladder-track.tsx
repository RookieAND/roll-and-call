import { Grid } from "@roll-and-call/ui";

import type { DexTab } from "../model/build-dex-tab";
import { DexMedalTile } from "./dex-medal-tile";

interface DexLadderTrackProps {
  total: DexTab["total"];
}

export function DexLadderTrack({ total }: DexLadderTrackProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute top-[25px] right-[10%] left-[10%] h-[3px] rounded-100 bg-gray-200"
      />
      <span
        aria-hidden
        className="absolute top-[25px] left-[10%] h-[3px] rounded-100 bg-rank-gold"
        style={{ width: `${total.fillPercent}%` }}
      />
      <Grid cols={5} className="relative">
        {total.medals.map((medal) => (
          <DexMedalTile key={medal.key} medal={medal} />
        ))}
      </Grid>
    </div>
  );
}
