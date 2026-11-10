import { Button, Callout, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Info, Plus } from "lucide-react";

import { CERT_STATE, isCertEnforced, type MyRulebooks } from "@/entities/rulebook";
import { formatDate } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { MyPageRulebookRow } from "./my-page-rulebook-row";
import { RulebookListSheet } from "./rulebook-list-sheet";

const SHOWN_STATES = [CERT_STATE.rejected, CERT_STATE.pending, CERT_STATE.certified] as const;
const PREVIEW_ROWS = 3;

interface MyPageRulebooksProps {
  rulebooks: MyRulebooks;
}

export function MyPageRulebooks({
  rulebooks: { rulebooks, enforcementDate },
}: MyPageRulebooksProps) {
  const rows = SHOWN_STATES.flatMap((state) =>
    rulebooks.filter((rulebook) => rulebook.state === state),
  );
  const certifiedRows = rows.filter((rulebook) => rulebook.state === CERT_STATE.certified);
  // 시안: 제목 옆 수와 미리 보기는 인증된 룰북이고, 반려·확인 중은 전체 보기 시트에서 함께 본다.
  const previewSource = certifiedRows.length > 0 ? certifiedRows : rows;
  const previewRows = previewSource.slice(0, PREVIEW_ROWS);
  const showBand = Boolean(enforcementDate) && !isCertEnforced(enforcementDate);

  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          인증한 룰북
        </Text>
      </HStack>

      {showBand && (
        <Callout.Root colorPalette="warning" role="note">
          <Callout.Icon>
            <Info size={14} strokeWidth={2.2} />
          </Callout.Icon>
          <Callout.Description>
            {formatDate(enforcementDate!)}부터 구인을 열려면 룰북 인증이 필요합니다.
            <br />
            미리 인증해 두세요.
          </Callout.Description>
        </Callout.Root>
      )}

      {rows.length > 0 ? (
        <>
          <Card.Root padding="none" radius={600} className="overflow-hidden">
            {previewRows.map((rulebook) => (
              <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
            ))}
            {rows.length > previewRows.length && (
              <RulebookListSheet count={rows.length}>
                {rows.map((rulebook) => (
                  <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
                ))}
              </RulebookListSheet>
            )}
          </Card.Root>
          <Button
            render={<ServerLink path={"/me/rulebooks/apply"} />}
            variant="outline"
            size="md"
            className="w-full"
          >
            <Plus size={15} strokeWidth={2.2} aria-hidden />
            룰북 인증하기
          </Button>
        </>
      ) : (
        <Card.Root
          padding="none"
          radius={600}
          className="flex flex-col gap-175 border-dashed border-gray-300 px-200 py-225"
        >
          <div className="[text-wrap:pretty]">
            <Text typography="body3" foreground="muted">
              직접 세션을 열고 싶다면 가지고 있는 룰북을 인증해 주세요.
              <br />
              인증된 룰북으로 구인을 열 수 있습니다.
            </Text>
          </div>
          <Button
            render={<ServerLink path={"/me/rulebooks/apply"} />}
            variant="tinted"
            size="md"
            className="w-full"
          >
            룰북 인증하기
          </Button>
        </Card.Root>
      )}
    </VStack>
  );
}
