import { HStack, Radio, RadioGroup, TextInput } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { OTHER_REASON } from "../model/reject-reasons";

const reasonRow = cva("min-h-11 border-(--rc-color-border-subtle) px-150", {
  variants: {
    selected: { true: "bg-(--rc-color-bg-primary-weakest)", false: "" },
    divided: { true: "border-t", false: "" },
  },
});

interface ReasonRadioProps {
  reasons: readonly string[];
  value: string;
  otherReason: string;
  onValueChange: (value: string) => void;
  onOtherReasonChange: (otherReason: string) => void;
  label: string;
}

export function ReasonRadio({
  reasons,
  value,
  otherReason,
  onValueChange,
  onOtherReasonChange,
  label,
}: ReasonRadioProps) {
  const otherSelected = value === OTHER_REASON;
  return (
    <RadioGroup
      value={value || null}
      onValueChange={(next) => onValueChange(next as string)}
      aria-label={label}
      className="flex flex-col overflow-hidden rounded-400 border border-gray-200 bg-surface"
    >
      {reasons.map((reason, index) => (
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
