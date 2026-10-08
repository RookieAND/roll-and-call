import { EMPTY_BIO_TEXT } from "@/entities/profile";

import type { Attendee } from "./attendee";

// 줄 하나에 한 가지만 말한다: 불참으로 기록됨 > 내보냄 > 소개.
export function attendanceRowLine({
  attendee,
  absent,
  editable,
}: {
  attendee: Attendee;
  absent: boolean;
  editable: boolean;
}) {
  if (editable && absent && !attendee.staffCancelled) {
    return { text: "불참으로 기록됩니다", foreground: "danger" } as const;
  }
  if (editable && attendee.removed) {
    return { text: "세션 중 불참으로 내보냈습니다.", foreground: "hint" } as const;
  }
  return { text: attendee.bio || EMPTY_BIO_TEXT, foreground: "hint" } as const;
}
