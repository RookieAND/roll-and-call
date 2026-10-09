import { Switch, Text, VStack } from "@roll-and-call/ui";

interface MiniRuleFieldProps {
  miniRule: boolean;
  disabled?: boolean;
  onChange: (miniRule: boolean) => void;
}

export function MiniRuleField({ miniRule, disabled, onChange }: MiniRuleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-200">
      <VStack gap="025" className="min-w-0">
        <Text typography="body4" foreground="hint">
          GM 없이 모두가 PL이 되어 플레이할 수 있는 룰을 의미합니다.
        </Text>
      </VStack>
      <Switch.Root checked={miniRule} disabled={disabled} onCheckedChange={onChange}>
        <Switch.Control />
        <Text typography="body3" foreground="muted">
          {miniRule ? "켜짐" : "꺼짐"}
        </Text>
      </Switch.Root>
    </div>
  );
}
