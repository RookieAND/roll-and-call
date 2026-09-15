"use client";

import { Switch, Text } from "@trpg/ui";

export function WaitlistField({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const hint = value
    ? '켜두면 목록에 "대기 접수 중"으로 남고, 자리가 나면 GM이 순서대로 올릴 수 있습니다.'
    : "끄면 정원이 차는 순간 신청이 닫힙니다.";

  return (
    <div className="flex min-h-11 items-start justify-between gap-3">
      <div className="min-w-0">
        <Text typography="subtitle2" render={<label htmlFor="waitlistEnabled" />} className="block">
          정원이 차도 대기 신청 받기
        </Text>
        <Text
          typography="body4"
          foreground="hint"
          render={<p />}
          id="waitlistEnabled-hint"
          className="mt-0.5"
        >
          {hint}
        </Text>
      </div>
      <Switch
        id="waitlistEnabled"
        checked={value}
        onCheckedChange={onChange}
        aria-describedby="waitlistEnabled-hint"
        className="mt-0.5"
      />
    </div>
  );
}
