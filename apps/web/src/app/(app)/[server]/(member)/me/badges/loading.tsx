import { Container } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { DexHeaderSkeleton, DexSkeleton } from "@/views/my-badges";

export default function Loading() {
  return (
    <PageShell
      appBar={<AppBar back="/me" title="업적 도감" />}
      panel={
        <div className={DESKTOP_CARD_CLASS}>
          <DexHeaderSkeleton />
        </div>
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="px-0">
          <DexSkeleton />
        </Container>
      </div>
    </PageShell>
  );
}
