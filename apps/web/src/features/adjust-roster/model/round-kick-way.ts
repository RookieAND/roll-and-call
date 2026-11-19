export const ROUND_KICK_WAY = { absent: "removed", mutual: "mutual" } as const;

export type RoundKickWay = (typeof ROUND_KICK_WAY)[keyof typeof ROUND_KICK_WAY];

// 다회차 1회차 시작 뒤 내보내기의 두 방식과 설명 두 줄.
export const ROUND_KICK_OPTIONS = [
  {
    value: ROUND_KICK_WAY.absent,
    label: "불참으로 내보내기",
    lines: [
      "연락 없이 계속 나오지 않는 경우입니다.",
      "불참 기록이 1건 남고, 완주로 인정되지 않습니다.",
    ],
  },
  {
    value: ROUND_KICK_WAY.mutual,
    label: "합의 하차",
    lines: [
      "서로 합의하고 그만두는 경우입니다.",
      "불참 기록이 남지 않고, 완주로 인정되지 않습니다.",
    ],
  },
] as const;
