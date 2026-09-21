import { Lock } from "lucide-react";

import { DangerNotice } from "./danger-notice";

interface LockedModeNoticeProps {
  label: string;
}

export function LockedModeNotice({ label }: LockedModeNoticeProps) {
  return (
    <DangerNotice
      icon={<Lock size={14} strokeWidth={2.2} />}
      title={`신청자가 있어 ${label}은 바꿀 수 없습니다.`}
    >
      변경하려면 참여자 관리에서 명단을 비워주세요.
    </DangerNotice>
  );
}
