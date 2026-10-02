export interface MenuServer {
  slug: string;
  name: string;
  icon: string | null;
  // 서버 홈 헤더의 전환 메뉴만 채운다
  todoCount?: number;
}
