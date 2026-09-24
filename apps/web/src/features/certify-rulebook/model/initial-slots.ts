import { CERT_SHOTS, CERT_STATE, type CertShot, type MyRulebook } from "@/entities/rulebook";

import { PHOTO_SLOT, type PhotoSlot } from "./photo-slot";

// 반려된 룰북을 다시 신청하면 문제가 없던 사진은 그대로 두고, 지적된 사진만 비운다.
export function initialSlots(rulebook: MyRulebook | undefined): Record<CertShot, PhotoSlot> {
  const previous = rulebook?.state === CERT_STATE.rejected ? rulebook.latestApplication : null;
  return Object.fromEntries(
    CERT_SHOTS.map((shot) => {
      const url = previous?.photoUrls[shot];
      const keep = url && !previous.flaggedShots.includes(shot);
      return [shot, keep ? { status: PHOTO_SLOT.done, url } : { status: PHOTO_SLOT.empty }];
    }),
  ) as Record<CertShot, PhotoSlot>;
}
