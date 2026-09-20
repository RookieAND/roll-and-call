import { toKst } from "@/shared/lib";

const MINUTE_MS = 60_000;

// "9/17 (목) 20:30 – 23:30"
export function sessionWindowLabel(iso: string, playMinutes: number) {
  const start = toKst(iso);
  const end = toKst(new Date(start.valueOf() + playMinutes * MINUTE_MS));
  return `${start.format("M/D (dd) HH:mm")} – ${end.format("HH:mm")}`;
}
