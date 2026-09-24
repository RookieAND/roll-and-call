import type { ShotKey } from "@/shared/server";

export const SHOTS: { key: ShotKey; label: string; note: string; question: string }[] = [
  {
    key: "front",
    label: "앞면",
    note: "표지와 닉네임 쪽지",
    question: "룰북·판본이 일치하고 쪽지 닉네임이 신청자와 같은가",
  },
  { key: "back", label: "뒷면", note: "뒤표지", question: "같은 책의 뒤표지인가" },
  { key: "side", label: "옆면", note: "책등", question: "실물 책의 책등이 보이는가" },
];
