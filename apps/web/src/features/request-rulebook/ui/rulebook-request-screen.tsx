"use client";

import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";

import { RulebookRequestBody } from "./rulebook-request-body";

interface RulebookRequestScreenProps {
  categoryNames: string[];
  pendingRequestNames: string[];
  query: string;
}

export function RulebookRequestScreen({
  categoryNames,
  pendingRequestNames,
  query,
}: RulebookRequestScreenProps) {
  const router = useRouter();
  const toServerPath = useServerPath();

  return (
    <Container size="sm">
      <VStack className="pt-250 pb-300">
        <RulebookRequestBody
          categoryNames={categoryNames}
          pendingRequestNames={pendingRequestNames}
          initialName={query}
          intro={
            <VStack gap="050">
              {query && (
                <Text typography="heading1" render={<h1 />} className="break-keep">
                  "{query}"에 맞는 룰북이 없습니다
                </Text>
              )}
              <Text typography="body2" foreground="muted" render={<p />}>
                아래 내용을 보내 주시면 운영진이 확인합니다.
                <br />
                추가되면 알림 탭으로 알립니다.
              </Text>
            </VStack>
          }
          onSent={() => router.replace(toServerPath("/me/rulebooks/apply"))}
          renderFooter={({ submit, pending, disabled }) => (
            <FloatingBar.Root elevated={false}>
              <FloatingBar.Content>
                <Container size="sm">
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={disabled}
                    loading={pending}
                    onClick={submit}
                  >
                    추가 요청 보내기
                  </Button>
                </Container>
              </FloatingBar.Content>
              <FloatingBar.Spacer />
            </FloatingBar.Root>
          )}
        />
      </VStack>
    </Container>
  );
}
