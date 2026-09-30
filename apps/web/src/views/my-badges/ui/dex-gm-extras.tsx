import { Grid, Text } from "@roll-and-call/ui";

import type { DexTab } from "../model/build-dex-tab";
import { DexMedalTile } from "./dex-medal-tile";
import { DexNextCard } from "./dex-next-card";
import { DexSection } from "./dex-section";

interface DexGmExtrasProps {
  variety: NonNullable<DexTab["variety"]>;
  reviews: NonNullable<DexTab["reviews"]>;
}

// GM 탭에만 있는 다양한 룰 운영과 받은 후기.
export function DexGmExtras({ variety, reviews }: DexGmExtrasProps) {
  const sections = [
    { title: "다양한 룰 운영", board: variety, note: "판본만 다른 같은 룰은 1종으로 셉니다" },
    { title: "받은 후기", board: reviews, note: "운영진이 숨기거나 제거한 후기는 세지 않습니다" },
  ];
  return sections.map(({ title, board, note }) => (
    <DexSection key={title} title={title} hint={board.hint}>
      <Grid cols={5} gap="075">
        {board.medals.map((medal) => (
          <DexMedalTile key={medal.key} medal={medal} bordered />
        ))}
      </Grid>
      <DexNextCard
        next={board.next}
        note={
          <Text typography="body4" foreground="hint">
            {note}
          </Text>
        }
      />
    </DexSection>
  ));
}
