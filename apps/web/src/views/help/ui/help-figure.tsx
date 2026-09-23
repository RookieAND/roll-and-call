import { Avatar, Badge, Card, Chip, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";

import { BrandMark, LINK_SERVICES } from "@/entities/profile";
import { HeatSample } from "@/shared/ui";

import { HELP_FIGURE, type HelpFigureKey } from "../model/help-docs";

const SAMPLE_STATUS_CHIPS = ["모집 중", "대기 접수 중", "모집 마감"];

interface HelpFigureProps {
  figure: HelpFigureKey;
}

// ponytail: 시안의 "실제 화면 조각"을 설명용으로 축소한 그림이다. inert라 누르거나 초점이 가는 것은 하나도 없다.
export function HelpFigure({ figure }: HelpFigureProps) {
  if (figure === HELP_FIGURE.heatGrid) {
    return (
      <Card.Root radius={500} background="subtle" padding="sm" inert>
        <HeatSample />
      </Card.Root>
    );
  }

  if (figure === HELP_FIGURE.gameList) {
    return (
      <Card.Root radius={500} background="subtle" padding="sm" inert>
        <VStack gap="125">
          <HStack gap="075">
            {SAMPLE_STATUS_CHIPS.map((label, index) => (
              <Chip key={label} render={<span />} selected={index === 0}>
                {label}
              </Chip>
            ))}
          </HStack>
          <Card.Root radius={400} padding="sm">
            <HStack align="center" gap="125">
              <span className="size-[34px] flex-none rounded-300 bg-tinted-bg" />
              <VStack className="min-w-0 flex-1">
                <Text typography="subtitle2" weight="extrabold" render={<span />}>
                  물벼락 — 1부
                </Text>
                <Text typography="body4" foreground="hint" render={<span />}>
                  선착순 · 확정 2 · 정원 4
                </Text>
              </VStack>
            </HStack>
          </Card.Root>
        </VStack>
      </Card.Root>
    );
  }

  if (figure === HELP_FIGURE.formFields) {
    return (
      <Card.Root radius={500} background="subtle" padding="sm" inert>
        <VStack gap="125">
          <VStack gap="075">
            <Text typography="body4" weight="extrabold" foreground="hint" render={<span />}>
              게임명
            </Text>
            <TextInput defaultValue="물벼락 — 1부" readOnly aria-label="게임명" />
          </VStack>
          <HStack gap="125">
            <VStack gap="075" className="min-w-0 flex-1">
              <Text typography="body4" weight="extrabold" foreground="hint" render={<span />}>
                룰
              </Text>
              <TextInput defaultValue="크툴루의 부름" readOnly aria-label="룰" />
            </VStack>
            <VStack gap="075" className="min-w-0 flex-1">
              <Text typography="body4" weight="extrabold" foreground="hint" render={<span />}>
                플레이타임
              </Text>
              <TextInput defaultValue="3시간" readOnly aria-label="플레이타임" />
            </VStack>
          </HStack>
        </VStack>
      </Card.Root>
    );
  }

  if (figure === HELP_FIGURE.rosterRows) {
    return (
      <Card.Root radius={500} background="subtle" padding="sm" inert>
        <VStack gap="075">
          <Card.Root radius={400} padding="sm">
            <HStack align="center" gap="125">
              <Avatar name="서리" size="md" />
              <Text typography="body3" weight="bold" render={<span />} className="flex-1">
                서리
              </Text>
              <Badge colorPalette="success">확정</Badge>
            </HStack>
          </Card.Root>
          <Card.Root radius={400} padding="sm">
            <HStack align="center" gap="125">
              <Avatar name="모래" size="md" />
              <Text typography="body3" weight="bold" render={<span />} className="flex-1">
                모래
              </Text>
              <Badge>대기 1번</Badge>
            </HStack>
          </Card.Root>
        </VStack>
      </Card.Root>
    );
  }

  return (
    <HStack gap="100" wrap>
      {LINK_SERVICES.filter((service) => service.key !== "link").map((service) => (
        <span
          key={service.key}
          role="img"
          aria-label={service.label}
          className="flex size-[34px] items-center justify-center rounded-400 border border-gray-200 text-gray-600"
        >
          <BrandMark service={service.key} size={16} />
        </span>
      ))}
    </HStack>
  );
}
