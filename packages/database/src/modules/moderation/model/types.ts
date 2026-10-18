export type StaffRole = "owner" | "staff";

export interface Sanction {
  until: Date | null;
  by: string;
  at: Date;
  reason: string;
}

export type ShotKey = "front" | "back";

// 여러 권을 함께 신청한 묶음 사진의 추가 증빙 칸. 반려로 지정하는 사진은 아니라서 ShotKey에는 넣지 않는다.
export type ExtraShotKey = "extra1" | "extra2" | "extra3";
export type PhotoKey = ShotKey | ExtraShotKey;
