import type { IntegrationTarget } from "../core";

export const CANVAS_SLUG = "canvas";

// 환경 변수가 없으면 연동을 쓰지 않는 환경이다.
export function canvasTarget(): IntegrationTarget | null {
  const url = process.env.CANVAS_INTEGRATION_URL;
  const secret = process.env.CANVAS_INTEGRATION_SECRET;
  return url && secret ? { url, secret } : null;
}
