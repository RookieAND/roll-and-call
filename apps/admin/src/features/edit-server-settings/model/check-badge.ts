import type { SettingCheck } from "./setting-check";

// ponytail: id-row.tsx 안의 같은 함수와 짝이다. 데스크톱 파일을 건드리지 않기로 해서 모바일 카드만 이것을 쓴다.
export function checkBadge(check: SettingCheck | "checking" | undefined) {
  if (check === "checking") return { label: "확인 중", tone: "gray" } as const;
  if (check?.status === "ok") return { label: "확인됨", tone: "success" } as const;
  if (check?.status === "fail") return { label: "확인 실패", tone: "danger" } as const;
  return undefined;
}
