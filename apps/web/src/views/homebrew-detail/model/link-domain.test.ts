import { describe, expect, it } from "vitest";

import { linkDomain } from "./link-domain";

describe("linkDomain", () => {
  it("주소에서 도메인만 뽑고 www.를 뗀다", () => {
    expect(linkDomain("https://docs.google.com/document/d/1aQx7Rk")).toBe("docs.google.com");
    expect(linkDomain("https://www.notion.so/dalgrimja-rules")).toBe("notion.so");
  });

  it("주소가 아니면 그대로 둔다", () => {
    expect(linkDomain("notion")).toBe("notion");
  });
});
