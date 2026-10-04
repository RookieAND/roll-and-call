import {
  GRANT_SKIP_REASON,
  type GrantSkipReason,
} from "@roll-and-call/database/certifications/model";
import { compact } from "es-toolkit";

interface GrantOutcome {
  rulebookLabel: string;
  granted: { nickname: string }[];
  skipped: { nickname: string; reason: GrantSkipReason }[];
}

const namesOf = (rows: { nickname: string }[]) => rows.map((row) => row.nickname).join(", ");

// 그사이 이미 인증된 사람·기본 룰북이 빠진 사람은 빼고 부여한 뒤 그 사람을 덧붙인다.
export function grantResultToast({ rulebookLabel, granted, skipped }: GrantOutcome) {
  const already = skipped.filter((row) => row.reason === GRANT_SKIP_REASON.alreadyCertified);
  const blocked = skipped.filter((row) => row.reason === GRANT_SKIP_REASON.supplementBlocked);
  const notes = compact([
    already.length > 0 ? `${namesOf(already)}님은 이미 인증되어 빼고 부여했습니다` : null,
    blocked.length > 0 ? `${namesOf(blocked)}님은 기본 룰북 인증이 먼저 필요합니다` : null,
  ]);
  if (granted.length === 0) {
    return {
      success: false,
      title:
        blocked.length > 0
          ? "기본 룰북 인증이 먼저 필요합니다"
          : `${namesOf(already)}님은 이미 인증되었습니다`,
      description: undefined,
    };
  }
  return {
    success: true,
    title: `${granted.length}명에게 ${rulebookLabel} 인증을 부여했습니다`,
    description: notes.length > 0 ? notes.join("\n") : undefined,
  };
}
