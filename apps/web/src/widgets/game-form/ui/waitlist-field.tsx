"use client";

import { HStack, Switch, Text } from "@roll-and-call/ui";

interface WaitlistFieldProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

export function WaitlistField({ value, onChange }: WaitlistFieldProps) {
  const hint = value
    ? "자리가 나면 GM이 순서대로 올립니다."
    : "끄면 정원이 차는 순간 신청이 닫힙니다.";

  return (
    <HStack
      align="center"
      justify="between"
      gap="150"
      className="min-h-11 rounded-400 border border-gray-200 px-150 py-150"
    >
      <div className="min-w-0">
        <Text
          typography="body4"
          weight="bold"
          render={<label htmlFor="waitlistEnabled" />}
          className="block"
        >
          정원이 차도 대기 신청 받기
        </Text>
        <Text
          typography="body4"
          foreground="hint"
          render={<p />}
          id="waitlistEnabled-hint"
          className="mt-050 leading-[1.55]"
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
    </HStack>
  );
}
