"use client";

import { Button, Callout, Container, HStack, VStack } from "@roll-and-call/ui";

import { WizardNextButton } from "./wizard-next-button";
import { WizardSavingButton } from "./wizard-saving-button";
import { WizardSubmitButton } from "./wizard-submit-button";

interface WizardFooterProps {
  step: number;
  total: number;
  pending: boolean;
  submitLabel: string;
  error?: string;
  cancelLabel?: string;
  onNext: () => void;
  onBack: () => void;
}

export function WizardFooter({
  step,
  total,
  pending,
  submitLabel,
  error,
  cancelLabel,
  onNext,
  onBack,
}: WizardFooterProps) {
  const isFirstStep = step === 0;
  const isLastStep = step === total - 1;
  const backLabel = isFirstStep ? cancelLabel : "이전";

  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
      <Container size="md" className="py-150">
        <VStack gap="150">
          {isLastStep && error && (
            <Callout tone="danger" className="whitespace-pre-line">
              {error}
            </Callout>
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
            {!isLastStep && <WizardNextButton key="next" onClick={onNext} />}
            {isLastStep && pending && <WizardSavingButton key="submit" />}
            {isLastStep && !pending && <WizardSubmitButton key="submit" label={submitLabel} />}
          </HStack>
        </VStack>
      </Container>
    </div>
  );
}
