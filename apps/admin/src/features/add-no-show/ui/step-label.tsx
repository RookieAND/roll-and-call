import { Text } from "@roll-and-call/ui";

interface StepLabelProps {
  id: string;
  step: number;
  label: string;
  required?: boolean;
}

export function StepLabel({ id, step, label, required }: StepLabelProps) {
  return (
    <Text id={id} typography="body4" weight="bold">
      {step} {label}
      {required ? (
        <Text typography="body4" foreground="danger" render={<span />}>
          {" "}
          *
        </Text>
      ) : null}
    </Text>
  );
}
