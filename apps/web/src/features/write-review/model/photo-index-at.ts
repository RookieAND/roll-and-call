export function photoIndexAt({ grid, x, y }: { grid: HTMLElement; x: number; y: number }) {
  const tile = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-photo-index]");
  if (!tile || !grid.contains(tile)) return null;
  return Number(tile.dataset.photoIndex);
}
