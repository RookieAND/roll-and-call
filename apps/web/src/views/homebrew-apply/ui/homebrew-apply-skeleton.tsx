import { Grid, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

const TEXT_FIELD_COUNT = 3;

export function HomebrewApplySkeleton() {
  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks/apply" title="자작 룰 등록 신청" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack aria-busy gap="250" className="px-200 pt-200 pb-250">
          {range(TEXT_FIELD_COUNT).map((index) => (
            <VStack key={index} gap="075">
              <Skeleton width={72} height={16} />
              <Skeleton width="100%" height={44} rounded={400} />
            </VStack>
          ))}
          <VStack gap="100">
            <Skeleton width={64} height={18} />
            <Skeleton width="100%" height={44} rounded={400} />
            <Grid cols={3} gap="100">
              {range(3).map((index) => (
                <Skeleton key={index} width="100%" height={104} rounded={500} />
              ))}
            </Grid>
          </VStack>
        </VStack>
      </div>
    </PageShell>
  );
}
