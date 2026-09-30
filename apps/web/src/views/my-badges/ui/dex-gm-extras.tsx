import { Grid, Progress, Text } from "@roll-and-call/ui";

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
  const nextReviewKey = reviews.medals.find((medal) => medal.locked)?.key;
  return (
    <>
      <DexSection title="다양한 룰 운영" hint={variety.hint}>
        <Grid cols={3} gap="100">
          {variety.medals.map((medal) => (
            <DexMedalTile key={medal.key} medal={medal} bordered />
          ))}
        </Grid>
        <DexNextCard
          next={variety.next}
          note={
            <Text typography="body4" foreground="hint">
              판본만 다른 같은 룰은 1종으로 셉니다
            </Text>
          }
        />
      </DexSection>
      <DexSection title="받은 후기">
        <Grid cols={3} gap="100">
          {reviews.medals.map((medal) => {
            // 진행 막대는 바로 다음 단계에만 둔다. 그 뒤 단계는 조건만 보인다.
            const next = medal.key === nextReviewKey;
            const caption = next
              ? `받은 후기 ${reviews.count} / ${medal.threshold}`
              : medal.caption;
            return (
              <DexMedalTile key={medal.key} medal={medal} bordered caption={caption}>
                {next && (
                  <Progress
                    value={reviews.count}
                    max={medal.threshold}
                    variant="tinted"
                    className="mt-050"
                  />
                )}
              </DexMedalTile>
            );
          })}
        </Grid>
      </DexSection>
    </>
  );
}
