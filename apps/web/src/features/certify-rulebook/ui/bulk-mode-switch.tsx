"use client";

import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { Card, HStack, Switch, Text, VStack } from "@roll-and-call/ui";

interface BulkModeSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function BulkModeSwitch({ checked, onCheckedChange }: BulkModeSwitchProps) {
  return (
    <Card.Root
      padding="sm"
      radius={500}
      background="none"
      className={checked ? "border-tinted-border bg-tinted-bg" : undefined}
    >
      <HStack align="center" gap="150" className="px-025">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle2" render={<label htmlFor="bulkCert" />}>
            여러 권 함께 신청
          </Text>
          <Text typography="body4" foreground="muted" render={<p />} id="bulkCert-hint">
            {`사진 한 묶음으로 최대 ${BULK_CERT_MAX_BOOKS}권까지 신청합니다`}
          </Text>
        </VStack>
        <Switch.Root
          id="bulkCert"
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-describedby="bulkCert-hint"
        >
          <Switch.Control />
        </Switch.Root>
      </HStack>
    </Card.Root>
  );
}
