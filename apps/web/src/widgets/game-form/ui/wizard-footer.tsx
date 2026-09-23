"use client";

import { Button, Callout, Container, FloatingBar, HStack, VStack } from "@roll-and-call/ui";

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
    <FloatingBar.Root elevated={false}>
      <FloatingBar.Content>
        <Container size="md">
          <VStack gap="150">
            {isLastStep && error && (
              <Callout.Root colorPalette="danger" size="sm">
                <Callout.Icon />
                <Callout.Description>{error}</Callout.Description>
              </Callout.Root>
            )}
            <HStack gap="100" className="[&>*]:flex-1">
              {backLabel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  size="lg"
                  disabled={pending}
                >
                  {backLabel}
                </Button>
              )}
              {/* key가 없으면 같은 DOM 버튼의 type만 submit으로 바뀌어, 마지막 단계로 넘어간 그
                  클릭이 곧바로 제출로 이어진다. */}
              {!isLastStep && <WizardNextButton key="next" onClick={onNext} />}
              {isLastStep && pending && <WizardSavingButton key="submit" label={submitLabel} />}
              {isLastStep && !pending && <WizardSubmitButton key="submit" label={submitLabel} />}
            </HStack>
          </VStack>
        </Container>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
