import {
  Badge,
  Field,
  HStack,
  SegmentedControl,
  Text,
  TextInput,
  Textarea,
  VStack,
} from "@roll-and-call/ui";

import { FormSection, OngoingChoiceList, type OngoingChoiceRow } from "@/shared/ui";

import type { SanctionDraft } from "../model/sanction-draft";
import { SANCTION_PERIODS, type SanctionPeriod } from "../model/sanction-periods";

interface SanctionFormProps {
  draft: SanctionDraft;
  periodHint: string;
  rows: OngoingChoiceRow[];
  onDraftChange: (changes: Partial<SanctionDraft>) => void;
  onChoiceChange: (sessionId: string, action: string) => void;
}

export function SanctionForm({
  draft,
  periodHint,
  rows,
  onDraftChange,
  onChoiceChange,
}: SanctionFormProps) {
  return (
    <VStack gap="250">
      <FormSection title="1. 제재 기간" description={periodHint}>
        <SegmentedControl.Root
          value={draft.period}
          onValueChange={(period) => onDraftChange({ period: period as SanctionPeriod })}
          aria-label="제재 기간"
        >
          {SANCTION_PERIODS.map((period) => (
            <SegmentedControl.Item key={period.value} value={period.value}>
              {period.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
        {draft.period === "custom" ? (
          <HStack align="center" gap="075">
            <TextInput
              aria-label="제재 일수"
              type="number"
              inputMode="numeric"
              min={1}
              value={draft.customDays}
              onChange={(event) => onDraftChange({ customDays: event.target.value })}
              className="w-[120px]"
            />
            <Text typography="body3">일</Text>
          </HStack>
        ) : null}
      </FormSection>
      <FormSection
        title="2. 제재 사유"
        description="사용자에게 보이는 사유와 운영진끼리만 보는 메모를 나누어 적습니다."
      >
        <Field.Root
          label="사용자에게 보여줄 사유"
          htmlFor="sanction-user-reason"
          required
          description="입력한 사유는 사용자 화면에서 ‘사유:’ 뒤에 그대로 표시됩니다. 명사형으로 짧게 적어 주세요."
        >
          <Textarea
            id="sanction-user-reason"
            rows={2}
            placeholder="예: 반복된 불참"
            value={draft.userReason}
            onChange={(event) => onDraftChange({ userReason: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="sanction-staff-memo">
          <Textarea
            id="sanction-staff-memo"
            rows={2}
            placeholder="판단한 근거나 확인한 내용을 적어 주세요"
            value={draft.staffMemo}
            onChange={(event) => onDraftChange({ staffMemo: event.target.value })}
          />
        </Field.Root>
      </FormSection>
      <FormSection
        title="3. 진행 중인 활동"
        description="기본값은 그대로 진행입니다. 필요한 항목만 골라서 처리해 주세요."
        right={<Badge colorPalette="gray">{rows.length}건</Badge>}
      >
        {rows.length > 0 ? (
          <OngoingChoiceList rows={rows} onChange={onChoiceChange} />
        ) : (
          <Text typography="body4" foreground="hint">
            진행 중인 활동이 없습니다
          </Text>
        )}
      </FormSection>
    </VStack>
  );
}
