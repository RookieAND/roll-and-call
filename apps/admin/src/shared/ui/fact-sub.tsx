import { Text } from "@roll-and-call/ui";

interface FactSubProps {
  children: string;
}

// FactRows 값 뒤에 붙는 보조 설명.
export function FactSub({ children }: FactSubProps) {
  return (
    <Text typography="body3" weight="regular" foreground="hint">
      {children}
    </Text>
  );
}
