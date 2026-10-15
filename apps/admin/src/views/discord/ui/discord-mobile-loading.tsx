import { Skeleton, VStack } from "@roll-and-call/ui";

import { LoadingRegion } from "@/shared/ui";

import type { DiscordHref } from "../model/discord-nav-items";
import { MobileDiscordFrame } from "./mobile/mobile-discord-frame";

interface DiscordMobileLoadingProps {
  active: Exclude<DiscordHref, "/discord/link">;
}

export function DiscordMobileLoading({ active }: DiscordMobileLoadingProps) {
  return (
    <MobileDiscordFrame active={active}>
      <LoadingRegion label="불러오는 중입니다">
        <VStack gap="150" className="px-150 pt-150 pb-200">
          {[0, 1, 2].map((index) => (
            <VStack
              key={index}
              gap="100"
              className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
            >
              <Skeleton width="40%" height={18} />
              <Skeleton width="100%" height={44} rounded={400} />
              <Skeleton width="100%" height={44} rounded={400} />
            </VStack>
          ))}
        </VStack>
      </LoadingRegion>
    </MobileDiscordFrame>
  );
}
