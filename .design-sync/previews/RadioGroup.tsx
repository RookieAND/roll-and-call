import { Radio, RadioGroup } from "@roll-and-call/ui";

export const TimeSlot = () => (
  <RadioGroup name="time-slot" defaultValue="evening" aria-label="일정 조율" className="flex gap-200">
    <Radio.Field>
      <Radio.Root value="morning">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>오전</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="afternoon">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>오후</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="evening">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>저녁</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);

export const ReadOnlyConfirmed = () => (
  <RadioGroup
    name="attendance-status"
    defaultValue="confirmed"
    readOnly
    aria-label="확정된 참여 상태"
    className="flex flex-col gap-150"
  >
    <Radio.Field>
      <Radio.Root value="confirmed">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>확정</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="waiting">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>대기</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);

export const PartialDisabled = () => (
  <RadioGroup
    name="recruit-method-partial"
    defaultValue="lottery"
    aria-label="모집 방식 (일부 마감)"
    className="flex flex-col gap-150"
  >
    <Radio.Field>
      <Radio.Root value="first-come" disabled>
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>선착순 (마감)</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="lottery">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>추첨</Radio.Label>
    </Radio.Field>
    <Radio.Field>
      <Radio.Root value="gm-approval">
        <Radio.Indicator />
      </Radio.Root>
      <Radio.Label>GM 승인</Radio.Label>
    </Radio.Field>
  </RadioGroup>
);
