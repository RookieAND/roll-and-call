"use client";

import { Button, Container, HStack, Text, VStack } from "@trpg/ui";

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
            <Text
              typography="body4"
              foreground="danger"
              render={<p />}
              className="whitespace-pre-line rounded-500 border border-danger-200 bg-danger-50 px-175 py-150 leading-[1.55]"
            >
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
            {!isLastStep && <WizardNextButton key="next" onClick={onNext} />}
            {isLastStep && pending && <WizardSavingButton key="submit" />}
            {isLastStep && !pending && <WizardSubmitButton key="submit" label={submitLabel} />}
          </HStack>
        </VStack>
      </Container>
    </div>
  );
}
