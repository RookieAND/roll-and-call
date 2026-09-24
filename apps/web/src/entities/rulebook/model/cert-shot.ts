export const CERT_SHOT = { front: "front", back: "back", side: "side" } as const;

export type CertShot = (typeof CERT_SHOT)[keyof typeof CERT_SHOT];

export const CERT_SHOTS = [CERT_SHOT.front, CERT_SHOT.back, CERT_SHOT.side] as const;

export const CERT_SHOT_LABEL: Record<CertShot, string> = {
  front: "앞면",
  back: "뒷면",
  side: "옆면",
};

// 사진 칸 아래 안내. 앞면만 닉네임 쪽지를 함께 찍는다.
export const CERT_SHOT_GUIDE: Record<CertShot, { lines: string[]; nickname: boolean }> = {
  front: {
    lines: [
      "표지 전체와 디스코드 닉네임을 적은 쪽지를 함께 찍어 주세요.",
      "제목과 판본이 읽혀야 합니다.",
    ],
    nickname: true,
  },
  back: { lines: ["뒤표지 전체가 보이게 찍어 주세요."], nickname: false },
  side: { lines: ["책등(제목이 적힌 옆면)이 보이게 세워서 찍어 주세요."], nickname: false },
};
