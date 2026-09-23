import { Button, Callout } from "@roll-and-call/ui";

interface PrefillNoticeProps {
  label: string;
  onClear: () => void;
}

export function PrefillNotice({ label, onClear }: PrefillNoticeProps) {
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Icon />
      <Callout.Description>
        프로필의 기본 가능 시간대({label})를 미리 칠해뒀습니다.
        <br />
        아래 &quot;저장&quot;을 눌러야 GM에게 전달됩니다.
      </Callout.Description>
      <Callout.Action>
        <Button variant="ghost" colorPalette="primary" className="h-11" onClick={onClear}>
          지우기
        </Button>
      </Callout.Action>
    </Callout.Root>
  );
}
