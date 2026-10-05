"use client";

import { AlertDialog, Button, Callout, Text, VStack } from "@roll-and-call/ui";
import { sumBy } from "es-toolkit";

import { withObjectParticle } from "@/shared/lib";
import type { RulebookImpactCase } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, RetryableLabel } from "@/shared/ui";

import { ImpactList } from "./impact-list";

interface ImpactDialogProps {
  rulebookLabel: string;
  cases: RulebookImpactCase[];
  pending: boolean;
  networkError: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ImpactDialog({
  rulebookLabel,
  cases,
  pending,
  networkError,
  onConfirm,
  onClose,
}: ImpactDialogProps) {
  const [first] = cases;
  const unlink = first?.kind === "unlink";
  const title = unlink ? "포함하는 구판 연결을 해제할까요?" : "인증 정책을 인증 필요로 바꿀까요?";
  const description = unlink
    ? `${rulebookLabel}에서 ${first.lostName} 연결을 해제합니다.`
    : `${withObjectParticle(rulebookLabel)} 인증이 필요한 룰북으로 바꿉니다.`;
  const loserCount = sumBy(cases, (item) => item.losers.length);
  const gameCount = sumBy(cases, (item) => item.games.length);
  return (
    <AlertDialog.Root
      open={cases.length > 0}
      onOpenChange={(nextOpen) => nextOpen || pending || onClose()}
    >
      <AlertDialog.Popup className="max-w-[600px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <Callout.Root colorPalette="danger">
              <Callout.Icon />
              <Callout.Description>
                {loserCount}명이 GM 자격을 잃고, 진행 중인 구인 {gameCount}개가 영향을 받습니다.
              </Callout.Description>
            </Callout.Root>
            {cases.map((item) => (
              <VStack key={item.kind} gap="150">
                {item.losers.length > 0 ? (
                  <ImpactList
                    label={`${item.lostName} GM 자격을 잃는 사람`}
                    rows={item.losers.map((loser) => ({
                      id: loser.userId,
                      title: loser.nickname,
                      meta: loser.meta,
                    }))}
                  />
                ) : null}
                {item.games.length > 0 ? (
                  <VStack gap="075">
                    <ImpactList label="영향을 받는 진행 중 구인" rows={item.games} />
                    <Text typography="body4" foreground="hint">
                      이미 열린 구인은 그대로 진행되고, 새 {item.lostName} 구인만 열 수 없게 됩니다.
                    </Text>
                  </VStack>
                ) : null}
              </VStack>
            ))}
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            뒤로
          </AlertDialog.Close>
          <Button colorPalette="danger" loading={pending} onClick={onConfirm}>
            <RetryableLabel failed={networkError}>{"변경 확정"}</RetryableLabel>
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
