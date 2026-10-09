export const STAFF_NOTICE_KIND = {
  certApplied: "certApplied",
  rulebookRequested: "rulebookRequested",
  sanctioned: "sanctioned",
  certRevoked: "certRevoked",
  certGranted: "certGranted",
} as const;

// 닉네임은 그 서버 닉네임(server_members.nickname)이다. 사유는 넣지 않는다(D302).
export type StaffNotice =
  | {
      kind: typeof STAFF_NOTICE_KIND.certApplied;
      applicantNickname: string;
      applicantDiscordId: string;
      applicantAvatarUrl: string | null;
      rulebookLabel: string;
      applicationId: string;
      formatLabel: string;
    }
  | {
      kind: typeof STAFF_NOTICE_KIND.rulebookRequested;
      requesterNickname: string;
      requesterDiscordId: string;
      requesterAvatarUrl: string | null;
      name: string;
      edition: string | null;
      kindLabel: string | null;
      category: string;
      link: string;
    }
  | {
      kind: typeof STAFF_NOTICE_KIND.sanctioned;
      staffNickname: string;
      targetUserId: string;
      targetNickname: string;
      until: Date | null;
    }
  | {
      kind: typeof STAFF_NOTICE_KIND.certRevoked;
      staffNickname: string;
      targetUserId: string;
      targetNickname: string;
      rulebookLabel: string;
      cancelledGameCount: number;
    }
  | {
      kind: typeof STAFF_NOTICE_KIND.certGranted;
      staffNickname: string;
      rulebookId: string;
      rulebookLabel: string;
      nicknames: string[];
    };
