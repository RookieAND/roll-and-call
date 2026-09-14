"use client";

import { Avatar, Button, Text } from "@trpg/ui";
import { useState, useTransition } from "react";
import { toast } from "@/shared/ui";
import { refreshAvatar } from "../api/refresh-avatar";

// 아바타는 Discord가 원본이라 편집 대신 다시 가져오기만 제공한다.
export function AvatarRefreshField({
  defaultUrl,
  name,
}: {
  defaultUrl?: string | null;
  // 이미지가 없을 때 이니셜을 만들 이름
  name: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? null);
  const [pending, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      const result = await refreshAvatar();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setUrl(result.avatarUrl ?? null);
      toast.success("아바타를 다시 불러왔습니다");
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar src={url} name={name} size="2xl" />
      <Text typography="body3" foreground="muted" className="min-w-0 flex-1">
        아바타는 디스코드에서 가져옵니다.
      </Text>
      <Button variant="outline" size="sm" className="h-9 shrink-0" loading={pending} onClick={reload}>
        다시 불러오기
      </Button>
    </div>
  );
}
