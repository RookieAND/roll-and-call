"use client";

import type { RulebookKind } from "@roll-and-call/database";
import { directionalParticle, objectParticle } from "@roll-and-call/database/notifications/model";
import { AlertDialog, Button, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { RotateCcw, Search } from "lucide-react";
import { useRef, useState } from "react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { KindImpactPage } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, Tag } from "@/shared/ui";

import { loadKindImpact } from "../api/load-kind-impact";
import { KindImpactList } from "./kind-impact-list";

interface KindImpactDialogProps {
  rulebookId: string;
  rulebookLabel: string;
  fromKind: RulebookKind;
  toKind: RulebookKind;
  // 첫 쪽을 받아 오면 열린다. null이면 닫혀 있다.
  initial: KindImpactPage | null;
  pending: boolean;
  networkError: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// 종류를 바꾸면 구인 자격을 잃는 사람을 저장 전에 보인다(D292). 목록은 264px 안에서 스크롤하며 이어서 불러온다.
export function KindImpactDialog({
  rulebookId,
  rulebookLabel,
  fromKind,
  toKind,
  initial,
  pending,
  networkError,
  onConfirm,
  onClose,
}: KindImpactDialogProps) {
  const loading = useRef(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initial);
  const [shownInitial, setShownInitial] = useState(initial);
  if (initial !== shownInitial) {
    setShownInitial(initial);
    setPage(initial);
    setQuery("");
  }
  const fromLabel = RULEBOOK_KIND_LABEL[fromKind];
  const toLabel = RULEBOOK_KIND_LABEL[toKind];

  const search = async (nextQuery: string) => {
    setQuery(nextQuery);
    setPage(await loadKindImpact({ rulebookId, nextKind: toKind, query: nextQuery, cursor: null }));
  };

  // ponytail: 같은 쪽을 두 번 부르지 않게만 막는다. 검색어를 빠르게 바꿀 때 늦게 온 응답이 덮는 경합은 두고, 문제가 되면 요청 번호로 거른다.
  const loadMore = async () => {
    if (!page?.nextCursor || loading.current) return;
    loading.current = true;
    const next = await loadKindImpact({
      rulebookId,
      nextKind: toKind,
      query,
      cursor: page.nextCursor,
    }).finally(() => {
      loading.current = false;
    });
    setPage({ ...next, rows: [...page.rows, ...next.rows] });
  };

  return (
    <AlertDialog.Root
      open={!isNull(initial)}
      onOpenChange={(nextOpen) => nextOpen || pending || onClose()}
    >
      <AlertDialog.Popup className="max-w-[560px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>종류를 바꿀까요?</AlertDialog.Title>
          <AlertDialog.Description>
            {`${rulebookLabel}${objectParticle(rulebookLabel)} ${fromLabel}에서 ${toLabel}${directionalParticle(toLabel)} 바꿉니다`}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="125">
            {networkError ? <ActionNetworkError /> : null}
            <HStack align="center" gap="075">
              <Text typography="body4" weight="bold">
                구인 자격을 잃는 사람
              </Text>
              <Tag>{`${page?.total ?? 0}명`}</Tag>
            </HStack>
            <HStack align="center" className="relative">
              <Search
                size={14}
                aria-hidden
                className="pointer-events-none absolute left-125 text-hint"
              />
              <TextInput
                type="search"
                value={query}
                placeholder="닉네임 검색"
                aria-label="닉네임 검색"
                onChange={(event) => void search(event.target.value)}
                className="pl-400 text-body3"
              />
            </HStack>
            <KindImpactList
              rows={page?.rows ?? []}
              hasMore={Boolean(page?.nextCursor)}
              onLoadMore={() => void loadMore()}
            />
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button colorPalette="danger" loading={pending} onClick={onConfirm}>
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "종류 바꾸기"}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
