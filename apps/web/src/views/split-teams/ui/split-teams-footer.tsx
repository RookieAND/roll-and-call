import { Button, Callout, Container, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";

interface SplitTeamsFooterProps {
  isLastStep: boolean;
  pending: boolean;
  ready: boolean;
  hint: string | null;
  failed: boolean;
  onNext: () => void;
  onBack: () => void;
  onRetry: () => void;
}

export function SplitTeamsFooter({
  isLastStep,
  pending,
  ready,
  hint,
  failed,
  onNext,
  onBack,
  onRetry,
}: SplitTeamsFooterProps) {
  const backLabel = isLastStep ? "이전" : "취소";

  return (
    <FloatingBar.Root elevated={false}>
      <FloatingBar.Content>
        <Container size="md" className="desktop:max-w-160 desktop:px-0">
          <VStack gap="100">
            {hint && (
              <Text typography="body4" foreground="hint" render={<p />} className="text-center">
                {hint}
              </Text>
            )}
            {failed && (
              <Callout.Root colorPalette="danger" size="sm">
                <Callout.Icon />
                <Callout.Description>
                  구인을 열지 못했습니다.
                  <br />
                  선택한 내용은 그대로 있습니다.
                </Callout.Description>
                <Callout.Action>
                  <Button variant="ghost" size="sm" colorPalette="danger" onClick={onRetry}>
                    다시 시도
                  </Button>
                </Callout.Action>
              </Callout.Root>
            )}
            <HStack gap="100" className="[&>*]:flex-1">
              <Button variant="outline" size="lg" disabled={pending} onClick={onBack}>
                {backLabel}
              </Button>
              <Button size="lg" disabled={!ready} loading={pending} onClick={onNext}>
                {isLastStep ? "구인 열기" : "다음"}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
