import { Container, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AppBar } from "@/shared/ui";

interface ReviewsPageProps {
  title: string;
  back: string;
  children: ReactNode;
}

export function ReviewsPage({ title, back, children }: ReviewsPageProps) {
  return (
    <>
      <AppBar back={back} title={title} />
      <Container size="sm">
        <VStack gap="150" className="py-200 break-keep">
          {children}
        </VStack>
      </Container>
    </>
  );
}
