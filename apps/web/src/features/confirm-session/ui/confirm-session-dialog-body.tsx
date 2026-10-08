import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import { DIALOG_ROW_TONE, type ConfirmDialogContent } from "../model/confirm-dialog-content";
import { dialogRowForeground } from "../model/dialog-row-foreground";

interface ConfirmSessionDialogBodyProps {
  content: ConfirmDialogContent;
  failure?: string[] | null;
}

export function ConfirmSessionDialogBody({ content, failure }: ConfirmSessionDialogBodyProps) {
  const { rows, warning, note } = content;

  return (
    <VStack gap="150" className="break-keep">
      <VStack gap="100" className="rounded-400 bg-gray-50 px-175 py-150">
        {rows.map((row) => {
          const isNew = row.tone === DIALOG_ROW_TONE.new;
          const isOld = row.tone === DIALOG_ROW_TONE.old;
          const foreground = dialogRowForeground(row.tone);
          return (
            <HStack key={row.label} align="baseline" gap="150">
              <Text typography="body4" foreground="hint" className="w-14 flex-none">
                {row.label}
              </Text>
              <Text
                numeric
                typography="body2"
                weight={isNew ? "bold" : "medium"}
                foreground={foreground}
                className={isOld ? "min-w-0 flex-1 line-through" : "min-w-0 flex-1"}
              >
                {row.value}
              </Text>
            </HStack>
          );
        })}
      </VStack>
      {warning && (
        <Callout.Root colorPalette="warning" size="sm">
          <Callout.Icon />
          <Callout.Description>
            {warning.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Callout.Description>
        </Callout.Root>
      )}
      {failure && (
        <Callout.Root colorPalette="danger" size="sm">
          <Callout.Icon />
          <Callout.Description>
            {failure.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Callout.Description>
        </Callout.Root>
      )}
      {note && (
        <Text typography="body3" foreground="muted" render={<p />}>
          {note}
        </Text>
      )}
    </VStack>
  );
}
