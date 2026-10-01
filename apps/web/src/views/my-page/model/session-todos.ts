import { SESSION_ACTION_KIND, type MySessions, type SessionTodo } from "@/widgets/session-list";

export type TodoItem = { id: string; title: string; todo: SessionTodo };

const TODO_ORDER: string[] = [
  SESSION_ACTION_KIND.drawLottery,
  SESSION_ACTION_KIND.confirmTime,
  SESSION_ACTION_KIND.confirmAttendance,
  SESSION_ACTION_KIND.reviewApplicants,
  SESSION_ACTION_KIND.fillVacancy,
  SESSION_ACTION_KIND.submitAvailability,
];

export function sessionTodos({ host, player }: MySessions): TodoItem[] {
  return [...host, ...player]
    .flatMap(({ id, title, todo }) => (todo ? [{ id, title, todo }] : []))
    .toSorted(
      (left, right) => TODO_ORDER.indexOf(left.todo.kind) - TODO_ORDER.indexOf(right.todo.kind),
    );
}
