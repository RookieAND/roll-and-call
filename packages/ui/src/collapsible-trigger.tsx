"use client";

import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import type { ComponentPropsWithRef } from "react";

export function CollapsibleTrigger(props: ComponentPropsWithRef<typeof BaseCollapsible.Trigger>) {
  return <BaseCollapsible.Trigger data-slot="collapsible-trigger" {...props} />;
}
