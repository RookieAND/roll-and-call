const STORAGE_KEY = "onboarding-seen";

// ponytail: 본 적 있는지를 브라우저에만 남긴다. 기기마다 다시 뜨는 게 문제가 되면 프로필 컬럼으로 올린다.
export function onboardingSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // 저장이 막힌 브라우저에서는 매번 보여주는 대신 조용히 넘긴다.
  }
}
