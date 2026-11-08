import { Badge, Callout, Card, Text, VStack } from "@roll-and-call/ui";

import { WizardProgressSection, type WizardPanelStep } from "@/shared/ui";

interface HomebrewSidePanelProps {
  steps: readonly WizardPanelStep[];
  current: number;
  name: string;
  edition: string;
  onSelectStep: (index: number) => void;
}

// 1100px 이상에서 신청 폼 오른쪽에 서는 요약과 진행 상황. 입력 값은 폼에서 바로 읽어 온다.
export function HomebrewSidePanel({
  steps,
  current,
  name,
  edition,
  onSelectStep,
}: HomebrewSidePanelProps) {
  const title = name.trim() || "새 룰";
  const editionLabel = edition.trim();

  return (
    <VStack gap="250" className="sticky top-7">
      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" foreground="muted" render={<h2 />}>
          신청 요약
        </Text>
        <Card.Root radius={500} padding="md">
          <VStack gap="075">
            <Text typography="heading3" render={<p />} className="truncate">
              {title}
            </Text>
            {editionLabel && (
              <Text typography="body4" foreground="muted" render={<p />} className="truncate">
                판본 {editionLabel}
              </Text>
            )}
            <div className="flex flex-wrap gap-075 pt-050">
              <Badge colorPalette="primary">작성 중</Badge>
            </div>
          </VStack>
        </Card.Root>
      </VStack>

      <WizardProgressSection steps={steps} current={current} onSelectStep={onSelectStep} />

      <Callout.Root colorPalette="gray" size="sm">
        <Callout.Icon />
        <Callout.Description>
          신청은 {steps.length}단계에서 제출하면 접수됩니다.
          <br />그 전에 닫으면 쓴 내용은 저장되지 않습니다.
        </Callout.Description>
      </Callout.Root>
    </VStack>
  );
}
