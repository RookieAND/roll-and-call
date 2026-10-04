import { isNull } from "es-toolkit";

import { rejectionSummary, type MyRulebook } from "@/entities/rulebook";

import { isTodoStale } from "./is-todo-stale";
import type { MySessions, SessionCardModel } from "./session-card-model";
import { TODO_ITEM_TYPE, type SessionTodoItem, type TodoItem } from "./todo-item";
import { TODO_EYEBROW, TODO_KIND, TODO_ORDER } from "./todo-kind";

export type TodoList = { items: TodoItem[]; count: number; blocked: boolean };

type Ranked = { item: TodoItem; roleRank: number; sortAt: number };

// 같은 종류 안에서는 GM 일(roleRank 0)이 먼저이고, 그다음 가까운 세션·마감·기한 순이다.
export function listTodos({
  sessions,
  rejectedRulebooks,
  now,
}: {
  sessions: MySessions;
  rejectedRulebooks: MyRulebook[];
  now: Date;
}): TodoList {
  const fromCards = (cards: SessionCardModel[], roleRank: number): Ranked[] =>
    cards.flatMap(({ id, title, todo }) => {
      if (isNull(todo)) return [];
      const kind = todo.kind as SessionTodoItem["kind"];
      const item: SessionTodoItem = {
        type: TODO_ITEM_TYPE.session,
        key: `${kind}:${id}`,
        kind,
        eyebrow: todo.eyebrow ?? TODO_EYEBROW[kind as keyof typeof TODO_EYEBROW],
        gameId: id,
        title,
        lines: todo.lines,
        blocked: todo.blocked,
        action: { label: todo.label, href: todo.href },
      };
      return [{ item, roleRank, sortAt: new Date(todo.sortAt).getTime() }];
    });
  const certs: Ranked[] = rejectedRulebooks.flatMap((rulebook) => {
    if (isNull(rulebook.stateAt) || isTodoStale(rulebook.stateAt, now)) return [];
    return [
      {
        item: {
          type: TODO_ITEM_TYPE.cert,
          key: `${TODO_KIND.certRejected}:${rulebook.id}`,
          kind: TODO_KIND.certRejected,
          eyebrow: TODO_EYEBROW[TODO_KIND.certRejected],
          rulebookId: rulebook.id,
          title: "룰북 인증 다시 신청하기",
          lines: [`${rulebook.label} · ${rejectionSummary(rulebook.latestApplication)}`],
          blocked: false,
        },
        roleRank: 0,
        sortAt: new Date(rulebook.stateAt).getTime(),
      },
    ];
  });

  const items = [...fromCards(sessions.host, 0), ...fromCards(sessions.player, 1), ...certs]
    .toSorted(
      (left, right) =>
        TODO_ORDER.indexOf(left.item.kind) - TODO_ORDER.indexOf(right.item.kind) ||
        left.roleRank - right.roleRank ||
        left.sortAt - right.sortAt,
    )
    .map(({ item }) => item);
  return { items, count: items.length, blocked: items.some((item) => item.blocked) };
}
