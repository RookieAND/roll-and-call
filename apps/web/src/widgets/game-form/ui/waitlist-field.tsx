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
    ? "자리가 나면 GM이 순서대로 처리합니다."
    : "끄면 정원이 차는 순간 신청이 닫힙니다.";

  return (
    <div className="flex min-h-11 items-center justify-between gap-3 rounded-400 border border-gray-200 px-3 py-3">
      <div className="min-w-0">
        <Text typography="subtitle2" render={<label htmlFor="waitlistEnabled" />} className="block">
          정원이 차도 대기 신청 받기
        </Text>
        <Text
          typography="body4"
          foreground="hint"
          render={<p />}
          id="waitlistEnabled-hint"
          className="mt-1 leading-[1.55]"
        >
          {hint}
        </Text>
      </div>
      <Switch
        id="waitlistEnabled"
        checked={value}
        onCheckedChange={onChange}
        aria-describedby="waitlistEnabled-hint"
        className="flex-none"
      />
    </div>
  );
}
