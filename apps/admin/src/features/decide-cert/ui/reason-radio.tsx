import { HStack, Radio, RadioGroup, TextInput } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { OTHER_REASON, type RejectReason } from "../model/reject-reasons";

const reasonRow = cva("min-h-11 border-(--rc-color-border-subtle) px-150", {
  variants: {
    selected: { true: "bg-(--rc-color-bg-primary-weakest)", false: "" },
    divided: { true: "border-t", false: "" },
  },
});

interface ReasonRadioProps {
  reasons: readonly RejectReason[];
  value: string;
  // 「기타」를 고르면 이 입력란이 사용자에게 보이는 사유가 된다.
  otherText: string;
  onValueChange: (value: string) => void;
  onOtherTextChange: (otherText: string) => void;
  label: string;
}

export function ReasonRadio({
  reasons,
  value,
  otherText,
  onValueChange,
  onOtherTextChange,
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
          key={reason.name}
          align="center"
          gap="125"
          className={reasonRow({ selected: value === reason.name, divided: index > 0 })}
        >
          <Radio.Field className="shrink-0">
            <Radio.Root value={reason.name}>
              <Radio.Indicator />
            </Radio.Root>
            <Radio.Label>{reason.name}</Radio.Label>
          </Radio.Field>
          {reason.name === OTHER_REASON ? (
            <TextInput
              value={otherSelected ? otherText : ""}
              disabled={!otherSelected}
              placeholder="사용자에게 보이는 사유를 직접 적어 주세요"
              aria-label="기타 사유"
              onChange={(event) => onOtherTextChange(event.target.value)}
              className="my-075 min-w-0 flex-1"
            />
          ) : null}
        </HStack>
      ))}
    </RadioGroup>
  );
}
