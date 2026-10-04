export interface MenuServer {
  slug: string;
  name: string;
  icon: string | null;
  // 서버 홈 헤더와 인덱스의 서버 메뉴가 채운다. 그 서버 알림 탭 [할 일] 수와 같다.
  todoCount?: number;
  // 인덱스의 가입 가능 서버 중 예전에 나갔던 곳
  returning?: boolean;
}
