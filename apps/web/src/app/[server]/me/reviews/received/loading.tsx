import { Container } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { ReviewListSkeleton } from "@/views/reviews";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="진행한 세션 후기" />
      <Container size="sm" className="py-200">
        <ReviewListSkeleton />
      </Container>
    </>
  );
}
