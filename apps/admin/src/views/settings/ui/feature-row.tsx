import { HStack, Switch, Text, VStack } from "@roll-and-call/ui";

interface FeatureRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  note?: string;
  disabled?: boolean;
  showState?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function FeatureRow({
  id,
  label,
  description,
  checked,
  note,
  disabled = false,
  showState = true,
  onCheckedChange,
}: FeatureRowProps) {
  const stateLabel = checked ? "켜짐" : "꺼짐";
  return (
    <VStack gap="100">
      <HStack align="center" gap="200">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1" render={<label htmlFor={id} />}>
            {label}
          </Text>
          <Text typography="body4" foreground="muted" render={<p />}>
            {description}
          </Text>
        </VStack>
        <HStack align="center" gap="125" className="flex-none">
          {showState && (
            <Text typography="body4" foreground="muted">
              {stateLabel}
            </Text>
          )}
          <Switch.Root
            id={id}
            checked={checked}
            disabled={disabled}
            onCheckedChange={onCheckedChange}
          >
            <Switch.Control />
          </Switch.Root>
        </HStack>
      </HStack>
      {note && (
        <Text typography="body4" foreground="muted" render={<p />}>
          {note}
        </Text>
      )}
    </VStack>
  );
}
