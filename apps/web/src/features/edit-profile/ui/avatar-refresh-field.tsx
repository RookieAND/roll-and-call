"use client";

import { Avatar, Button, HStack, Text } from "@trpg/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { refreshAvatar } from "../api/refresh-avatar";

interface AvatarRefreshFieldProps {
  defaultUrl?: string | null;
  name: string;
}

export function AvatarRefreshField({ defaultUrl, name }: AvatarRefreshFieldProps) {
  const [url, setUrl] = useState(defaultUrl ?? null);
  const { pending, run } = useAction();

  function reload() {
    run(() => refreshAvatar(), {
      onSuccess: (result) => {
        setUrl(result.avatarUrl ?? null);
        toast.success("아바타를 다시 불러왔습니다");
      },
    });
  }

  return (
    <HStack align="center" gap="150">
      <Avatar src={url} name={name} size="2xl" />
      <Text typography="body3" foreground="muted" className="min-w-0 flex-1">
        아바타는 디스코드에서 가져옵니다.
      </Text>
      <Button
        variant="outline"
        size="sm"
        className="h-9 shrink-0"
        loading={pending}
        onClick={reload}
      >
        다시 불러오기
      </Button>
    </HStack>
  );
}
