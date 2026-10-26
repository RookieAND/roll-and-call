import { Badge, Callout, Card, Text, VStack } from "@roll-and-call/ui";

import { GameStatusBadge, PrivateMark, type GameStatus } from "@/entities/game";

import { isWizardStepSelectable, wizardStepState } from "../model/wizard-step-state";
import { WizardStepRow } from "./wizard-step-row";

export interface WizardPanelStep {
  number: number;
  label: string;
}

interface WizardSidePanelProps {
  steps: readonly WizardPanelStep[];
  current: number;
  editing: boolean;
  // 수정 중인 구인의 상태. 새 구인은 없다.
  status?: GameStatus;
  title: string;
  ruleLabel: string;
  timeLabel: string;
  capacity: number;
  isPrivate?: boolean;
  onSelectStep: (index: number) => void;
}

// 1100px 이상에서 위저드 오른쪽에 서는 요약과 진행 상황. 입력 값은 폼에서 바로 읽어 온다.
export function WizardSidePanel({
  steps,
  current,
  editing,
  status,
  title,
  ruleLabel,
  timeLabel,
  capacity,
  isPrivate = false,
  onSelectStep,
}: WizardSidePanelProps) {
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
              {ruleLabel} · {timeLabel}
            </Text>
            <div className="flex flex-wrap gap-075 pt-050">
              {status ? (
                <GameStatusBadge status={status} />
              ) : (
                <Badge colorPalette="primary">작성 중</Badge>
              )}
              <Badge colorPalette="gray">정원 {capacity}명</Badge>
              {isPrivate && <PrivateMark />}
            </div>
          </VStack>
        </Card.Root>
      </VStack>

      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" foreground="muted" render={<h2 />}>
          진행 상황
        </Text>
        <ol className="flex flex-col gap-025">
          {steps.map((step, index) => {
            const state = wizardStepState({ index, current });
            return (
              <WizardStepRow
                key={step.number}
                number={step.number}
                label={step.label}
                state={state}
                editing={editing}
                onSelect={isWizardStepSelectable(state) ? () => onSelectStep(index) : undefined}
              />
            );
          })}
        </ol>
      </VStack>

      <Callout.Root colorPalette="gray" size="sm">
        <Callout.Description>
          {editing ? (
            "수정 후 저장하면 디스코드 공지와 스레드에도 바로 반영됩니다."
          ) : (
            <>
              구인은 {steps.length}단계에서 등록하면 만들어집니다.
              <br />그 전에 닫으면 쓴 내용은 저장되지 않습니다.
            </>
          )}
        </Callout.Description>
      </Callout.Root>
    </VStack>
  );
}
