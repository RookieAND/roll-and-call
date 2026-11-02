import { IconButton, Sheet } from "@roll-and-call/ui";
import { X } from "lucide-react";

// 1100px 이상에서 시트가 가운데 Dialog가 되면 핸들 대신 머리글 오른쪽에 닫기 X를 둔다.
export function SheetCloseIcon() {
  return (
    <Sheet.Close
      render={
        <IconButton
          variant="ghost"
          aria-label="닫기"
          className="hidden flex-none desktop:inline-flex"
        />
      }
    >
      <X size={20} aria-hidden />
    </Sheet.Close>
  );
}
