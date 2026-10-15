"use client";

import { Dialog, Text, VStack, cn, type DialogFooterProps } from "@roll-and-call/ui";
import { useContext } from "react";

import { ResponsiveDialogContext } from "./responsive-dialog-context";

interface ResponsiveDialogFooterProps extends DialogFooterProps {
  // 확정 버튼이 비활성인 이유. 모바일 시트에서만 버튼 위에 한 줄로 보인다.
  disabledReason?: string | null;
}

// 모바일은 아래에 붙는 버튼 줄(취소 / 확정)이다. 버튼은 같은 폭, 48px 높이다.
export function ResponsiveDialogFooter({
  disabledReason,
  className,
  ...props
}: ResponsiveDialogFooterProps) {
  const desktop = useContext(ResponsiveDialogContext);
  if (desktop) return <Dialog.Footer className={className} {...props} />;
  return (
    <VStack gap="100" className="-mx-200 mt-150 border-t border-gray-200 px-200 pt-100">
      {disabledReason ? (
        <Text typography="body4" foreground="hint" className="text-center">
          {disabledReason}
        </Text>
      ) : null}
      <Dialog.Footer
        {...props}
        layout="row"
        className={cn(
          className,
          "mt-0 items-center [&>button:not(.mr-auto)]:min-h-12 [&>button:not(.mr-auto)]:flex-1",
        )}
      />
    </VStack>
  );
}
