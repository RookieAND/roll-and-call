export const CERT_SHOT = { front: "front", back: "back" } as const;

export type CertShot = (typeof CERT_SHOT)[keyof typeof CERT_SHOT];

export const CERT_SHOTS = [CERT_SHOT.front, CERT_SHOT.back] as const;

export const CERT_SHOT_LABEL: Record<CertShot, string> = {
  front: "앞면",
  back: "뒷면",
};

// 여러 권을 함께 신청한 묶음 사진이 신청의 사진 칸에 담기는 순서(앞면·뒷면 칸 뒤에 추가 증빙 3칸).
export const CERT_BULK_PHOTO_KEYS = ["front", "back", "extra1", "extra2", "extra3"] as const;
