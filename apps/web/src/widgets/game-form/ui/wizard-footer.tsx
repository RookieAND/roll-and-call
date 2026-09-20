"use client";

import { Button, Container, HStack, Text, VStack } from "@trpg/ui";

export function WizardFooter({
  step,
  total,
  pending,
  submitLabel,
  error,
  cancelLabel,
  onNext,
  onBack,
}: {
  step: number;
  total: number;
  pending: boolean;
  submitLabel: string;
  error?: string;
  cancelLabel?: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const isFirstStep = step === 0;
  const isLastStep = step === total - 1;
  const backLabel = isFirstStep ? cancelLabel : "이전";

  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
      <Container size="md" className="py-150">
        <VStack gap="150">
          {isLastStep && error && (
            <Text typography="body2" foreground="danger" render={<p />}>
              {error}
            </Text>
          )}
          <HStack gap="100" className="[&>*]:flex-1">
            {backLabel && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                size="lg"
                className="h-[50px]"
              >
                {backLabel}
              </Button>
            )}
            {/* key가 없으면 같은 DOM 버튼의 type만 submit으로 바뀌어, 마지막 단계로 넘어간 그
                클릭이 곧바로 제출로 이어진다. */}
            {isLastStep ? (
              <Button key="submit" type="submit" loading={pending} size="lg" className="h-[50px]">
                {pending ? "저장 중…" : submitLabel}
              </Button>
            ) : (
              <Button key="next" type="button" onClick={onNext} size="lg" className="h-[50px]">
                다음
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    </div>
  );
}
