import { cn } from "./cn";

export type SegmentOption<Value extends string> = { value: Value; label: string };

export type SegmentControlProps<Value extends string> = {
  options: readonly SegmentOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  "aria-label": string;
  className?: string;
};

// 한 가지를 고르는 세그먼트(라디오 그룹). 옵션이 적고 즉시 적용되는 설정에 쓴다.
export function SegmentControl<Value extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SegmentControlProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex gap-[3px] rounded-[10px] bg-gray-100 p-[3px]", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 rounded-lg px-[11px] text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
              selected
                ? "bg-surface font-bold text-gray-900 shadow-sm"
                : "font-semibold text-gray-600 hover:text-gray-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
