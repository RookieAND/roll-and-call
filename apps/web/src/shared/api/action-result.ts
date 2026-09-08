// 서버 액션 공통 반환. error → 인라인 표시(field가 있으면 그 입력 옆), redirect → 클라이언트가 이동.
export type ActionResult = { error?: string; field?: string; redirect?: string };
