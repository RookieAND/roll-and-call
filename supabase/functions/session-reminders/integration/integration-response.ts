import type { IntegrationEnvelope } from "./integration-envelope.ts";

// 받는 쪽이 돌려주는 공용 응답이다. processed·skipped는 정상 처리(skipped는 이벤트 기간 밖처럼 받는 쪽이 일부러 건너뛴 것)이고, 실패는 rejected와 오류 코드로 온다.
export const INTEGRATION_STATUS = {
  processed: "processed",
  skipped: "skipped",
  rejected: "rejected",
} as const;

export type IntegrationStatus = (typeof INTEGRATION_STATUS)[keyof typeof INTEGRATION_STATUS];

export interface IntegrationResponse {
  version: IntegrationEnvelope["version"];
  id: string | null;
  status: IntegrationStatus;
  reason?: string;
  detail?: Record<string, unknown>;
  code?: string;
  message?: string;
}

export function parseIntegrationResponse(text: string): IntegrationResponse | null {
  try {
    const value = JSON.parse(text) as Partial<IntegrationResponse> | null;
    const known = Object.values(INTEGRATION_STATUS) as string[];
    return value && typeof value.status === "string" && known.includes(value.status)
      ? (value as IntegrationResponse)
      : null;
  } catch {
    return null;
  }
}
