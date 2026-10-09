import { isPlainObject } from "es-toolkit";

import type { RichTextDoc } from "./rich-text-doc";

export function isRichTextDoc(value: unknown): value is RichTextDoc {
  return (
    isPlainObject(value) &&
    value.type === "doc" &&
    Array.isArray(value.content) &&
    value.content.every((node) => isPlainObject(node) && typeof node.type === "string")
  );
}
