import { Text, TextInput, VStack } from "@roll-and-call/ui";
import type { Ref } from "react";

const COUNT_FROM = 240;

interface MessageFieldProps {
  ref?: Ref<HTMLInputElement>;
  label: string;
  value: string;
  max: number;
  error?: string;
  warning?: string;
  placeholder?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
}

// 글자 수는 240자를 넘기면 그때부터 오른쪽에 보인다.
export function MessageField({
  ref,
  label,
  value,
  max,
  error,
  warning,
  placeholder,
  disabled,
  onChange,
  onFocus,
}: MessageFieldProps) {
  const length = [...value].length;
  return (
    <VStack gap="075">
      <div className="flex items-baseline gap-100">
        <Text typography="body4" weight="bold" foreground="muted">
          {label}
        </Text>
        {length > COUNT_FROM ? (
          <Text
            typography="body4"
            numeric
            foreground={length > max ? "danger" : "hint"}
            weight={length > max ? "bold" : undefined}
            className="ml-auto"
          >
            {length} / {max}
          </Text>
        ) : null}
      </div>
      <TextInput
        ref={ref}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        invalid={Boolean(error)}
        disabled={disabled}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <Text typography="body4" foreground="danger">
          {error}
        </Text>
      ) : null}
      {!error && warning ? (
        <Text typography="body4" className="text-notice-ink">
          {warning}
        </Text>
      ) : null}
    </VStack>
  );
}
