import { toKst } from "@/shared/lib";

export type SessionStart = { date: string; hour: number; minute: number };

export function toSessionStart(iso: string): SessionStart {
  const kst = toKst(iso);
  return { date: kst.format("YYYY-MM-DD"), hour: kst.hour(), minute: kst.minute() < 30 ? 0 : 30 };
}
