"use client";

import { Button, Field, TextInput, VStack, toast } from "@roll-and-call/ui";

import { MobileActionBar } from "@/shared/ui";

import { useServerInfoForm } from "../model/use-server-info-form";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";
import { MobileSettingsSection } from "./mobile/mobile-settings-section";

interface ServerInfoMobileFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedInviteUrl: string;
  joinUrl: string;
}

export function ServerInfoMobileForm({
  server,
  savedInviteUrl,
  joinUrl,
}: ServerInfoMobileFormProps) {
  const form = useServerInfoForm({ savedInviteUrl });

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
