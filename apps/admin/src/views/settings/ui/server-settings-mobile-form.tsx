"use client";

import {
  RANKING_MODE,
  RANKING_MODE_LABEL,
  type RankingMode,
} from "@roll-and-call/database/servers/model";
import {
  Button,
  Field,
  RadioCard,
  RadioGroup,
  Text,
  TextInput,
  VStack,
  toast,
} from "@roll-and-call/ui";

import { MobileActionBar } from "@/shared/ui";

import { useServerSettingsForm } from "../model/use-server-settings-form";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";
import { MobileSettingsSection } from "./mobile/mobile-settings-section";

const MODE_DESCRIPTION: Record<RankingMode, string> = {
  [RANKING_MODE.count]: "참여한 세션이 많은 순서로 순위를 정합니다.",
  [RANKING_MODE.points]:
    "세션과 후기 점수를 더하고 불참 점수를 빼서, 점수가 높은 순서로 순위를 정합니다.",
};

const MODES = [RANKING_MODE.count, RANKING_MODE.points] as const;

interface ServerSettingsMobileFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedInviteUrl: string;
  savedRankingMode: RankingMode;
  joinUrl: string;
}

export function ServerSettingsMobileForm({
  server,
  savedInviteUrl,
  savedRankingMode,
  joinUrl,
}: ServerSettingsMobileFormProps) {
  const form = useServerSettingsForm({ savedInviteUrl, savedRankingMode });
  const rankingChanged = form.rankingMode !== savedRankingMode;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success("가입 링크를 복사했습니다");
    } catch {
      toast.danger("가입 링크를 복사하지 못했습니다");
    }
  };

  return (
    <MobileSettingsFrame active="/settings/server">
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <MobileSettingsSection title="서버 기본 정보">
          <Field.Root
            label="표시 이름"
            htmlFor="mobile-server-name"
            description="아이콘과 표시 이름은 디스코드 서버에서 가져옵니다."
          >
            <TextInput id="mobile-server-name" readOnly value={server.name} />
          </Field.Root>
          <Field.Root
            label="slug"
            htmlFor="mobile-server-slug"
            description="slug를 바꾸려면 개발자에게 문의해 주세요."
          >
            <TextInput id="mobile-server-slug" readOnly value={`/${server.slug}`} />
          </Field.Root>
        </MobileSettingsSection>
        <MobileSettingsSection title="가입 링크">
          <Field.Root label="서버 가입 링크" htmlFor="mobile-server-join-url">
            <VStack gap="075">
              <TextInput id="mobile-server-join-url" readOnly value={joinUrl} />
              <Button
                variant="outline"
                colorPalette="gray"
                onClick={() => void copy()}
                className="min-h-11"
              >
                복사
              </Button>
            </VStack>
          </Field.Root>
          <Field.Root
            label="디스코드 서버 초대 링크"
            htmlFor="mobile-server-invite-url"
            description="비워 두면 서버 멤버가 아닌 사람에게 「서버 운영진에게 초대를 요청해 주세요」라고 표시됩니다."
            error={form.inviteError}
          >
            <TextInput
              id="mobile-server-invite-url"
              placeholder="https://discord.gg/…"
              inputMode="url"
              enterKeyHint="done"
              value={form.inviteUrl}
              invalid={Boolean(form.inviteError)}
              onChange={(event) => form.setInviteUrl(event.target.value)}
            />
          </Field.Root>
        </MobileSettingsSection>
        <MobileSettingsSection title="이 달의 기록 방식">
          <Text typography="body3" foreground="muted" render={<p />}>
            이 서버의 이 달의 기록 순위를 매기는 방식을 정합니다.
          </Text>
          <RadioGroup
            value={form.rankingMode}
            disabled={form.saving}
            aria-label="이 달의 기록 방식"
            onValueChange={(next) => form.setRankingMode(next as RankingMode)}
            className="flex flex-col gap-075"
          >
            {MODES.map((mode) => (
              <RadioCard.Root key={mode} value={mode}>
                <RadioCard.Title>{RANKING_MODE_LABEL[mode]}</RadioCard.Title>
                <RadioCard.Description>{MODE_DESCRIPTION[mode]}</RadioCard.Description>
                <RadioCard.Indicator />
              </RadioCard.Root>
            ))}
          </RadioGroup>
          {rankingChanged ? (
            <Text typography="body3" foreground="muted" render={<p />}>
              [변경 저장]을 누르면 이번 달 순위가 바로 {RANKING_MODE_LABEL[form.rankingMode]}로 다시
              계산됩니다. 이미 확정한 지난달 순위는 바뀌지 않습니다.
            </Text>
          ) : null}
        </MobileSettingsSection>
      </VStack>
      <MobileActionBar>
        <Button
          size="lg"
          loading={form.saving}
          disabled={!form.canSave}
          onClick={form.save}
          className="text-body2"
        >
          변경 저장
        </Button>
      </MobileActionBar>
    </MobileSettingsFrame>
  );
}
