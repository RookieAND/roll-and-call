import { Switch, Text, VStack } from "@roll-and-call/ui";

interface CoreModeFieldProps {
  any: boolean;
  disabled?: boolean;
  onChange: (coreMode: "all" | "any") => void;
}

export function CoreModeField({ any, disabled, onChange }: CoreModeFieldProps) {
  return (
    <div className="flex items-center justify-between gap-200">
      <VStack gap="025" className="min-w-0">
        <Text typography="body4" foreground="hint">
          같은 판본의 기본 룰북 가운데 한 권만 인증해도 구인을 열 수 있습니다.
          기본 룰북이 서로를 대신하는 룰(인세인 기본과 대형판)에 켭니다.
        </Text>
      </VStack>
      <Switch.Root
        checked={any}
        disabled={disabled}
        onCheckedChange={(checked) => onChange(checked ? "any" : "all")}
      >
        <Switch.Control />
        <Text typography="body3" foreground="muted">
          {any ? "한 권만" : "모두"}
        </Text>
      </Switch.Root>
    </div>
  );
}
