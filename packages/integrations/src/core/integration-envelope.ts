// 외부 시스템에 보내는 모든 이벤트의 공용 봉투다. 이 폴더(core)는 의존성이 없는 순수 모듈이며
// supabase/functions/session-reminders/integration/의 복사본과 integration-copy.test.ts가 같은지 확인한다. 고치면 복사본도 같이 갈고 함수를 다시 배포한다.
export const INTEGRATION_ENVELOPE_VERSION = 1;

export interface IntegrationEnvelope<Type extends string = string, Data = unknown> {
  version: typeof INTEGRATION_ENVELOPE_VERSION;
  // 같은 사건에는 늘 같은 id를 쓴다(재전송해도 받는 쪽이 한 번만 처리할 수 있게).
  id: string;
  source: string;
  type: Type;
  occurredAt: string;
  data: Data;
}

export function buildIntegrationEnvelope<Type extends string, Data>({
  source,
  type,
  id,
  data,
  now,
}: {
  source: string;
  type: Type;
  id: string;
  data: Data;
  now: Date;
}): IntegrationEnvelope<Type, Data> {
  return {
    version: INTEGRATION_ENVELOPE_VERSION,
    id,
    source,
    type,
    occurredAt: now.toISOString(),
    data,
  };
}
