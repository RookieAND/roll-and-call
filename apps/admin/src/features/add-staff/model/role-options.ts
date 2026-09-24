import type { StaffRole } from "@/shared/server";

export const ROLE_OPTIONS: { value: StaffRole; label: string; description: string }[] = [
  {
    value: "staff",
    label: "운영진",
    description: "인증 심사와 불참 기록 취소, 제재까지 할 수 있습니다",
  },
  { value: "owner", label: "소유자", description: "운영진 관리와 서비스 설정까지 할 수 있습니다" },
];
