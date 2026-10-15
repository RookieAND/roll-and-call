import type { SettingCheck } from "./setting-check";

export function checkBadge(check: SettingCheck | "checking" | undefined) {
  if (check === "checking") return { label: "확인 중", tone: "gray" } as const;
  if (check?.status === "ok") return { label: "확인됨", tone: "success" } as const;
  if (check?.status === "fail") return { label: "확인 실패", tone: "danger" } as const;
  return undefined;
}
