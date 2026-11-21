import { Avatar, Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { Megaphone } from "lucide-react";

import { KeywordChips } from "@/entities/profile";
import { MemberTitle } from "@/features/view-badge";
import { ServerLink } from "@/shared/ui";

import { EMPTY_BIO } from "../model/empty-bio";
import { KEYWORD_LIMIT } from "../model/keyword-limit";
import type { UsersListItem } from "../model/users-list-item";

interface UserRowProps {
  user: UsersListItem;
}

export function UserRow({ user }: UserRowProps) {
  const bioForeground = user.bio ? "muted" : "hint";
  return (
    <HStack
      align="center"
      gap="125"
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="min-h-16 py-125"
    >
      <Avatar src={user.avatarUrl} name={user.username} size="md" />
      <VStack gap="050" className="min-w-0 flex-1">
        <HStack align="center" gap="075" className="min-w-0">
          <Text truncate typography="subtitle2">
            {user.username}
          </Text>
          <MemberTitle userId={user.userId} />
        </HStack>
        <KeywordChips
          keywords={user.keywords.slice(0, KEYWORD_LIMIT)}
          size="sm"
          hideEmpty
          className="h-5.5 min-w-0 overflow-hidden"
        />
        <Text truncate typography="body4" foreground={bioForeground}>
          {user.bio || EMPTY_BIO}
        </Text>
      </VStack>
      {user.recruitingCount > 0 && (
        <Badge
          colorPalette="primary"
          aria-label={`모집 중 ${user.recruitingCount}건`}
          className="gap-050"
        >
          <Megaphone size={14} aria-hidden />
          {user.recruitingCount}
        </Badge>
      )}
    </HStack>
  );
}
