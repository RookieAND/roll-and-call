// 유저 상세를 보는 운영진. owner는 서버 소유자(플랫폼 관리자 포함)다.
export interface Viewer {
  id: string;
  owner: boolean;
}
