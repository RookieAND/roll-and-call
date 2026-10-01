import { Container, VStack } from "@roll-and-call/ui";

import { AppBar, HelpButton } from "@/shared/ui";
import { MyPageLoading } from "@/views/my-page";

export default function Loading() {
  return (
    <>
      <AppBar title="마이페이지" action={<HelpButton />} />
      <Container size="sm">
        <VStack gap="250" className="py-225">
          <MyPageLoading />
        </VStack>
      </Container>
    </>
  );
}
