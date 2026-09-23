import { Fragment } from "react";

interface LineBreaksProps {
  lines: readonly string[];
}

// 모델이 문장마다 나눠 준 안내를 <br />로 잇는다.
export function LineBreaks({ lines }: LineBreaksProps) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
