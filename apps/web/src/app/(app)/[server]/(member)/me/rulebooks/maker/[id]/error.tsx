"use client";

import { Button, Callout, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, LineBreaks, PageShell } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks" title="자작 룰" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack className="p-200">
          <Callout.Root colorPalette="danger">
            <Callout.Description>
              <LineBreaks lines={["자작 룰을 불러오지 못했습니다.", "다시 시도해 주세요."]} />
            </Callout.Description>
            <Callout.Action>
              <Button size="sm" variant="outline" onClick={retry}>
                다시 시도
              </Button>
            </Callout.Action>
          </Callout.Root>
        </VStack>
      </div>
    </PageShell>
  );
}
