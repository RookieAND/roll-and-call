import { Button } from "@roll-and-call/ui";

interface RosterSheetButtonProps {
  onClick: () => void;
}

// 보이는 크기는 sm 그대로 두고 위아래로 6px씩 넓혀 터치 영역을 44px로 맞춘다.
export function RosterSheetButton({ onClick }: RosterSheetButtonProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="primary"
      size="sm"
      className="relative after:absolute after:inset-x-0 after:-inset-y-075"
      onClick={onClick}
    >
      명단 보기
    </Button>
  );
}
