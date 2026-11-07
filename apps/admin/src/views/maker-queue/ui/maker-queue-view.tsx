import { VStack } from "@roll-and-call/ui";

import { CertRouteTabs, type CertTabCountKey } from "@/entities/cert";
import type { listHomebrewQueue } from "@/entities/homebrew/server";
import { AdminHeader, Panel } from "@/shared/ui";

import { MakerQueueTable } from "./maker-queue-table";

interface MakerQueueViewProps {
  rows: Awaited<ReturnType<typeof listHomebrewQueue>>;
  tabCounts: Record<CertTabCountKey, number>;
}

export function MakerQueueView({ rows, tabCounts }: MakerQueueViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertRouteTabs value="/cert/maker" counts={tabCounts} />
      <VStack gap="150" className="flex-1 p-200">
        <Panel>
          <MakerQueueTable rows={rows} />
        </Panel>
      </VStack>
    </>
  );
}
