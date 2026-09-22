// 이 브라우저에서 한 번 본 연출을 적어 둔다. 저장소를 못 쓰면 매번 처음 보는 것으로 친다.
export const seenStorage = {
  has(key: string) {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },
  mark(key: string) {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // 사생활 보호 모드 등에서는 다음 방문에 한 번 더 돌 뿐이다.
    }
  },
};
