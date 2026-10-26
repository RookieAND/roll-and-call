import { describe, expect, it, vi } from "vitest";

import { handleAttendanceSelect } from "./handle-attendance-select";
import type { DiscordInteraction } from "./interaction-types";

// game-notices 인덱스가 서버 전용 모듈을 함께 내보내서 server-only를 비운다.
vi.mock("server-only", () => ({}));

const message = {
  components: [
    {
      components: [
        {
          custom_id: "attendance-select:game",
          options: [
            { label: "가람", value: "u1" },
            { label: "나비", value: "u2", default: true },
          ],
        },
      ],
    },
  ],
};

type RenderedRow = { components: { options: { value: string; default: boolean }[] }[] };

const defaultsOf = (response: ReturnType<typeof handleAttendanceSelect>) => {
  const rows = (response.data?.components ?? []) as RenderedRow[];
  return rows[0]!.components[0]!.options.map((option) => [option.value, option.default]);
};

describe("handleAttendanceSelect", () => {
  it("고른 사람을 기본 선택값으로 다시 그리고 메시지를 고친다", () => {
    const response = handleAttendanceSelect({
      type: 3,
      message,
      data: { custom_id: "attendance-select:game", values: ["u1"] },
    } as DiscordInteraction);
    expect(response.type).toBe(7);
    expect(defaultsOf(response)).toEqual([
      ["u1", true],
      ["u2", false],
    ]);
  });

  it("아무것도 고르지 않으면 모두 해제된다", () => {
    const response = handleAttendanceSelect({
      type: 3,
      message,
      data: { custom_id: "attendance-select:game", values: [] },
    } as DiscordInteraction);
    expect(defaultsOf(response).every(([, selected]) => !selected)).toBe(true);
  });
});
