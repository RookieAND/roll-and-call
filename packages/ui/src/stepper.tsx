import { cva } from "class-variance-authority";

import { cn } from "./cn";

const frame = cva("inline-flex h-11 items-stretch overflow-hidden rounded-400 border bg-surface", {
  variants: {
    invalid: { true: "border-[1.5px] border-danger-400 bg-danger-50", false: "border-gray-200" },
  },
  defaultVariants: { invalid: false },
});

const STEP_BUTTON =
  "flex size-11 items-center justify-center text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:text-gray-300";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

// 범위를 벗어난 직접 입력은 막지 않고 필드 검증이 알리게 둔다. ± 버튼만 min·max에서 멈춘다.
export function Stepper({
  value,
  onChange,
  min,
  max,
  id,
  invalid,
  disabled,
  className,
  ...ariaProps
}: StepperProps) {
  const safeValue = Number.isFinite(value) ? value : min;

  return (
    <div className={cn(frame({ invalid }), className)}>
      <button
        type="button"
        aria-label="줄이기"
        disabled={disabled || safeValue <= min}
        onClick={() => onChange(Math.max(min, safeValue - 1))}
        className={STEP_BUTTON}
      >
        <span aria-hidden className="text-lg leading-none">
          −
        </span>
      </button>
      <input
        id={id}
        inputMode="numeric"
        disabled={disabled}
        value={Number.isFinite(value) ? String(value) : ""}
        onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")))}
        className="w-12 border-x border-gray-200 grow bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
        {...ariaProps}
      />
      <button
        type="button"
        aria-label="늘리기"
        disabled={disabled || safeValue >= max}
        onClick={() => onChange(Math.min(max, safeValue + 1))}
        className={STEP_BUTTON}
      >
        <span aria-hidden className="text-lg leading-none">
          +
        </span>
      </button>
    </div>
  );
}
