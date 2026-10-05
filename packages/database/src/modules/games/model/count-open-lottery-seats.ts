export function countOpenLotterySeats({
  maxPlayers,
  confirmedCount,
}: {
  maxPlayers: number;
  confirmedCount: number;
}) {
  return Math.max(maxPlayers - confirmedCount, 0);
}
