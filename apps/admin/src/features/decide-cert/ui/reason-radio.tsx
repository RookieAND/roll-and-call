import { HStack, Radio, RadioGroup, TextInput } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { OTHER_REASON, REJECT_REASONS } from "../model/reject-reasons";

const reasonRow = cva("min-h-11 border-(--rc-color-border-subtle) px-150", {
  variants: {
    selected: { true: "bg-(--rc-color-bg-primary-weakest)", false: "" },
    divided: { true: "border-t", false: "" },
  },
});

interface ReasonRadioProps {
  value: string;
  otherReason: string;
  onValueChange: (value: string) => void;
  onOtherReasonChange: (otherReason: string) => void;
  labelledBy: string;
}

// 사유 문장이 길어 칩 대신 세로 목록으로 둔다. 기타를 골랐을 때만 직접 입력란이 열린다.
export function ReasonRadio({
  value,
  otherReason,
  onValueChange,
  onOtherReasonChange,
  labelledBy,
}: ReasonRadioProps) {
  const otherSelected = value === OTHER_REASON;
  return (
    <RadioGroup
      value={value || null}
      onValueChange={(next) => onValueChange(next as string)}
      aria-labelledby={labelledBy}
      className="flex flex-col overflow-hidden rounded-400 border border-gray-200 bg-surface"
    >
      {REJECT_REASONS.map((reason, index) => (
        <HStack
          key={reason}
          align="center"
          className={reasonRow({ selected: value === reason, divided: index > 0 })}
        >
          <Radio.Field>
            <Radio.Root value={reason}>
              <Radio.Indicator />
            </Radio.Root>
            <Radio.Label>{reason}</Radio.Label>
          </Radio.Field>
        </HStack>
      ))}
      <HStack
        align="center"
        gap="125"
        className={reasonRow({ selected: otherSelected, divided: true })}
      >
        <Radio.Field className="shrink-0">
          <Radio.Root value={OTHER_REASON}>
            <Radio.Indicator />
          </Radio.Root>
          <Radio.Label>{OTHER_REASON}</Radio.Label>
        </Radio.Field>
        <TextInput
          value={otherReason}
          disabled={!otherSelected}
          placeholder="목록에 없는 사유를 적어 주세요"
          aria-label="기타 사유"
          onChange={(event) => onOtherReasonChange(event.target.value)}
          className="my-075 min-w-0 flex-1"
        />
      </HStack>
    </RadioGroup>
  );
}
