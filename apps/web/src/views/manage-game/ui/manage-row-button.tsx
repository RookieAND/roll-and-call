import { Badge, Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { ManageRow } from "../model/manage-row-state";

interface ManageRowButtonProps {
  button: NonNullable<ManageRow["button"]>;
}

export function ManageRowButton({ button }: ManageRowButtonProps) {
  const variant = button.solid ? "solid" : "outline";

  return (
    <div className="px-175 pb-150">
      <Button
        render={<ServerLink path={button.href} />}
        variant={variant}
        size="lg"
        className="w-full"
      >
        {button.label}
        {button.caption && (
          <Badge colorPalette="gray" className="bg-white/20 text-current">
            {button.caption}
          </Badge>
        )}
      </Button>
    </div>
  );
}
