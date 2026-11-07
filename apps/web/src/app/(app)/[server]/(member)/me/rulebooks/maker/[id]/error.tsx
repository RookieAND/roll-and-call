"use client";

import { Button, Callout, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks" title="내가 만든 룰" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack className="p-200">
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              내가 만든 룰을 불러오지 못했습니다. 다시 시도해 주세요.
            </Callout.Description>
            <Callout.Action>
              <Button size="sm" variant="ghost" colorPalette="danger" onClick={retry}>
                다시 시도
              </Button>
            </Callout.Action>
          </Callout.Root>
        </VStack>
      </div>
    </PageShell>
  );
}
