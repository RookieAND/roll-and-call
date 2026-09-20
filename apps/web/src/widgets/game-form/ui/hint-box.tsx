import { Text } from "@trpg/ui";
import { Fragment, type ReactNode } from "react";

export function HintBox({ icon, lines }: { icon?: ReactNode; lines: readonly string[] }) {
  return (
    <div className="flex items-start gap-2.5 rounded-400 border border-gray-200 bg-gray-50 px-3 py-3">
      {icon && <span className="mt-0.5 flex-none text-gray-500">{icon}</span>}
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="min-w-0 flex-1 text-pretty leading-[1.7]"
      >
        {lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Text>
    </div>
  );
}
