import { Button, Container, FloatingBar, Text, UiImage, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface NoDrawEmptyProps {
  gameId: string;
}

export function NoDrawEmpty({ gameId }: NoDrawEmptyProps) {
  return (
    <Container size="sm" className="py-200">
      <FloatingBar.Root elevated={false}>
        <VStack align="center" gap="100" className="px-150 pt-400 pb-300 text-center">
          <UiImage name="empty-party" width={140} height={140} />
          <Text typography="subtitle1" render={<h2 />}>
            추첨 없이 확정된 구인입니다
          </Text>
          <Text typography="body3" foreground="muted" render={<p />}>
            신청자가 모두 확정되어 추첨을 하지 않았습니다.
            <br />
            추첨 결과는 추첨을 한 구인에만 있습니다.
          </Text>
        </VStack>
        <FloatingBar.Spacer />
        <FloatingBar.Content>
          <Button render={<ServerLink path={`/games/${gameId}`} />} size="lg" className="w-full">
            구인 상세 보기
          </Button>
        </FloatingBar.Content>
      </FloatingBar.Root>
    </Container>
  );
}
