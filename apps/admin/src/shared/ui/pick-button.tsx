import { Button } from "@roll-and-call/ui";
import { Check, ShieldCheck, UserPlus } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

export const PICK_STATE = {
  open: "open",
  picked: "picked",
  done: "done",
} as const;
export type PickState = (typeof PICK_STATE)[keyof typeof PICK_STATE];

const PICK_LOOK = {
  [PICK_STATE.open]: { variant: "outline", icon: UserPlus, label: "선택" },
  [PICK_STATE.picked]: { variant: "solid", icon: Check, label: "선택됨" },
  [PICK_STATE.done]: { variant: "outline", icon: ShieldCheck, label: "이미 인증됨" },
} as const;

interface PickButtonProps extends Omit<ComponentPropsWithRef<"button">, "children"> {
  state: PickState;
  doneLabel?: string;
}

// 검색 결과에서 한 명을 고르는 버튼. 세 상태 모두 같은 크기·폭에 아이콘과 글씨를 함께 둔다.
export function PickButton({ state, doneLabel, ...props }: PickButtonProps) {
  const look = PICK_LOOK[state];
  const Icon = look.icon;
  const label = state === PICK_STATE.done && doneLabel ? doneLabel : look.label;
  return (
    <Button
      type="button"
      size="sm"
      variant={look.variant}
      disabled={state === PICK_STATE.done}
      aria-pressed={state === PICK_STATE.done ? undefined : state === PICK_STATE.picked}
      className="min-w-[112px] justify-center"
      {...props}
    >
      <Icon size={14} aria-hidden />
      {label}
    </Button>
  );
}
