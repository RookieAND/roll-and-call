"use client";

import { Button, Callout, Select, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { importMemberProfile } from "../api/import-member-profile";

interface ProfileImportCalloutProps {
  servers: { id: string; name: string }[];
}

export function ProfileImportCallout({ servers }: ProfileImportCalloutProps) {
  const [fromServerId, setFromServerId] = useState(servers[0]?.id ?? "");
  const [imported, setImported] = useState(false);
  const { pending, run } = useAction();
  const items = servers.map((server) => ({ value: server.id, label: server.name }));
  const fromServerName = servers.find((server) => server.id === fromServerId)?.name;

  function importProfile() {
    run(() => importMemberProfile({ fromServerId }), {
      onSuccess: () => {
        setImported(true);
        toast.success(`${fromServerName} 프로필을 가져왔어요`);
      },
    });
  }

  if (imported) {
    return (
      <Callout.Root colorPalette="success" size="sm">
        <Callout.Icon />
        <Callout.Description>
          {fromServerName}의 소개·성향·링크·기본 가능 시간을 가져왔어요.
        </Callout.Description>
      </Callout.Root>
    );
  }

  return (
    <Callout.Root colorPalette="primary" size="sm">
      <Callout.Icon />
      <VStack gap="100" className="min-w-0 flex-1">
        <Callout.Title>다른 서버 프로필을 가져올 수 있어요</Callout.Title>
        <Callout.Description>
          소개·성향·링크·기본 가능 시간만 옮겨요. 기록·뱃지·인증은 서버마다 따로예요.
        </Callout.Description>
        {servers.length > 1 && (
          <Select.Root
            items={items}
            value={fromServerId}
            onValueChange={(value: string) => setFromServerId(value)}
          >
            <Select.Trigger aria-label="가져올 서버" />
            <Select.Popup>
              {items.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        )}
        <Button variant="outline" size="sm" loading={pending} onClick={importProfile}>
          {fromServerName} 프로필에서 가져오기
        </Button>
      </VStack>
    </Callout.Root>
  );
}
