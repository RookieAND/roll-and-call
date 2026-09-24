import { Button, Callout, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { CERT_STATE, isCertEnforced, type MyRulebooks } from "@/entities/rulebook";
import { formatDate } from "@/shared/lib";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MyPageRulebookRow } from "./my-page-rulebook-row";
import { RulebookRowsMore } from "./rulebook-rows-more";

const SHOWN_STATES = [CERT_STATE.certified, CERT_STATE.pending, CERT_STATE.rejected] as const;
const PREVIEW_ROWS = 3;

interface MyPageRulebooksProps {
  rulebooks: MyRulebooks;
}

// 할 일과 링크 사이의 인증한 룰북 블록. 안내 기간 띠는 다른 화면에선 앱 상단 몫이라 여기서는 블록 안에 한 번만 둔다.
export function MyPageRulebooks({
  rulebooks: { rulebooks, enforcementDate },
}: MyPageRulebooksProps) {
  const rows = SHOWN_STATES.flatMap((state) =>
    rulebooks.filter((rulebook) => rulebook.state === state),
  );
  const freeCount = rulebooks.filter((rulebook) => !rulebook.certRequired).length;
  const showBand = enforcementDate !== null && !isCertEnforced(enforcementDate);

  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          인증한 룰북
        </Text>
        {rows.length > 0 && (
          <Button
            render={<Link href="/me/rulebooks" />}
            variant="ghost"
            colorPalette="primary"
            size="sm"
            className="-mr-100"
          >
            전체 보기
            <ChevronRight size={14} aria-hidden />
          </Button>
        )}
      </HStack>

      {showBand && (
        <Callout.Root colorPalette="notice" role="note" className="border-notice-border">
          <Callout.Icon>
            <CalendarDays size={16} />
          </Callout.Icon>
          <Callout.Description className="font-semibold">
            {formatDate(enforcementDate)}부터 구인을 열려면 룰북 인증이 필요합니다.
            <br />
            미리 인증해 두세요.
          </Callout.Description>
        </Callout.Root>
      )}

      {rows.length > 0 ? (
        <>
          <div className={`${MY_PAGE_GROUP_CLASS} [&>a:first-child]:border-t-0`}>
            {rows.slice(0, PREVIEW_ROWS).map((rulebook) => (
              <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
            ))}
            {rows.length > PREVIEW_ROWS && (
              <RulebookRowsMore count={rows.length - PREVIEW_ROWS}>
                {rows.slice(PREVIEW_ROWS).map((rulebook) => (
                  <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
                ))}
              </RulebookRowsMore>
            )}
          </div>
          <Button render={<Link href="/me/rulebooks/apply" />} variant="outline" className="w-full">
            <Plus size={15} strokeWidth={2.2} aria-hidden />
            룰북 인증하기
          </Button>
        </>
      ) : (
        <VStack
          gap="175"
          className="rounded-600 border border-dashed border-gray-300 px-200 py-225"
        >
          <Text typography="body3" foreground="muted" render={<p />} className="[text-wrap:pretty]">
            직접 세션을 열고 싶다면 가지고 있는 룰북을 인증해 주세요.
            <br />
            인증된 룰북으로 구인을 열 수 있습니다.
          </Text>
          <Button render={<Link href="/me/rulebooks/apply" />} variant="tinted" className="w-full">
            룰북 인증하기
          </Button>
        </VStack>
      )}

      {freeCount > 0 && (
        <Link
          href="/me/rulebooks#free"
          className="flex min-h-11 items-center gap-100 px-025 text-gray-600 transition-colors hover:text-gray-900"
        >
          <Text typography="body3" foreground="inherit" className="flex-1">
            인증 없이 열 수 있는 룰{" "}
            <Text weight="bold" foreground="normal" numeric>
              {freeCount}개
            </Text>
          </Text>
          <ChevronRight size={16} aria-hidden className="text-hint" />
        </Link>
      )}
    </VStack>
  );
}
