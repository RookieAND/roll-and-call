import { Callout, type CalloutPalette } from "@roll-and-call/ui";
import { Fragment } from "react";

interface ActionNoticeProps {
  title: string;
  lines?: string[];
  colorPalette?: CalloutPalette;
}

export function ActionNotice({ title, lines = [], colorPalette = "gray" }: ActionNoticeProps) {
  return (
    <Callout.Root colorPalette={colorPalette} size="sm">
      <Callout.Icon />
      <div>
        <Callout.Title className="break-keep">{title}</Callout.Title>
        {lines.length > 0 && (
          <Callout.Description className="break-keep">
            {lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </Callout.Description>
        )}
      </div>
    </Callout.Root>
  );
}
