import { toKst } from "@/shared/lib";

const MINUTE_MS = 60_000;

export function sessionWindowLabel({ iso, playMinutes }: { iso: string; playMinutes: number }) {
  const start = toKst(iso);
  const end = toKst(new Date(start.valueOf() + playMinutes * MINUTE_MS));
  return `${start.format("M/D (dd) HH:mm")} – ${end.format("HH:mm")}`;
}
