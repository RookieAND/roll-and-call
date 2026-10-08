import { Badge, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { getCurrentServer, getCurrentSessionUser, getProfile } from "@/shared/server";
import { ServerLink } from "@/shared/ui";
import { EntrySheet, ServerStage } from "@/widgets/server-entry";

import { WELCOME_EMBLEM_MARK } from "../model/welcome-emblem-mark";
import { WelcomeSuffixNotice } from "./welcome-suffix-notice";
import { WelcomeUsernameForm } from "./welcome-username-form";

interface ServerWelcomeViewProps {
  next: string;
}

// (member) 레이아웃을 지나 왔으니 로그인한 멤버다.
export async function ServerWelcomeView({ next }: ServerWelcomeViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const profile = user ? await getProfile(server.id, user.id) : undefined;
  const suffixBase = profile?.nicknameSuffixBase;

  return (
    <ServerStage
      name={server.name}
      icon={server.icon}
      mark={WELCOME_EMBLEM_MARK}
      sheet={
        <EntrySheet>
          {suffixBase && (
            <WelcomeSuffixNotice suffixBase={suffixBase} rejoined={!isNull(profile.rejoinedAt)} />
          )}
          <WelcomeUsernameForm
            serverName={server.name}
            defaultUsername={profile?.username ?? ""}
            next={next}
          />
        </EntrySheet>
      }
    >
      <VStack align="center" gap="125" className="text-center">
        <Badge colorPalette="success">가입 완료</Badge>
        <Text
          typography="heading1"
          render={<h1 />}
          className="text-[length:26px] leading-[1.3] tracking-[-0.04em] text-pretty"
        >
          {server.name}에 오신 것을
          <br />
          환영합니다
        </Text>
        <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
          닉네임만 확인하면 바로 시작할 수 있습니다.
          <br />
          나머지는{" "}
          <ServerLink path="/me/edit" className="underline">
            마이페이지
          </ServerLink>
          에서 채울 수 있습니다.
        </Text>
      </VStack>
    </ServerStage>
  );
}
