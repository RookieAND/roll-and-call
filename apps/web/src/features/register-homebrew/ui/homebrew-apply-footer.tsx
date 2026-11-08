import { Button, Callout, Container, FloatingBar, HStack, VStack } from "@roll-and-call/ui";

interface HomebrewApplyFooterProps {
  isLastStep: boolean;
  pending: boolean;
  canProceed: boolean;
  canSubmit: boolean;
  failure: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function HomebrewApplyFooter({
  isLastStep,
  pending,
  canProceed,
  canSubmit,
  failure,
  onNext,
  onBack,
}: HomebrewApplyFooterProps) {
  const backLabel = isLastStep ? "이전" : "취소";

  return (
    <FloatingBar.Root elevated={false}>
      <FloatingBar.Content>
        <Container size="md" className="desktop:max-w-160 desktop:px-0">
          <VStack gap="100">
            {failure && (
              <Callout.Root colorPalette="danger" size="sm">
                <Callout.Icon />
                <Callout.Description>{`신청하지 못했습니다. ${failure}`}</Callout.Description>
              </Callout.Root>
            )}
            <HStack gap="100" className="[&>*]:flex-1">
              <Button type="button" variant="outline" size="lg" disabled={pending} onClick={onBack}>
                {backLabel}
              </Button>
              {/* key가 없으면 같은 DOM 버튼의 type만 submit으로 바뀌어, 마지막 단계로 넘어간 그 클릭이 곧바로 제출로 이어진다. */}
              {isLastStep ? (
                <Button
                  key="submit"
                  type="submit"
                  size="lg"
                  loading={pending}
                  disabled={!canSubmit}
                >
                  신청하기
                </Button>
              ) : (
                <Button key="next" type="button" size="lg" disabled={!canProceed} onClick={onNext}>
                  다음
                </Button>
              )}
            </HStack>
          </VStack>
        </Container>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
