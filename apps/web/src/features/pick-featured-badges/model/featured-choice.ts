import type { BadgeGrade } from "@roll-and-call/database/rules";

// 고르기 화면의 한 칸. 서버가 달고 있는 뱃지로 만들어 넘긴다.
export type FeaturedChoice = {
  key: string;
  emoji: string;
  name: string;
  grade: BadgeGrade;
  tag: string | null;
};
