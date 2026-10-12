import { cn } from "@roll-and-call/ui";

import { toRichTextDoc } from "./rich-text-doc";
import { RichTextNode } from "./rich-text-node";

interface RichTextProps {
  value: string;
  className?: string;
  linkLabels?: Record<string, string>;
}

export function RichText({ value, className, linkLabels }: RichTextProps) {
  const doc = toRichTextDoc(value);

  return (
    <div className={cn("rich-text", className)}>
      {doc.content.map((node, index) => (
        <RichTextNode key={index} node={node} linkLabels={linkLabels} />
      ))}
    </div>
  );
}
