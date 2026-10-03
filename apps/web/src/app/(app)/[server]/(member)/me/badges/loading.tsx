import { Container } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { DexSkeleton } from "@/views/my-badges";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="업적 도감" />
      <Container size="sm" className="px-0">
        <DexSkeleton />
      </Container>
    </>
  );
}
