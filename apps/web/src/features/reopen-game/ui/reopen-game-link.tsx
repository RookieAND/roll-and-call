import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ReopenGameLinkProps {
  gameId: string;
  variant?: "solid" | "outline";
  colorPalette?: "primary" | "gray";
  size?: "md" | "lg";
  label?: string;
}

export function ReopenGameLink({
  gameId,
  variant = "solid",
  colorPalette = "primary",
  size = "lg",
  label = "다시 열기",
}: ReopenGameLinkProps) {
  return (
    <Button
      render={<ServerLink path={`/games/new?from=${gameId}`} />}
      variant={variant}
      colorPalette={colorPalette}
      size={size}
      className="w-full"
    >
      {label}
    </Button>
  );
}
