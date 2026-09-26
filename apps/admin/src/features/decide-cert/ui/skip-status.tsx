import { Button, Text } from "@roll-and-call/ui";

interface SkipStatusProps {
  // 승인할 수 없는 이유. 있으면 안내 대신 붉게 적는다.
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
          결과는 신청자의 내 룰북에만 표시되며, 따로 알림은 가지 않습니다.
        </Text>
      )}
    </>
  );
}
