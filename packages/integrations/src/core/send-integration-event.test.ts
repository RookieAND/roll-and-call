import { afterEach, expect, it, vi } from "vitest";

import { INTEGRATION_SIGNATURE_HEADER, INTEGRATION_TIMESTAMP_HEADER } from "./integration-headers";
import { sendIntegrationEvent } from "./send-integration-event";
import { signIntegrationBody } from "./sign-integration-body";

afterEach(() => vi.unstubAllGlobals());

it("봉투를 만들어 타임스탬프와 함께 서명해 보낸다", async () => {
  const fetchMock = vi.fn(
    async () =>
      new Response(
        JSON.stringify({
          version: 1,
          id: "game.started:1",
          status: "skipped",
          reason: "out_of_window",
        }),
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  const now = new Date("2026-10-31T00:00:00Z");

  const result = await sendIntegrationEvent({
    target: { url: "https://example.test/api/integrations/rnc", secret: "s3cret" },
    source: "roll-and-call",
    type: "game.started",
    id: "game.started:1",
    data: { gameId: "1" },
    now,
  });

  expect(result).toEqual({
    ok: true,
    response: { version: 1, id: "game.started:1", status: "skipped", reason: "out_of_window" },
  });
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  const headers = init.headers as Record<string, string>;
  const body = init.body as string;
  expect(JSON.parse(body)).toEqual({
    version: 1,
    id: "game.started:1",
    source: "roll-and-call",
    type: "game.started",
    occurredAt: "2026-10-31T00:00:00.000Z",
    data: { gameId: "1" },
  });
  const timestamp = headers[INTEGRATION_TIMESTAMP_HEADER]!;
  expect(timestamp).toBe(String(now.getTime() / 1000));
  expect(headers[INTEGRATION_SIGNATURE_HEADER]).toBe(
    await signIntegrationBody({ secret: "s3cret", timestamp, body }),
  );
});

it("실패는 던지지 않고 결과로 돌려준다", async () => {
  vi.stubGlobal(
    "fetch",
    async () =>
      new Response(
        JSON.stringify({
          version: 1,
          id: null,
          status: "rejected",
          code: "invalid_signature",
          message: "nope",
        }),
        { status: 401 },
      ),
  );
  const result = await sendIntegrationEvent({
    target: { url: "https://example.test", secret: "x" },
    source: "roll-and-call",
    type: "t",
    id: "1",
    data: {},
  });
  expect(result).toEqual({ ok: false, error: "401 invalid_signature nope" });
});
