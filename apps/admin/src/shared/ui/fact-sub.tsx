import { Text } from "@roll-and-call/ui";

interface FactSubProps {
  children: string;
}

export function FactSub({ children }: FactSubProps) {
  return (
    <Text typography="body3" weight="regular" foreground="hint">
      {children}
    </Text>
  );
}
