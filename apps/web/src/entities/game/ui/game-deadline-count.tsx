import { Badge } from "@roll-and-call/ui";

interface GameDeadlineCountProps {
  label: string;
}

export function GameDeadlineCount({ label }: GameDeadlineCountProps) {
  return <Badge className="tabular-nums">{label}</Badge>;
}
