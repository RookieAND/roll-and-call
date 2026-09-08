// 서버 액션 공통 반환. error → 인라인 표시, redirect → 클라이언트가 이동(토스트는 클라이언트 몫).
export type ActionResult = { error?: string; redirect?: string };
