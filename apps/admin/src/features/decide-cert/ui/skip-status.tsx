import { Button, Text } from "@roll-and-call/ui";

interface SkipStatusProps {
  onSkip: () => void;
}

export function SkipStatus({ onSkip }: SkipStatusProps) {
  return (
    <>
      <Button variant="outline" colorPalette="gray" size="sm" onClick={onSkip}>
        건너뛰기
      </Button>
      <Text typography="body4" foreground="hint">
        처리하면 바로 다음 건으로 넘어갑니다
      </Text>
    </>
  );
}
