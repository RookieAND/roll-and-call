"use client";

import { Button, Container, Text, VStack } from "@trpg/ui";

import { LAST_WIZARD_STEP, type WizardStep } from "./wizard-header";

export function WizardFooter({
  step,
  pending,
  submitLabel,
  error,
  onNext,
  onBack,
}: {
  step: WizardStep;
  pending: boolean;
  submitLabel: string;
  error?: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const isFirstStep = step === 1;
  const isLastStep = step === LAST_WIZARD_STEP;
  const submitText = pending ? "저장 중…" : submitLabel;

  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
      <Container size="md" className="py-3">
        <VStack gap={3}>
          {isLastStep && error && (
            <Text typography="body2" foreground="danger" render={<p />}>
              {error}
            </Text>
          )}
          {isFirstStep ? (
            <Button type="button" onClick={onNext} size="lg" className="h-[50px] w-full">
              다음
            </Button>
          ) : (
            <div className="flex gap-2 [&>*]:flex-1">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                size="lg"
                className="h-[50px]"
              >
                이전
              </Button>
              {isLastStep ? (
                <Button type="submit" loading={pending} size="lg" className="h-[50px]">
                  {submitText}
                </Button>
              ) : (
                <Button type="button" onClick={onNext} size="lg" className="h-[50px]">
                  다음
                </Button>
              )}
            </div>
          )}
        </VStack>
      </Container>
    </div>
  );
}
