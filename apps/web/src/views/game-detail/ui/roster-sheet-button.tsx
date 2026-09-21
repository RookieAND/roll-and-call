import { Button } from "@trpg/ui";

interface RosterSheetButtonProps {
  onClick: () => void;
}

export function RosterSheetButton({ onClick }: RosterSheetButtonProps) {
  return (
    <Button variant="ghost" size="sm" className="text-primary-ink" onClick={onClick}>
      명단 보기
    </Button>
  );
}
