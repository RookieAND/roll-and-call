export interface MenuServer {
  slug: string;
  name: string;
  icon: string | null;
  // 서버 홈 헤더의 전환 메뉴만 채운다
  todoCount?: number;
  // 인덱스의 가입 가능 서버 중 예전에 나갔던 곳
  returning?: boolean;
}
