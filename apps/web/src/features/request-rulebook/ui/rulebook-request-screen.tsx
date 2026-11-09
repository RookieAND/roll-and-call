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
              <Text typography="heading2" render={<h1 />} className="break-keep">
                {query ? `"${query}"에 맞는 룰북이 없습니다` : "찾는 룰북을 알려 주세요"}
              </Text>
              <Text typography="body2" foreground="muted" render={<p />}>
                기본 룰북부터 서플리먼트까지, 여러 권을 한 번에 요청하세요.
                <br />
                검토 결과는 책마다 알림으로 알려 드립니다.
              </Text>
            </VStack>
          }
          onSent={() => router.replace(toServerPath("/me/rulebooks/apply?step=books"))}
          renderFooter={({ submit, pending, disabled, count }) => (
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
                    {count}권 추가 요청 보내기
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
