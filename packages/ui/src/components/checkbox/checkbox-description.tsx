import type { ReactNode } from "react";

import { Text } from "../text/text";

export function CheckboxDescription({ children }: { children: ReactNode }) {
  return (
    <Text
      data-slot="checkbox-description"
      typography="body4"
      foreground="hint"
      className="break-keep whitespace-pre-line"
    >
      {children}
    </Text>
  );
}
