import { Container } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { ReviewListSkeleton } from "@/views/reviews";

export default function Loading() {
  return (
    <PageShell appBar={<AppBar back="/me" title="진행한 세션 후기" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="py-200 desktop:max-w-none">
          <ReviewListSkeleton />
        </Container>
      </div>
    </PageShell>
  );
}
