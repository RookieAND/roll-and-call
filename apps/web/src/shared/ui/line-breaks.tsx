import { Fragment } from "react";

interface LineBreaksProps {
  lines: readonly string[];
}

export function LineBreaks({ lines }: LineBreaksProps) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
