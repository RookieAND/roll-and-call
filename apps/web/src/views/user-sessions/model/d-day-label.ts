import { ddayKst } from "@/shared/lib";

export function dDayLabel({ target, now }: { target: Date; now: Date }): string {
  const days = ddayKst(target, now);
  return days === 0 ? "D-Day" : `D-${days}`;
}
