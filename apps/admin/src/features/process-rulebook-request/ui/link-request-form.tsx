"use client";

import {
  Button,
  Checkbox,
  Dialog,
  HStack,
  RadioCard,
  RadioGroup,
  Text,
  TextInput,
  VStack,
  cn,
  toast,
} from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

import {
  RULEBOOK_KIND_LABEL,
  quoteWithParticle,
  withObjectParticle,
  withSubjectParticle,
  withTopicParticle,
} from "@/shared/lib";
import type { RulebookActionResult, RulebookRequestRow, RulebookRow } from "@/shared/server";
import { UserPreview } from "@/shared/ui";

import { linkRequest } from "../api/link-request";
import { withDirectionParticle } from "../model/with-direction-particle";
import { RequestConflict } from "./request-conflict";

type Conflict = Extract<RulebookActionResult, { ok: false }>["conflict"];

interface LinkRequestFormProps {
  request: RulebookRequestRow;
  rulebooks: RulebookRow[];
  onDone: () => void;
}

export function LinkRequestForm({ request, rulebooks, onDone }: LinkRequestFormProps) {
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(
    () => rulebooks.find((rulebook) => rulebook.label === request.similarTo)?.id ?? "",
  );
  const [addAlias, setAddAlias] = useState(true);
  const [conflict, setConflict] = useState<Conflict | undefined>(undefined);

  const keyword = search.trim().toLowerCase();
  const candidates = keyword
    ? rulebooks.filter((rulebook) =>
        [rulebook.label, rulebook.category, ...rulebook.aliases].some((text) =>
          text.toLowerCase().includes(keyword),
        ),
      )
    : rulebooks;
  const selected = rulebooks.find((rulebook) => rulebook.id === selectedId);
  const conflicted = conflict !== undefined;
  const canConfirm = Boolean(selected) && !pending && !conflicted;
  const requestedName = quoteWithParticle(request.name, withObjectParticle);
  const linkedName = selected ? quoteWithParticle(selected.label, withDirectionParticle) : "…";

  const confirm = () =>
    startTransition(async () => {
      const result = await linkRequest(request.id, { rulebookId: selectedId, addAlias });
      if (!result.ok) {
        setConflict(result.conflict);
        return;
      }
      toast.success(`「${request.name}」 요청을 「${selected!.label}」에 연결했습니다`);
      onDone();
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>기존 룰북에 연결</Dialog.Title>
        <Dialog.Description>
          {withSubjectParticle(request.requesterNickname)} 요청한 {requestedName} 이미 등록된
          룰북으로 처리합니다
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflicted ? <RequestConflict conflict={conflict} /> : null}
          <VStack gap="150" className={cn(conflicted && "pointer-events-none opacity-50")}>
            <VStack gap="075">
              <Text typography="body4" weight="bold" id="link-rulebook-label">
                연결할 룰북
              </Text>
              <HStack align="center" className="relative">
                <Search
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute left-125 text-hint"
                />
                <TextInput
                  type="search"
                  value={search}
                  placeholder="이름, 판본, 카테고리, 다른 이름"
                  aria-label="룰북 검색"
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-400 text-body3"
                />
              </HStack>
              <RadioGroup
                value={selectedId}
                onValueChange={(value) => setSelectedId(value as string)}
                aria-labelledby="link-rulebook-label"
                className="mt-025 flex max-h-[220px] flex-col gap-075 overflow-y-auto"
              >
                {candidates.map((rulebook) => (
                  <RadioCard.Root key={rulebook.id} value={rulebook.id} className="px-150 py-125">
                    <RadioCard.Title>{rulebook.label}</RadioCard.Title>
                    <RadioCard.Description>
                      {rulebook.category} · {RULEBOOK_KIND_LABEL[rulebook.kind]} · 다른 이름{" "}
                      {rulebook.aliases.join(", ") || "—"}
                    </RadioCard.Description>
                    <RadioCard.Indicator />
                  </RadioCard.Root>
                ))}
              </RadioGroup>
              {candidates.length === 0 ? (
                <Text typography="body3" foreground="hint">
                  찾는 룰북이 없어요.
                </Text>
              ) : null}
            </VStack>
            <Checkbox.Field className="items-start">
              <Checkbox.Root checked={addAlias} onCheckedChange={setAddAlias} className="mt-025">
                <Checkbox.Indicator />
              </Checkbox.Root>
              <VStack gap="025">
                <Checkbox.Label>
                  요청한 이름 {requestedName} 이 룰북의 <b>다른 이름</b>에 추가합니다
                </Checkbox.Label>
                <Text typography="body4" foreground="hint">
                  이미 다른 이름에 있으면 추가하지 않습니다
                </Text>
              </VStack>
            </Checkbox.Field>
            <UserPreview title="요청자에게 이렇게 보입니다">
              요청하신 {quoteWithParticle(request.name, withTopicParticle)} 이미 등록된 {linkedName}{" "}
              연결됐어요. 구인을 열 때 이 룰북을 골라 주세요.
            </UserPreview>
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button loading={pending} disabled={!canConfirm} onClick={confirm}>
          연결
        </Button>
      </Dialog.Footer>
    </>
  );
}
