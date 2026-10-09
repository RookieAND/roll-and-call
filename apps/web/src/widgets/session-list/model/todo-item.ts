import type { SessionTodoKind } from "./session-card-model";
import type { TODO_KIND } from "./todo-kind";

export const TODO_ITEM_TYPE = { session: "session", cert: "cert" } as const;

export type SessionTodoItem = {
  type: typeof TODO_ITEM_TYPE.session;
  key: string;
  kind: SessionTodoKind;
  eyebrow: string;
  gameId: string;
  title: string;
  lines: string[];
  blocked: boolean;
  action: { label: string; href: string };
};

export type CertTodoItem = {
  type: typeof TODO_ITEM_TYPE.cert;
  key: string;
  kind: typeof TODO_KIND.certRejected;
  eyebrow: string;
  rulebookId: string;
  title: string;
  lines: string[];
  blocked: false;
};

export type TodoItem = SessionTodoItem | CertTodoItem;
