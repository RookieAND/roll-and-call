import { cache } from "react";

import { getBadgeFacts } from "@/shared/server";

// 대표 업적 상세와 업적 블록이 함께 읽어도 요청마다 한 번만 조회한다.
export const loadMyBadgeFacts = cache((userId: string) => getBadgeFacts(userId));
