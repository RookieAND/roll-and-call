import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface MobileNextButtonProps {
  href?: string;
}

export function MobileNextButton({ href }: MobileNextButtonProps) {
  if (!href) {
    return (
      <Button disabled className="min-h-12 flex-1">
        다음 건
      </Button>
    );
  }
  return (
    <Button render={<ServerLink path={href} />} className="min-h-12 flex-1">
      다음 건
    </Button>
  );
}
