import { Radio, Text, cn } from "@roll-and-call/ui";

interface OptionRowProps {
  value: string;
  label: string;
  note?: string;
  selected: boolean;
  disabled?: boolean;
}

export function OptionRow({ value, label, note, selected, disabled }: OptionRowProps) {
  return (
    <Radio.Field
      className={cn(
        "min-h-0 w-full gap-100 px-150 py-100",
        selected && "bg-tinted-bg",
        disabled && "cursor-default opacity-50",
      )}
    >
      <Radio.Root value={value} disabled={disabled}>
        <Radio.Indicator />
      </Radio.Root>
      <Text typography="body3" weight={selected ? "bold" : "regular"} truncate className="flex-1">
        {label}
      </Text>
      {note ? (
        <Text typography="body4" foreground={disabled ? "muted" : "hint"} className="shrink-0">
          {note}
        </Text>
      ) : null}
    </Radio.Field>
  );
}
