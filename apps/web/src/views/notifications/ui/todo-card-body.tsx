import { Text } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface TodoCardBodyProps {
  title: string;
  lines: string[];
}

export function TodoCardBody({ title, lines }: TodoCardBodyProps) {
  return (
    <>
      <Text
        typography="heading3"
        weight="extrabold"
        render={<h3 />}
        className="mt-025 line-clamp-2"
      >
        {title}
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="[text-wrap:pretty]">
        <LineBreaks lines={lines} />
      </Text>
    </>
  );
}
