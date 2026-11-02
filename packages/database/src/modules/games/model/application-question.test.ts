import { describe, expect, it } from "vitest";

import { APPLICATION_QUESTION_DEFAULT, normalizeApplicationQuestion } from "./application-question";
import { applicationQuestionOf } from "./application-question-of";

describe("신청자에게 물을 질문", () => {
  it("비웠거나 기본 문구 그대로면 null로 저장한다", () => {
    expect(normalizeApplicationQuestion("  ")).toBeNull();
    expect(normalizeApplicationQuestion(APPLICATION_QUESTION_DEFAULT)).toBeNull();
    expect(normalizeApplicationQuestion(" 피하고 싶은 소재는? ")).toBe("피하고 싶은 소재는?");
  });

  it("신청글을 받는 구인만 질문이 있고, 없으면 기본 문구다", () => {
    expect(
      applicationQuestionOf({ applicationNoteEnabled: false, applicationQuestion: "x" }),
    ).toBeNull();
    expect(applicationQuestionOf({ applicationNoteEnabled: true, applicationQuestion: null })).toBe(
      APPLICATION_QUESTION_DEFAULT,
    );
    expect(applicationQuestionOf({ applicationNoteEnabled: true, applicationQuestion: "x" })).toBe(
      "x",
    );
  });
});
