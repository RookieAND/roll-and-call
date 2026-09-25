import type { RulebookKind } from "@roll-and-call/database";
import { Field, SegmentedControl } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";

interface KindSegmentFieldProps {
  kind: RulebookKind;
  description: string;
  disabled?: boolean;
  onChange: (kind: RulebookKind) => void;
}

export function KindSegmentField({ kind, description, disabled, onChange }: KindSegmentFieldProps) {
  return (
    <Field.Root label="종류" description={description}>
      <SegmentedControl.Root
        value={kind}
        onValueChange={(next) => onChange(next as RulebookKind)}
        aria-label="종류"
        disabled={disabled}
      >
        {Object.entries(RULEBOOK_KIND_LABEL).map(([value, label]) => (
          <SegmentedControl.Item key={value} value={value}>
            {label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </Field.Root>
  );
}
