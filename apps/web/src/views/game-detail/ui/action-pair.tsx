import type { ReactNode } from "react";

export function ActionPair({ children }: { children: ReactNode }) {
  return <div className="flex gap-100 [&>*]:flex-1">{children}</div>;
}
