import { Callout } from "@roll-and-call/ui";
import { Fragment } from "react";

interface ScheduleNoticeProps {
  title: string;
  lines: readonly string[];
}

export function ScheduleNotice({ title, lines }: ScheduleNoticeProps) {
  return (
    <Callout.Root colorPalette="gray">
      <Callout.Icon />
      <Callout.Title>{title}</Callout.Title>
      <Callout.Description>
        {lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Callout.Description>
    </Callout.Root>
  );
}
