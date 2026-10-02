import type { JoinScreenStatus } from "./join-screen-status";

// 서버 아이콘 오른쪽 아래에 붙는 상태 표시. 자물쇠와 느낌표 모양이다.
export const EMBLEM_MARKS: Partial<Record<JoinScreenStatus, { path: string; className: string }>> =
  {
    denied: { path: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z", className: "bg-danger-solid" },
    failed: { path: "M12 7v6M12 17h.01", className: "bg-warning-600" },
  };
