"use client";

import { Button, IconButton, Select, Text, TextInput } from "@trpg/ui";
import { Plus, Trash2 } from "lucide-react";

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

export function ProfileLinksField({
  value,
  onChange,
}: {
  value: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
}) {
  const replace = (index: number, link: ProfileLink) =>
    onChange(value.map((item, itemIndex) => (itemIndex === index ? link : item)));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <Text typography="subtitle2" className="flex-1 text-[12.5px]">
          링크
        </Text>
        <Text typography="body4" foreground="hint" className="tabular-nums">
          {value.length} / {LINK_MAX_COUNT}
        </Text>
      </div>

      <div className="flex flex-col gap-1.5">
        {value.map((link, index) => {
          const service = linkServiceOf(link.service);
          return (
            <div key={index} className="flex gap-1.5">
              <Select.Root
                items={SERVICE_OPTIONS}
                value={link.service}
                onValueChange={(next) => replace(index, { ...link, service: String(next) })}
              >
                <Select.Trigger
                  aria-label={`${index + 1}번째 링크 서비스`}
                  className="h-11 w-[132px] flex-none gap-1.5"
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
                // 주소를 붙여넣으면 서비스를 알아내 골라준다.
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
                onClick={() =>
                  onChange(value.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                <Trash2 size={15} aria-hidden />
              </IconButton>
            </div>
          );
        })}
      </div>

      {value.length < LINK_MAX_COUNT && (
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full gap-1.5 rounded-[11px] border border-dashed border-gray-300 text-[13.5px] font-bold text-primary-ink"
          onClick={() => onChange([...value, { service: LINK_SERVICES[0].key, value: "" }])}
        >
          <Plus size={14} aria-hidden />
          링크 추가
        </Button>
      )}

      <Text typography="body4" foreground="hint" render={<p />}>
        SNS는 서비스를 고르고 핸들만 적으면 주소를 만듭니다.
        <br />
        위에서부터 마이페이지와 타인 프로필에 그대로 나옵니다.
      </Text>
    </div>
  );
}
