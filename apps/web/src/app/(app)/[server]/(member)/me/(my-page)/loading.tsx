import { Container, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, HelpButton, PageShell } from "@/shared/ui";
import { MyPageLoading, MyPagePanelLoading } from "@/views/my-page";

export default function Loading() {
  return (
    <PageShell
      readable
      appBar={<AppBar title="마이페이지" action={<HelpButton />} />}
      panel={<MyPagePanelLoading />}
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="desktop:max-w-none">
          <VStack gap="250" className="py-225">
            <MyPageLoading />
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
