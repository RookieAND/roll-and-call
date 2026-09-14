import { cn } from "./cn";

export type StepperProps = {
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
};

// 작은 정수 입력: − 값 + (각 44×44). 직접 입력도 받되 범위를 벗어난 값은 막지 않고
// 검증(필드 오류)이 알리게 둔다. ± 버튼만 min·max에서 멈춘다.
export function Stepper({
  value,
  onChange,
  min,
  max,
  id,
  invalid,
  disabled,
  className,
  ...aria
}: StepperProps) {
  const safe = Number.isFinite(value) ? value : min;
  const buttonClass =
    "flex size-11 items-center justify-center text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:text-gray-300";

  return (
    <div
      className={cn(
        "inline-flex h-11 items-stretch overflow-hidden rounded-[10px] border bg-surface",
        invalid ? "border-[1.5px] border-danger-400 bg-danger-50" : "border-gray-200",
        className,
      )}
    >
      <button
        type="button"
        aria-label="줄이기"
        disabled={disabled || safe <= min}
        onClick={() => onChange(Math.max(min, safe - 1))}
        className={buttonClass}
      >
        <span aria-hidden className="text-lg leading-none">−</span>
      </button>
      <input
        id={id}
        inputMode="numeric"
        disabled={disabled}
        value={Number.isFinite(value) ? String(value) : ""}
        onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")))}
        className="w-12 border-x border-gray-200 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
        {...aria}
      />
      <button
        type="button"
        aria-label="늘리기"
        disabled={disabled || safe >= max}
        onClick={() => onChange(Math.min(max, safe + 1))}
        className={buttonClass}
      >
        <span aria-hidden className="text-lg leading-none">+</span>
      </button>
    </div>
  );
}
