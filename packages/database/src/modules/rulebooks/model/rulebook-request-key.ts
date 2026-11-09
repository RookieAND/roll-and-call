export const RULEBOOK_REQUEST_MAX_BOOKS = 20;

// 기존 대기 요청의 이름·판본 비교 규칙을 사용자/구인 생성 경로에서 함께 쓴다.
export function rulebookRequestKey({ name, edition }: { name: string; edition: string }) {
  return `${name.trim()} ${edition.trim()}`.trim().toLowerCase();
}
