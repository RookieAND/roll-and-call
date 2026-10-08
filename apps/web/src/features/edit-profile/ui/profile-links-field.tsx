"use client";

import { Button, HStack, IconButton, Select, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import {
  detectLinkService,
  LINK_MAX_COUNT,
  LINK_SERVICES,
  linkServiceOf,
  OTHER_LINK_SERVICE,
  type ProfileLink,
} from "@/entities/profile";

const SERVICE_OPTIONS = LINK_SERVICES.map((service) => ({
  value: service.key,
  label: service.label,
}));

interface ProfileLinksFieldProps {
  value: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
  discordHandle?: string | null;
}

export function ProfileLinksField({ value, onChange, discordHandle }: ProfileLinksFieldProps) {
  // 줄을 지워도 아래 줄의 입력 상태가 한 칸씩 밀리지 않게 줄마다 고정 key를 둔다.
  const nextKey = useRef(value.length);
  const [keys, setKeys] = useState(() => value.map((_, index) => index));
  const replace = (index: number, link: ProfileLink) =>
    onChange(value.map((item, itemIndex) => (itemIndex === index ? link : item)));

  return (
    <VStack gap="100">
      <HStack align="baseline" gap="100">
        <Text weight="bold" typography="body4" className="flex-1">
          링크
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {value.length} / {LINK_MAX_COUNT}
        </Text>
      </HStack>

      <VStack gap="075">
        {value.map((link, index) => {
          const service = linkServiceOf(link.service);
          return (
            <HStack key={keys[index] ?? `extra-${index}`} gap="075">
              <Select.Root
                items={SERVICE_OPTIONS}
                value={link.service}
                onValueChange={(next) => {
                  const nextService = String(next);
                  // 디스코드는 계정에서 사용자명을 알고 있어 고르기만 하면 채운다. 링크는 보는 쪽에서 ID로 잇는다.
                  const filled =
                    nextService === "discord" && discordHandle ? discordHandle : link.value;
                  replace(index, { service: nextService, value: filled });
                }}
              >
                <Select.Trigger
                  aria-label={`${index + 1}번째 링크 서비스`}
                  className="h-11 w-[132px] flex-none gap-075"
                />
                <Select.Popup>
                  {SERVICE_OPTIONS.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Root>
              <TextInput
                value={link.value}
                placeholder={service.placeholder}
                aria-label={`${service.label} 주소`}
                className="h-11 min-w-0 flex-1"
                onChange={(event) => replace(index, { ...link, value: event.target.value })}
                onBlur={(event) => {
                  const detected = detectLinkService(event.target.value);
                  if (detected !== link.service && detected !== OTHER_LINK_SERVICE) {
                    replace(index, { service: detected, value: event.target.value });
                  }
                }}
              />
              <IconButton
                variant="outline"
                aria-label={`${service.label} 링크 지우기`}
                className="h-11 w-11 flex-none"
                onClick={() => {
                  setKeys(keys.filter((_, itemIndex) => itemIndex !== index));
                  onChange(value.filter((_, itemIndex) => itemIndex !== index));
                }}
              >
                <Trash2 size={15} aria-hidden />
              </IconButton>
            </HStack>
          );
        })}
      </VStack>

      {value.length < LINK_MAX_COUNT && (
        <Button
          type="button"
          variant="tinted"
          className="h-11 w-full"
          onClick={() => {
            setKeys([...keys, nextKey.current++]);
            onChange([...value, { service: LINK_SERVICES[0].key, value: "" }]);
          }}
        >
          <Plus size={14} aria-hidden />
          링크 추가
        </Button>
      )}

      <Text typography="body4" foreground="hint" render={<p />}>
        위에서부터 마이페이지와 타인 프로필에 같은 순서로 보입니다.
      </Text>
    </VStack>
  );
}
