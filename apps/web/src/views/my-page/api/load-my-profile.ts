import { cache } from "react";

import { getProfile } from "@/shared/server";

// 프로필·링크·설정 구역이 함께 읽어도 요청마다 한 번만 조회한다.
export const loadMyProfile = cache(getProfile);
