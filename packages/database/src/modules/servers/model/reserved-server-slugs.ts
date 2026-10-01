// 서버 주소(/{slug})로 쓸 수 없는 이름. 서버 밖 화면·API와, 옛 주소 리다이렉트가 쓰는 접두어(games·me·u)다.
export const RESERVED_SERVER_SLUGS = [
  "help",
  "about",
  "admin",
  "api",
  "login",
  "logout",
  "auth",
  "invite",
  "servers",
  "settings",
  "onboarding",
  "games",
  "me",
  "u",
] as const;
