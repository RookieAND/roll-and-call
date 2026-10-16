import "server-only";
import { listMemberServers as readMemberServers } from "@roll-and-call/database/servers";
import { cache } from "react";

// 좌측 내비와 서버 전환 메뉴가 한 요청에서 함께 부르므로 한 번만 읽는다.
export const listMemberServers = cache((userId: string) => readMemberServers(userId));
