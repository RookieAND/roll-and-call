import { Button, Text } from "@roll-and-call/ui";

interface SkipStatusProps {
  // 승인을 막은 이유. 있으면 안내 대신 붉게 적는다.
  note?: string;
  onSkip: () => void;
}

export function SkipStatus({ note, onSkip }: SkipStatusProps) {
  return (
    <>
      <Button variant="outline" colorPalette="gray" size="sm" onClick={onSkip}>
        건너뛰기
      </Button>
      {note ? (
        <Text typography="body4" weight="medium" foreground="danger">
          {note}
        </Text>
      ) : (
        <Text typography="body4" foreground="hint">
          처리하면 바로 다음 건으로 넘어갑니다
        </Text>
      )}
    </>
  );
}
