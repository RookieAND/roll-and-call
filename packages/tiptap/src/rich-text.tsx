import { cn } from "@trpg/ui";

import { toRichTextDoc } from "./rich-text-doc";
import { RichTextNode } from "./rich-text-node";

interface RichTextProps {
  value: string;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  const doc = toRichTextDoc(value);

  return (
    <div className={cn("rich-text", className)}>
      {doc.content.map((node, index) => (
        <RichTextNode key={index} node={node} />
      ))}
    </div>
  );
}
