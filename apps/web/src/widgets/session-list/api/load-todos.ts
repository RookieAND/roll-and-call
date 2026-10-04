import "server-only";
import { cache } from "react";

import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { getRulebookRecords } from "@/shared/server";

import { listTodos } from "../model/list-todos";
import { loadMySessions } from "./load-sessions";

// react cache는 인자를 Object.is로 비교해서 객체 대신 값 둘을 받는다.
export const loadTodos = cache(async (serverId: string, userId: string) => {
  const [sessions, records] = await Promise.all([
    loadMySessions({ serverId, userId }),
    getRulebookRecords({ serverId, userId }),
  ]);
  const rejectedRulebooks = toMyRulebooks(records).rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.rejected,
  );
  return listTodos({ sessions, rejectedRulebooks, now: new Date() });
});
