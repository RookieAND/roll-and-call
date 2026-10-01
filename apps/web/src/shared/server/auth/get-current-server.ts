import "server-only";
import { getCurrentServer as loadCurrentServer } from "@roll-and-call/database/server";
import { cache } from "react";

// 레이아웃·페이지·액션이 같은 요청에서 여러 번 불러도 servers는 한 번만 읽는다.
export const getCurrentServer = cache(loadCurrentServer);
