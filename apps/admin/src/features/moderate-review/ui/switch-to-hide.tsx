import { Button, HStack, Text } from "@roll-and-call/ui";

interface SwitchToHideProps {
  onSwitch: () => void;
}

export function SwitchToHide({ onSwitch }: SwitchToHideProps) {
  return (
    <HStack align="center" gap="075">
      <Text typography="body4" foreground="hint">
        다시 보이게 할 수 있다면
      </Text>
      <Button variant="ghost" size="sm" onClick={onSwitch}>
        숨김으로 바꾸기
      </Button>
    </HStack>
  );
}
