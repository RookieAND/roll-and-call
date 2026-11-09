"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Container, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

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
            최대 {RULEBOOK_REQUEST_MAX_BOOKS}권까지 함께 요청할 수 있어요.
            <br />
            운영진은 책마다 따로 검토하고, 결과를 알림으로 알려 드립니다.
          </Text>
        </VStack>
      }
      onSent={() => router.replace(toServerPath("/me/rulebooks/apply?step=books"))}
      renderLayout={({ editor, list }) => (
        <PageShell
          readable
          appBar={
            <AppBar back="/me/rulebooks/apply?step=books" title="룰북 추가 요청" heading={false} />
          }
          panel={list}
        >
          <div className={DESKTOP_CARD_CLASS}>
            <Container size="sm">
              <div className="pt-250 pb-300">{editor}</div>
            </Container>
          </div>
          <div className="px-200 pb-250 desktop:hidden">{list}</div>
        </PageShell>
      )}
    />
  );
}
