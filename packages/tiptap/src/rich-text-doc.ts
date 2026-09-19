export type RichTextMark = { type: string; attrs?: { href?: string | null } };

export type RichTextNodeData = {
  type: string;
  text?: string;
  marks?: RichTextMark[];
  content?: RichTextNodeData[];
};

export type RichTextDoc = { type: "doc"; content: RichTextNodeData[] };

// 리치 에디터 이전에 저장된 값은 평문이라 JSON 파싱이 실패한다. 줄만 문단으로 살려서 같은 문서로 다룬다.
export function toRichTextDoc(value: string): RichTextDoc {
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as RichTextDoc).type === "doc" &&
      Array.isArray((parsed as RichTextDoc).content)
    ) {
      return parsed as RichTextDoc;
    }
  } catch {
    // 평문으로 넘어간다.
  }

  return {
    type: "doc",
    content: value.split("\n").map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : undefined,
    })),
  };
}
