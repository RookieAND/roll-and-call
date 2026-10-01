export function seatsStatus({
  openSeats,
  pickedCount,
}: {
  openSeats: number;
  pickedCount: number;
}) {
  if (openSeats === 0) return { label: "자리 없음", foreground: "warning" } as const;
  if (pickedCount >= openSeats) {
    return { label: `${openSeats}자리 모두 채움`, foreground: "primary" } as const;
  }
  return { label: `${openSeats - pickedCount}자리 남음`, foreground: "muted" } as const;
}
