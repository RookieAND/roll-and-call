export const AUTH_ERROR = { failed: "1", emailMissing: "email" } as const;
export type AuthError = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

export const AUTH_ERROR_MESSAGE: Record<AuthError, string> = {
  [AUTH_ERROR.failed]: "디스코드 로그인을 마치지 못했습니다. 다시 시도해 주세요.",
  [AUTH_ERROR.emailMissing]:
    "디스코드 계정에 인증된 이메일이 없습니다. 디스코드 설정에서 이메일을 등록·인증한 뒤 다시 로그인해 주세요.",
};
