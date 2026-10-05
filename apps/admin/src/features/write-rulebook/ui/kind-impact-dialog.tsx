"use client";

import type { RulebookKind } from "@roll-and-call/database";
import { directionalParticle, objectParticle } from "@roll-and-call/database/notifications/model";
import { AlertDialog, Button, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { KindImpactPage } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, RetryableLabel, Tag } from "@/shared/ui";

import { loadKindImpact } from "../api/load-kind-impact";
import { KindImpactList } from "./kind-impact-list";

const SEARCH_DELAY = 250;

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
  const requestId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initial);
  const [shownInitial, setShownInitial] = useState(initial);
  if (initial !== shownInitial) {
    setShownInitial(initial);
    setPage(initial);
    setQuery("");
    setLoadFailed(false);
  }
  const fromLabel = RULEBOOK_KIND_LABEL[fromKind];
  const toLabel = RULEBOOK_KIND_LABEL[toKind];

  useEffect(() => () => clearTimeout(timer.current), []);

  const fetchPage = async (nextQuery: string, cursor: string | null) => {
    try {
      const result = await loadKindImpact({
        rulebookId,
        nextKind: toKind,
        query: nextQuery,
        cursor,
      });
      setLoadFailed(false);
      return result;
    } catch {
      setLoadFailed(true);
      return null;
    }
  };

  const search = (nextQuery: string) => {
    setQuery(nextQuery);
    clearTimeout(timer.current);
    requestId.current += 1;
    const current = requestId.current;
    timer.current = setTimeout(async () => {
      const result = await fetchPage(nextQuery, null);
      if (result && current === requestId.current) setPage(result);
    }, SEARCH_DELAY);
  };

  const loadMore = async () => {
    if (!page?.nextCursor || loading.current) return;
    loading.current = true;
    const current = requestId.current;
    const next = await fetchPage(query, page.nextCursor).finally(() => {
      loading.current = false;
    });
    if (next && current === requestId.current)
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
        <AlertDialog.Body>
          <VStack gap="125">
            {networkError || loadFailed ? <ActionNetworkError /> : null}
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
                onChange={(event) => search(event.target.value)}
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
            <RetryableLabel failed={networkError}>{"종류 바꾸기"}</RetryableLabel>
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
