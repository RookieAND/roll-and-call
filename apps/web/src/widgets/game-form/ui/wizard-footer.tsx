"use client";

import { Button, Container, Text, VStack } from "@trpg/ui";

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
      <Container size="md" className="py-3">
        <VStack gap={3}>
          {isLastStep && error && (
            <Text typography="body2" foreground="danger" render={<p />}>
              {error}
            </Text>
          )}
          <div className="flex gap-2 [&>*]:flex-1">
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
            {isLastStep ? (
              <Button type="submit" loading={pending} size="lg" className="h-[50px]">
                {pending ? "저장 중…" : submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={onNext} size="lg" className="h-[50px]">
                다음
              </Button>
            )}
          </div>
        </VStack>
      </Container>
    </div>
  );
}
