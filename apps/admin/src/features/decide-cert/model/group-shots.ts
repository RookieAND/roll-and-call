import { GROUP_SHOT_KEYS, type ReviewShot } from "./shots";

// 묶음 신청의 심사 사진 목록. 올라온 사진만 올린 순서대로 「사진 N」으로 부른다.
export function groupShots(photoUrls: Partial<Record<string, string>>): ReviewShot[] {
  return GROUP_SHOT_KEYS.filter((key) => photoUrls[key]).map((key, index) => ({
    key,
    label: `사진 ${index + 1}`,
    note: "신청한 책이 보이는 사진",
    question: "신청한 책이 모두 보이고, 쪽지 닉네임이 맞는가",
  }));
}
