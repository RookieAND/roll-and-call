import { Container, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface ReviewsPageProps {
  title: string;
  back: string;
  children: ReactNode;
}

export function ReviewsPage({ title, back, children }: ReviewsPageProps) {
  return (
    <PageShell appBar={<AppBar back={back} title={title} />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="150" className="py-200 break-keep">
            {children}
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
