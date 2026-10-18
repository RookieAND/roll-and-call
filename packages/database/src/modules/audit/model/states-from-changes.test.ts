import { describe, expect, it } from "vitest";

import { statesFromChanges } from "./states-from-changes";

const base = { afterLabel: "수정됨", target: "대상" };

describe("statesFromChanges", () => {
  it("한 칸이면 이전 값과 바뀐 값을 보여준다", () => {
    const result = statesFromChanges({
      ...base,
      changes: [{ field: "판본", before: "구판", after: "신판" }],
    });
    expect(result.before).toEqual({ label: "구판", sub: "판본" });
    expect(result.after).toEqual({ label: "신판", sub: "판본" });
  });

  it("목록 한 칸은 추가된 항목을 바뀐 값으로 보여준다", () => {
    const result = statesFromChanges({
      ...base,
      changes: [{ field: "다른 이름", added: ["별칭"] }],
    });
    expect(result.before.label).toBe("없음");
    expect(result.after.label).toBe("별칭");
  });

  it("모두 새로 생긴 칸이면 전은 없음이다", () => {
    const result = statesFromChanges({
      ...base,
      afterLabel: "추가됨",
      changes: [
        { field: "이름", after: "룰북" },
        { field: "판본", after: "신판" },
      ],
    });
    expect(result.before).toEqual({ label: "없음" });
    expect(result.after).toEqual({ label: "추가됨", sub: "대상" });
  });

  it("여러 칸이 섞이면 칸 이름을 보여준다", () => {
    const result = statesFromChanges({
      ...base,
      changes: [
        { field: "이름", before: "가", after: "나" },
        { field: "판본", after: "신판" },
      ],
    });
    expect(result.before.sub).toBe("이름 · 판본");
    expect(result.after.label).toBe("수정됨");
  });

  it("긴 값은 줄인다", () => {
    const result = statesFromChanges({
      ...base,
      changes: [{ field: "설명 문장", before: "가".repeat(100), after: "나" }],
    });
    expect(result.before.label.endsWith("…")).toBe(true);
  });
});
