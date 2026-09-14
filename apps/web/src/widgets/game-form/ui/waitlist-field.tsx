"use client";

import { Chip, Field, Text } from "@trpg/ui";

const OPTIONS = [
  { value: true, label: "대기 받기" },
  { value: false, label: "받지 않기" },
] as const;

// 켜고 끄는 게 무엇을 바꾸는지는 칩만으로 전해지지 않아서 아래에 한 줄로 설명한다(ScheduleModeField와 같은 모양).
export function WaitlistField({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const hint = value
    ? "정원이 차도 대기로 신청을 받습니다. 빈자리가 나면 대기 순서대로 확정됩니다."
    : "정원이 차면 더 이상 신청을 받지 않습니다. 목록에는 '모집 마감'으로 남습니다.";

  return (
    <>
      <Field label="대기 신청">
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map((option) => (
            <Chip
              key={option.label}
              shape="block"
              selected={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Text typography="body4" foreground="muted" className="-mt-2">
        {hint}
      </Text>
    </>
  );
}
