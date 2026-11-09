"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Sheet, Text } from "@roll-and-call/ui";

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
                최대 {RULEBOOK_REQUEST_MAX_BOOKS}권까지 함께 요청할 수 있어요.
                <br />
                운영진은 책마다 따로 검토하고, 결과를 알림으로 알려 드립니다.
              </Text>
            }
            onSent={() => onOpenChange(false)}
          />
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
