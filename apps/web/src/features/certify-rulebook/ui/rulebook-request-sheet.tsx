"use client";

import { Button, Sheet, Text } from "@roll-and-call/ui";

import { RulebookRequestBody } from "./rulebook-request-body";
import { SheetTitleRow } from "./sheet-title-row";

interface RulebookRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryNames: string[];
  pendingRequestNames: string[];
  initialName: string;
}

export function RulebookRequestSheet({
  open,
  onOpenChange,
  categoryNames,
  pendingRequestNames,
  initialName,
}: RulebookRequestSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰북 추가 요청" className="h-[92dvh] px-0">
        <Sheet.Handle />
        <SheetTitleRow title="룰북 추가 요청" />
        <Sheet.Body className="px-200 pb-200">
          <RulebookRequestBody
            categoryNames={categoryNames}
            pendingRequestNames={pendingRequestNames}
            initialName={initialName}
            intro={
              <Text typography="body3" foreground="muted" render={<p />}>
                추가되면 알림 탭으로 알립니다.
              </Text>
            }
            onSent={() => onOpenChange(false)}
            renderFooter={({ submit, pending, disabled }) => (
              <div className="-mx-200 mt-200 border-t border-gray-100 px-200 pt-150">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={disabled}
                  loading={pending}
                  onClick={submit}
                >
                  추가 요청 보내기
                </Button>
              </div>
            )}
          />
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
