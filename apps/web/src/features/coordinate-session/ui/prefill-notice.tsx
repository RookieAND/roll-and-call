import { Button, Text } from "@trpg/ui";

export function PrefillNotice({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-500 bg-tinted-bg px-3.5 py-3">
      <Text typography="body4" render={<p />} className="flex-1 text-tinted-ink">
        프로필의 기본 가능 시간대({label})를 미리 칠해뒀습니다. 아래 &quot;저장&quot;을 눌러야
        GM에게 전달됩니다.
      </Text>
      <Button variant="ghost" size="sm" className="h-9 shrink-0" onClick={onClear}>
        지우기
      </Button>
    </div>
  );
}
