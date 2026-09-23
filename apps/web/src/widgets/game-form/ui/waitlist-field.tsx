"use client";

import { Card, HStack, Switch, Text, VStack } from "@roll-and-call/ui";

interface WaitlistFieldProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

export function WaitlistField({ value, onChange }: WaitlistFieldProps) {
  const hint = value
    ? "자리가 나면 GM이 순서대로 올립니다."
    : "끄면 정원이 차는 순간 신청이 닫힙니다.";

  return (
    <Card.Root padding="sm" radius={500}>
      <HStack align="center" gap="150" className="px-025">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle2" render={<label htmlFor="waitlistEnabled" />}>
            정원이 차도 대기 신청 받기
          </Text>
          <Text typography="body4" foreground="muted" render={<p />} id="waitlistEnabled-hint">
            {hint}
          </Text>
        </VStack>
        <Switch.Root
          id="waitlistEnabled"
          checked={value}
          onCheckedChange={onChange}
          aria-describedby="waitlistEnabled-hint"
        >
          <Switch.Control />
        </Switch.Root>
      </HStack>
    </Card.Root>
  );
}
