import type { MyHomebrewApplication } from "@roll-and-call/database/homebrew";
import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import { HOMEBREW_STATUS_BADGE } from "../model/homebrew-status-badge";

interface MyHomebrewRowProps {
  application: MyHomebrewApplication;
}

export function MyHomebrewRow({ application }: MyHomebrewRowProps) {
  const badge = HOMEBREW_STATUS_BADGE[application.status];
  return (
    <ServerLink
      path={`/me/rulebooks/maker/${application.id}`}
      className="flex min-h-(--rc-size-cell) items-center gap-150 border-t border-gray-100 py-150 pr-150 pl-200 transition-colors first:border-t-0 hover:bg-gray-50"
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="baseline" gap="075" wrap>
          <Text typography="body2" weight="medium" className="break-keep">
            {application.name}
          </Text>
          {application.edition && (
            <Text typography="body4" weight="medium" foreground="hint">
              {application.edition}
            </Text>
          )}
        </HStack>
        <Text typography="body4" foreground="muted" truncate>
          {application.summary}
        </Text>
      </VStack>
      {badge && (
        <Badge colorPalette={badge.palette} className="flex-none">
          {badge.label}
        </Badge>
      )}
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </ServerLink>
  );
}
