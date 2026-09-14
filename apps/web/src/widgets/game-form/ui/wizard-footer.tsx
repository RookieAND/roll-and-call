"use client";

import { Button, Container, HStack, Text, VStack } from "@trpg/ui";
import { LAST_WIZARD_STEP, type WizardStep } from "./wizard-header";

// CTA를 BottomNav(높이 58px) 바로 위에 sticky로 고정한다.
// 첫 단계는 "다음"만, 중간은 "이전 + 다음", 마지막은 "이전 + 제출".
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
  // 제출 실패 사유. 마지막 단계에서만 보여준다.
  error?: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const isFirstStep = step === 1;
  const isLastStep = step === LAST_WIZARD_STEP;
  const submitText = pending ? "저장 중…" : submitLabel;

  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
      <Container size="md" className="py-3">
        <VStack gap={3}>
          {isLastStep && error && (
            <Text typography="body2" foreground="danger">
              {error}
            </Text>
          )}
          {isFirstStep ? (
            <Button type="button" onClick={onNext} size="lg" className="h-[50px] w-full">
              다음
            </Button>
          ) : (
            <HStack gap={2}>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                size="lg"
                className="h-[50px] w-[104px]"
              >
                이전
              </Button>
              {isLastStep ? (
                <Button type="submit" loading={pending} size="lg" className="h-[50px] flex-1">
                  {submitText}
                </Button>
              ) : (
                <Button type="button" onClick={onNext} size="lg" className="h-[50px] flex-1">
                  다음
                </Button>
              )}
            </HStack>
          )}
        </VStack>
      </Container>
    </div>
  );
}
