import { Checkbox, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";

import {
  SUPPLEMENT_OPTION_STATE,
  type SupplementOption,
  type SupplementOptionState,
} from "@/entities/rulebook";

const LOCKED_NOTE: Record<Exclude<SupplementOptionState, "open">, string> = {
  [SUPPLEMENT_OPTION_STATE.pending]: "인증 심사가 끝나면 고를 수 있습니다.",
  [SUPPLEMENT_OPTION_STATE.locked]: "이 책을 인증하면 고를 수 있습니다.",
};

interface SupplementOptionRowProps {
  option: SupplementOption;
  checked: boolean;
  full: boolean;
  onToggle: (checked: boolean) => void;
}

export function SupplementOptionRow({ option, checked, full, onToggle }: SupplementOptionRowProps) {
  const open = option.state === SUPPLEMENT_OPTION_STATE.open;
  const disabled = !open || (full && !checked);
  const note = option.state === SUPPLEMENT_OPTION_STATE.open ? null : LOCKED_NOTE[option.state];
  const nameForeground = open ? "normal" : "hint";

  return (
    <Checkbox.Field className="flex min-h-14 w-full items-center gap-150 py-100">
      <Checkbox.Root checked={checked} disabled={disabled} onCheckedChange={onToggle}>
        <Checkbox.Indicator>
          <Check size={14} strokeWidth={3} aria-hidden />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body2" foreground={nameForeground} className="break-all">
          {option.name}
        </Text>
        {note && (
          <Text typography="body4" foreground="hint">
            {note}
          </Text>
        )}
      </VStack>
    </Checkbox.Field>
  );
}
