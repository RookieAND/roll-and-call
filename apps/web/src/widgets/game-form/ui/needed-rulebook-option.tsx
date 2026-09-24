import { Button, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { CERT_STATE, RulebookOption, type MyRulebook } from "@/entities/rulebook";

import { neededRulebookReason } from "../model/needed-rulebook-reason";

interface NeededRulebookOptionProps {
  rulebook: MyRulebook;
  pickable: boolean;
  enforcementDate: Date | null;
  selected: boolean;
  open: boolean;
  onPick: () => void;
  onToggle: () => void;
}

// 인증이 필요한 룰북 한 줄. 안내 기간에는 고를 수 있고, 적용일이 지나면 자물쇠를 달고 누르면 인증 안내를 펼친다.
export function NeededRulebookOption({
  rulebook,
  pickable,
  enforcementDate,
  selected,
  open,
  onPick,
  onToggle,
}: NeededRulebookOptionProps) {
  const pending = rulebook.state === CERT_STATE.pending;
  const reasonLabel = neededRulebookReason(pickable, pending, enforcementDate);
  const reason = reasonLabel && (
    <Text typography="body4" weight="bold" foreground="hint" className="flex-none">
      {reasonLabel}
    </Text>
  );

  if (pickable) {
    return (
      <RulebookOption
        name={rulebook.name}
        edition={rulebook.edition}
        selected={selected}
        reason={reason}
        onClick={onPick}
      />
    );
  }

  return (
    <VStack className={open ? "rounded-400 bg-gray-50" : undefined}>
      <RulebookOption
        name={rulebook.name}
        edition={rulebook.edition}
        locked
        reason={reason}
        onClick={onToggle}
      />
      {open && (
        <VStack gap="125" className="pr-150 pb-150 pl-500">
          {pending ? (
            <Text typography="body3" foreground="muted" render={<p />}>
              확인이 끝나면 고를 수 있습니다.
            </Text>
          ) : (
            <>
              <Text
                typography="body3"
                foreground="muted"
                render={<p />}
                className="[text-wrap:pretty]"
              >
                <Text weight="bold" foreground="normal">
                  이 룰북은 인증이 필요합니다.
                </Text>
                <br />
                인증되면 이 룰북으로 구인을 열 수 있습니다.
              </Text>
              <Button
                render={<Link href={`/me/rulebooks/apply?rulebook=${rulebook.id}`} />}
                variant="tinted"
                className="w-full"
              >
                인증 신청하기
              </Button>
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
}
