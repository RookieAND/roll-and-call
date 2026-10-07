export function heatRing({
  slotIso,
  picked,
  confirmedIso,
  count,
}: {
  slotIso: string;
  picked: string | null;
  confirmedIso: string | null;
  count: number;
}) {
  if (picked === slotIso) return "picked";
  if (confirmedIso === slotIso) return "confirmed";
  if (count === 0) return "empty";
  return "none";
}
