import { HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

const row = cva(
  "flex min-h-12 w-full items-center gap-150 rounded-400 px-125 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  {
    variants: {
      selected: { true: "bg-primary-50", false: "" },
      disabled: { true: "cursor-not-allowed", false: "cursor-pointer hover:bg-gray-50" },
    },
  },
);

const ring = cva("flex size-5 flex-none items-center justify-center rounded-full border-2", {
  variants: {
    selected: { true: "border-primary-500", false: "border-gray-300" },
    disabled: { true: "border-gray-200 bg-gray-100", false: "" },
  },
});

interface RulebookOptionProps {
  name: string;
  edition: string;
  selected?: boolean;
  disabled?: boolean;
  // 고를 수 없는 이유 대신 자물쇠로 시작하는 줄(인증이 필요한 룰북).
  locked?: boolean;
  // 잠긴 줄을 눌러 안내를 펼쳤는지.
  expanded?: boolean;
  reason?: ReactNode;
  onClick?: () => void;
}

// 룰북 시트의 한 줄 = 한 판본. 이름 옆에 판본을 흐리게 붙인다.
export function RulebookOption({
  name,
  edition,
  selected = false,
  disabled = false,
  locked = false,
  expanded = false,
  reason,
  onClick,
}: RulebookOptionProps) {
  const nameForeground = disabled || locked ? "hint" : "normal";
  const nameWeight = selected ? "bold" : "medium";
  return (
    // ponytail: 라디오처럼 읽히되 잠긴 줄도 눌러 안내를 펼쳐야 해서 네이티브 radio 대신 button + aria-checked.
    <button
      type="button"
      role={locked ? "button" : "radio"}
      aria-checked={locked ? undefined : selected}
      aria-expanded={locked ? expanded : undefined}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={row({ selected, disabled })}
    >
      {locked ? (
        <Lock size={18} strokeWidth={2.2} aria-hidden className="flex-none text-hint" />
      ) : (
        <span className={ring({ selected, disabled })}>
          {selected && <span className="size-2.5 rounded-full bg-primary-500" />}
        </span>
      )}
      <HStack align="baseline" gap="075" className="min-w-0 flex-1">
        <Text typography="body2" weight={nameWeight} foreground={nameForeground}>
          {name}
        </Text>
        {edition && (
          <Text typography="body3" foreground="hint">
            {edition}
          </Text>
        )}
      </HStack>
      {reason}
    </button>
  );
}
