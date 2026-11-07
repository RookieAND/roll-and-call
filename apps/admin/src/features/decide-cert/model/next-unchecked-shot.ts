import type { ReviewShotKey } from "./shots";

interface NextUncheckedShotInput {
  order: readonly ReviewShotKey[];
  checked: readonly ReviewShotKey[];
  from: ReviewShotKey;
}

// 현재 사진 뒤쪽에서 처음 만나는 미확인 사진, 없으면 앞쪽까지 돌아본다. 모두 확인했으면 undefined다.
export function nextUncheckedShot({
  order,
  checked,
  from,
}: NextUncheckedShotInput): ReviewShotKey | undefined {
  const start = order.indexOf(from);
  const rotated = [...order.slice(start + 1), ...order.slice(0, start + 1)];
  return rotated.find((key) => !checked.includes(key));
}
