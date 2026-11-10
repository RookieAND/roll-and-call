import { Checkbox } from "@roll-and-call/ui";
import { Check } from "lucide-react";

interface FilterCheckboxProps {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function FilterCheckbox({ label, hint, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <Checkbox.Field>
      <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>
          <Check size={14} strokeWidth={3} aria-hidden />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Checkbox.Content>
        <Checkbox.Label>{label}</Checkbox.Label>
        <Checkbox.Description>{hint}</Checkbox.Description>
      </Checkbox.Content>
    </Checkbox.Field>
  );
}
