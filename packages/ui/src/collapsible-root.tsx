"use client";

import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import type { ComponentPropsWithRef } from "react";

export function CollapsibleRoot(props: ComponentPropsWithRef<typeof BaseCollapsible.Root>) {
  return <BaseCollapsible.Root data-slot="collapsible" {...props} />;
}
