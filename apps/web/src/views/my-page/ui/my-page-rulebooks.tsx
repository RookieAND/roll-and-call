import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import { CERT_STATE, type MyRulebooks } from "@/entities/rulebook";
import { ServerLink } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MyPageRulebookRow } from "./my-page-rulebook-row";
import { RulebookListSheet } from "./rulebook-list-sheet";

const SHOWN_STATES = [CERT_STATE.rejected, CERT_STATE.pending, CERT_STATE.certified] as const;
const PREVIEW_ROWS = 3;

interface MyPageRulebooksProps {
  rulebooks: MyRulebooks;
}

export function MyPageRulebooks({ rulebooks: { rulebooks } }: MyPageRulebooksProps) {
  const rows = SHOWN_STATES.flatMap((state) =>
    rulebooks.filter((rulebook) => rulebook.state === state),
  );
  const certifiedCount = rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.certified,
  ).length;

  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          인증한 룰북
        </Text>
        <Text typography="body4" foreground="hint" numeric>
          {certifiedCount}
        </Text>
      </HStack>

      {rows.length > 0 ? (
        <>
          <div className={`${MY_PAGE_GROUP_CLASS} [&>a:first-child]:border-t-0`}>
            {rows.slice(0, PREVIEW_ROWS).map((rulebook) => (
              <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
            ))}
            {rows.length > PREVIEW_ROWS && (
              <RulebookListSheet count={rows.length}>
                {rows.map((rulebook) => (
                  <MyPageRulebookRow key={rulebook.id} rulebook={rulebook} />
                ))}
              </RulebookListSheet>
            )}
          </div>
          <Button
            render={<ServerLink path={"/me/rulebooks/apply"} />}
            variant="outline"
            className="w-full"
          >
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
          <Button
            render={<ServerLink path={"/me/rulebooks/apply"} />}
            variant="tinted"
            className="w-full"
          >
            룰북 인증하기
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
