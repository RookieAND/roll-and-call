import type { AdminShapes } from "./types";

// 화면이 loadAdminData([...])로 고른 모양을 model 함수의 입력 타입으로 쓸 때의 이름이다.
export type Snapshot = Pick<
  AdminShapes,
  | "users"
  | "staff"
  | "rulebooks"
  | "certifications"
  | "certApplications"
  | "quizQuestions"
  | "sellers"
  | "rulebookRequests"
  | "sessions"
  | "noShows"
  | "reviews"
  | "auditLog"
  | "staffMemos"
>;
