export function capacityPalette({ count, capacity }: { count: number; capacity: number }) {
  if (count === 0) return "gray";
  if (count >= capacity) return "success";
  return "primary";
}
