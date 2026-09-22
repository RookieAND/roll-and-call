import { Button, Callout } from "@roll-and-call/ui";

interface PrefillNoticeProps {
  label: string;
  onClear: () => void;
}

export function PrefillNotice({ label, onClear }: PrefillNoticeProps) {
  return (
    <Callout
      tone="tinted"
      action={
        <Button variant="ghost" size="sm" className="h-9" onClick={onClear}>
          지우기
        </Button>
      }
    >
      프로필의 기본 가능 시간대({label})를 미리 칠해뒀습니다. 아래 &quot;저장&quot;을 눌러야 GM에게
      전달됩니다.
    </Callout>
  );
}
