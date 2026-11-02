import { Checkbox, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";

interface FilterCheckboxProps {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function FilterCheckbox({ label, hint, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <VStack gap="025">
      <Checkbox.Field>
        <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator>
            <Check size={14} strokeWidth={3} aria-hidden />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Field>
      <Text
        typography="body4"
        foreground="hint"
        className="pl-[calc(var(--spacing-250)+var(--spacing-125))] break-keep"
      >
        {hint}
      </Text>
    </VStack>
  );
}
