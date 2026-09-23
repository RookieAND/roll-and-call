import { Button } from "@roll-and-call/ui";

interface RosterSheetButtonProps {
  onClick: () => void;
}

export function RosterSheetButton({ onClick }: RosterSheetButtonProps) {
  return (
    <Button variant="ghost" colorPalette="primary" size="sm" onClick={onClick}>
      명단 보기
    </Button>
  );
}
