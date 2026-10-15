import { SORT_DIR } from "@/shared/lib";
import type { ListSortOption } from "@/shared/ui";

// 모바일 정렬 시트. 표 머리글 정렬과 같은 sort·dir 값을 쓴다.
export const USER_SORT_OPTIONS: ListSortOption[] = [
  { label: "가입일 최신순", column: "joined", dir: SORT_DIR.desc },
  { label: "최근 30일 불참 많은 순", column: "noshow", dir: SORT_DIR.desc },
  { label: "연 세션 많은 순", column: "hosted", dir: SORT_DIR.desc },
  { label: "참여 세션 많은 순", column: "played", dir: SORT_DIR.desc },
  { label: "인증 룰북 많은 순", column: "certs", dir: SORT_DIR.desc },
  { label: "닉네임 가나다순", column: "nickname", dir: SORT_DIR.asc },
];
