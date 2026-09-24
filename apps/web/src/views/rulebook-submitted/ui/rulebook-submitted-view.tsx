import { Button, Container, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookSubmittedViewProps {
  rulebookId: string;
}

export async function RulebookSubmittedView({ rulebookId }: RulebookSubmittedViewProps) {
  const user = await getCurrentSessionUser();
  const { rulebooks } = toMyRulebooks(await getRulebookRecords(user?.id ?? null));
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook || rulebook.state !== CERT_STATE.pending) notFound();

  return (
    <>
      <AppBar back="/me" backIcon="close" title="인증 신청 완료" />
      <Container size="sm">
        <VStack
          align="center"
          justify="center"
          gap="125"
          className="min-h-[60dvh] px-300 text-center"
        >
          <span className="mb-100 flex size-[72px] items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <Clock size={34} aria-hidden />
          </span>
          <Text typography="heading2" render={<h1 />}>
            인증 신청을 보냈습니다
          </Text>
          <Text typography="body2" foreground="muted" render={<p />} className="[text-wrap:pretty]">
            운영진은 보통 2~3일 안에 신청 내용을 확인합니다.
            <br />
            확인 결과는 마이페이지의 "인증한 룰북"에서 볼 수 있습니다.
          </Text>
          <HStack align="center" gap="100" className="mt-125 rounded-400 bg-gray-50 px-150 py-100">
            <Clock size={15} strokeWidth={2.2} aria-hidden className="text-gray-600" />
            <Text typography="body3" weight="bold">
              {rulebook.label}
            </Text>
            <Text typography="body3" foreground="muted">
              확인 중
            </Text>
          </HStack>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <HStack gap="100" className="[&>*]:flex-1">
              <Button
                render={<Link href={`/me/rulebooks/${rulebookId}`} />}
                variant="outline"
                size="lg"
              >
                신청 내용 보기
              </Button>
              <Button render={<Link href="/me" />} size="lg">
                마이페이지로
              </Button>
            </HStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
