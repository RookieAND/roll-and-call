import { SESSION_ACTION_KIND } from "./session-card-model";

export const TODO_KIND = {
  confirmTime: SESSION_ACTION_KIND.confirmTime,
  confirmAttendance: SESSION_ACTION_KIND.confirmAttendance,
  fillVacancy: SESSION_ACTION_KIND.fillVacancy,
  submitAvailability: SESSION_ACTION_KIND.submitAvailability,
  certRejected: "cert-rejected",
} as const;

export type TodoKind = (typeof TODO_KIND)[keyof typeof TODO_KIND];

// 위에서부터 먼저 보인다(U15-01).
export const TODO_ORDER: readonly TodoKind[] = [
  TODO_KIND.confirmTime,
  TODO_KIND.confirmAttendance,
  TODO_KIND.fillVacancy,
  TODO_KIND.submitAvailability,
  TODO_KIND.certRejected,
];

// 출석 확인은 남은 날짜가 붙어 할 일마다 만든다(SessionTodo.eyebrow).
export const TODO_EYEBROW = {
  [TODO_KIND.confirmTime]: "세션 일시 미정",
  [TODO_KIND.fillVacancy]: "빈자리 생김",
  [TODO_KIND.submitAvailability]: "가능 시간 미제출",
  [TODO_KIND.certRejected]: "인증 반려",
} as const;
