"use client";

import { Button, Container } from "@roll-and-call/ui";

import { AppBar, EmptyState } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <>
      <AppBar back="/me" title="내 룰북" />
      <Container size="sm" className="py-300">
        <EmptyState
          image="/empty-states/empty-error.png"
          title="내 룰북을 불러오지 못했습니다"
          description="잠시 후 다시 시도해 주세요."
          action={
            <Button variant="outline" onClick={retry} className="mt-100">
              다시 시도
            </Button>
          }
        />
      </Container>
    </>
  );
}
