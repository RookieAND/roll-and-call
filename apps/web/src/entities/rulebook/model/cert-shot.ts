export const CERT_SHOT = { front: "front", back: "back", side: "side" } as const;

export type CertShot = (typeof CERT_SHOT)[keyof typeof CERT_SHOT];

export const CERT_SHOTS = [CERT_SHOT.front, CERT_SHOT.back, CERT_SHOT.side] as const;

export const CERT_SHOT_LABEL: Record<CertShot, string> = {
  front: "앞면",
  back: "뒷면",
  side: "책등",
};

// 사진 칸 아래 안내. 앞면만 닉네임 쪽지를 함께 찍는다. 여러 권이면 한 장에 나란히 찍는다.
export function certShotGuide(shot: CertShot, bookCount: number) {
  const nickname = shot === CERT_SHOT.front;
  if (bookCount < 2) {
    const lines = {
      front: [
        "표지 전체와 디스코드 닉네임 쪽지를 함께 찍어 주세요.",
        "제목과 판본이 잘 보여야 합니다.",
      ],
      back: ["뒤표지 전체가 보이게 찍어 주세요."],
      side: ["룰북을 세워서 제목이 적힌 책등이 보이게 찍어 주세요."],
    }[shot];
    return { title: CERT_SHOT_LABEL[shot], lines, nickname };
  }
  const books = bookCount === 2 ? "두 권" : "여러 권";
  const lines = {
    front: [
      `${books}을 나란히 놓고 닉네임 쪽지와 함께 한 장에 찍어 주세요.`,
      `${books} 모두 제목과 판본이 보여야 합니다.`,
    ],
    back: [`${books}의 뒤표지를 나란히 놓고 한 장에 찍어 주세요.`],
    side: [`${books}을 세워서 책등이 나란히 보이게 한 장에 찍어 주세요.`],
  }[shot];
  return { title: `${books} 함께 · ${CERT_SHOT_LABEL[shot]}`, lines, nickname };
}
