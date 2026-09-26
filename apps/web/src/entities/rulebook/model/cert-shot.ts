export const CERT_SHOT = { front: "front", back: "back", side: "side" } as const;

export type CertShot = (typeof CERT_SHOT)[keyof typeof CERT_SHOT];

export const CERT_SHOTS = [CERT_SHOT.front, CERT_SHOT.back, CERT_SHOT.side] as const;

export const CERT_SHOT_LABEL: Record<CertShot, string> = {
  front: "앞면",
  back: "뒷면",
  side: "책등",
};
