import { Badge, Card, Text, VStack } from "@roll-and-call/ui";

import { WizardProgressSection, type WizardPanelStep } from "@/shared/ui";

interface SplitTeamsSidePanelProps {
  steps: readonly WizardPanelStep[];
  current: number;
  title: string;
  ruleLabel: string;
  capacity: number;
  onSelectStep: (index: number) => void;
}

// 1100px 이상에서 팀 나누기 오른쪽에 서는 요약과 진행 상황.
export function SplitTeamsSidePanel({
  steps,
  current,
  title,
  ruleLabel,
  capacity,
  onSelectStep,
}: SplitTeamsSidePanelProps) {
  return (
    <VStack gap="250" className="sticky top-7">
      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" foreground="muted" render={<h2 />}>
          구인 요약
        </Text>
        <Card.Root radius={500} padding="md">
          <VStack gap="075">
            <Text typography="heading3" render={<p />} className="truncate">
              {title}
            </Text>
            <Text typography="body4" foreground="muted" render={<p />} className="truncate">
              {ruleLabel}
            </Text>
            <div className="flex flex-wrap gap-075 pt-050">
              <Badge colorPalette="primary">작성 중</Badge>
              {capacity > 0 && <Badge colorPalette="gray">정원 {capacity}명</Badge>}
            </div>
          </VStack>
        </Card.Root>
      </VStack>

      <WizardProgressSection steps={steps} current={current} onSelectStep={onSelectStep} />
    </VStack>
  );
}
