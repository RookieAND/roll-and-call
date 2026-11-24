import { ddayKst } from "@/shared/lib";

// D-Day·D-1은 눈에 띄는 danger 배지로 그린다.
export function isImminentDay({ target, now }: { target: Date; now: Date }): boolean {
  return ddayKst(target, now) <= 1;
}
