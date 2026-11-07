import type { Metadata } from "next";

import { getCertTabCounts } from "@/entities/cert/server";
import { listHomebrewQueue } from "@/entities/homebrew/server";
import { MakerQueueMobileView, MakerQueueView } from "@/views/maker-queue";

export const metadata: Metadata = { title: "자작 룰 심사" };

export default async function MakerQueuePage() {
  const [rows, tabCounts] = await Promise.all([listHomebrewQueue(), getCertTabCounts()]);
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MakerQueueView rows={rows} tabCounts={tabCounts} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <MakerQueueMobileView rows={rows} tabCounts={tabCounts} />
      </div>
    </>
  );
}
