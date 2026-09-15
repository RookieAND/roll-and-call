import type { ReactNode } from "react";

export function ActionPair({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 [&>*]:flex-1">{children}</div>;
}
