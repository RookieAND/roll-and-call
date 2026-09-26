import { Text } from "@roll-and-call/ui";

interface StepCountProps {
  step: number;
}

export function StepCount({ step }: StepCountProps) {
  return (
    <Text typography="body4" foreground="hint" numeric className="px-100">
      {step} / 2
    </Text>
  );
}
