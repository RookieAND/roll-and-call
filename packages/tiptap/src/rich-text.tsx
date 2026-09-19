import { cn } from "@trpg/ui";

import { toRichTextDoc } from "./rich-text-doc";
import { RichTextNode } from "./rich-text-node";

export function RichText({ value, className }: { value: string; className?: string }) {
  const doc = toRichTextDoc(value);

  return (
    <div className={cn("rich-text", className)}>
      {doc.content.map((node, index) => (
        <RichTextNode key={index} node={node} />
      ))}
    </div>
  );
}
