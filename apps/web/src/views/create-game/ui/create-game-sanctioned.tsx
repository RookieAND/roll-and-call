import { Button, Card, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { Lock } from "lucide-react";

import { sanctionLines } from "@/entities/sanction";
import { AppBar, ServerLink } from "@/shared/ui";

interface CreateGameSanctionedProps {
  reason: string;
  until: Date | null;
}

export function CreateGameSanctioned({ reason, until }: CreateGameSanctionedProps) {
  const [reasonLine, periodLine] = sanctionLines({ reason, until });
  return (
    <VStack className="min-h-dvh">
      <AppBar back="/games" title="구인 등록" />
      <Container size="sm" className="flex flex-1 flex-col justify-center">
        <VStack gap="175" className="items-center py-400 text-center">
          <span className="flex size-18 items-center justify-center rounded-full bg-danger-50 text-danger-600">
            <Lock size={30} aria-hidden />
          </span>
          <Text typography="heading2" render={<h2 />}>
            지금은 구인을 열 수 없습니다
          </Text>
          <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
            활동 정지 기간에는 새 구인을 열 수 없습니다.
          </Text>
          <Card.Root background="subtle" radius={500} padding="sm">
            <VStack gap="050">
              <Text typography="body3" render={<p />} className="text-pretty">
                {reasonLine}
              </Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                {periodLine}
              </Text>
            </VStack>
          </Card.Root>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Button size="lg" className="w-full" render={<ServerLink path="/games" />}>
              구인 목록으로
            </Button>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </VStack>
  );
}
