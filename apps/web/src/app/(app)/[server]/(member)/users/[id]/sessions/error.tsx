"use client";

import { Button, Card, Container, Text, UiImage, VStack } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

// views/user-sessions 배럴은 서버 모듈을 끌고 와 클라이언트 경계에서 쓸 수 없어 화면을 여기서 그린다.
export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  const { id } = useParams<{ id: string }>();
  return (
    <PageShell appBar={<AppBar back={`/users/${id}`} title="세션" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="desktop:max-w-none">
          <div className="py-250">
            <Card.Root padding="none" background="none">
              <VStack gap="150" className="items-center text-center">
                <UiImage name="empty-error" width={104} height={104} />
                <VStack gap="050" className="items-center">
                  <Text typography="subtitle1">세션 기록을 불러오지 못했습니다</Text>
                  <Text typography="body3" foreground="muted">
                    잠시 뒤 다시 시도해 주세요.
                  </Text>
                  <div className="pt-100">
                    <Button variant="outline" size="sm" onClick={retry}>
                      다시 시도
                    </Button>
                  </div>
                </VStack>
              </VStack>
            </Card.Root>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
