import { Container } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { ReviewListSkeleton } from "@/views/reviews";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="작성한 후기" />
      <Container size="sm" className="py-200">
        <ReviewListSkeleton />
      </Container>
    </>
  );
}
