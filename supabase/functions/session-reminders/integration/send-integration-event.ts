import { buildIntegrationEnvelope } from "./integration-envelope.ts";
import {
  INTEGRATION_SIGNATURE_HEADER,
  INTEGRATION_TIMESTAMP_HEADER,
} from "./integration-headers.ts";
import {
  INTEGRATION_STATUS,
  parseIntegrationResponse,
  type IntegrationResponse,
} from "./integration-response.ts";
import { signIntegrationBody } from "./sign-integration-body.ts";

export interface IntegrationTarget {
  url: string;
  secret: string;
}

export type SendIntegrationResult =
  | { ok: true; response: IntegrationResponse }
  | { ok: false; error: string };

const TIMEOUT_MS = 8000;

// 던지지 않는다. 실패는 결과로 돌려주고, 재시도할지는 부른 쪽이 정한다.
export async function sendIntegrationEvent<Type extends string, Data>({
  target,
  source,
  type,
  id,
  data,
  now = new Date(),
}: {
  target: IntegrationTarget;
  source: string;
  type: Type;
  id: string;
  data: Data;
  now?: Date;
}): Promise<SendIntegrationResult> {
  const body = JSON.stringify(buildIntegrationEnvelope({ source, type, id, data, now }));
  const timestamp = String(Math.floor(now.getTime() / 1000));
  try {
    const response = await fetch(target.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        [INTEGRATION_TIMESTAMP_HEADER]: timestamp,
        [INTEGRATION_SIGNATURE_HEADER]: await signIntegrationBody({
          secret: target.secret,
          timestamp,
          body,
        }),
      },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await response.text();
    const parsed = parseIntegrationResponse(text);
    if (!response.ok || !parsed || parsed.status === INTEGRATION_STATUS.rejected) {
      const detail = parsed ? `${parsed.code} ${parsed.message}` : text;
      return { ok: false, error: `${response.status} ${detail}` };
    }
    return { ok: true, response: parsed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
