import { describe, expect, it } from "vitest";

import { discordNoteMessage } from "./discord-note-message";

describe("discordNoteMessage", () => {
  it("비었거나 공백뿐이면 비어 있다고 알린다", () => {
    expect(discordNoteMessage(undefined)).toContain("비어 있습니다");
    expect(discordNoteMessage(" \n\t ")).toContain("비어 있습니다");
  });

  it("500자를 넘으면 지금 글자 수와 함께 알린다", () => {
    const message = discordNoteMessage("가".repeat(501));
    expect(message).toContain("500자를 넘었습니다");
    expect(message).toContain("지금은 501자");
  });
});
