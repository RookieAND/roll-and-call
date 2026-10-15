const MAX_COUNT = 99;

// ponytail: 시안에 9+ 상태가 없어 99까지 그대로 보이고 그 위는 99+로 줄인다.
export function navBadgeCountLabel(count: number) {
  return count > MAX_COUNT ? `${MAX_COUNT}+` : String(count);
}
