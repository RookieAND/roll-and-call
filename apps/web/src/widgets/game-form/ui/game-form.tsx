"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Container,
  Field,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  cn,
} from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import type { Game } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
import { toast, AppBar, DatePicker, DateTimePicker } from "@/shared/ui";
import { SCHEDULE_MODE } from "@/entities/game";
import { gameFormSchema, type GameFormValues, ThumbnailUpload } from "@/features/manage-game";
type Props = {
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
  // 시안 3a: 등록은 2-Step 위저드, 수정(3b)은 단일 페이지.
  wizard?: boolean;
};

// Step 1(게임 자체, 변하지 않는 정보) 필드. "다음" 전에 이 필드들만 검증한다.
const STEP1_FIELDS = [
  "title",
  "rule",
  "synopsis",
  "playTime",
  "thumbnailUrl",
] as const satisfies readonly (keyof GameFormValues)[];

function toLocalInput(value: Date | string) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function parsePlayTime(value?: string | null) {
  return {
    hours: value?.match(/(\d+)\s*시간/)?.[1] ?? "",
    minutes: value?.match(/(\d+)\s*분/)?.[1] ?? "",
  };
}

function formatPlayTime(hours: string, minutes: string) {
  const parts = [];
  if (hours) parts.push(`${hours}시간`);
  if (minutes && minutes !== "0") parts.push(`${minutes}분`);
  return parts.join(" ");
}

function scrollToField(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const SCHEDULE_MODE_OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  wizard = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const initialPlayTime = defaultGame?.playTime
    ? parsePlayTime(defaultGame.playTime)
    : { hours: "3", minutes: "0" };
  const [ptHours, setPtHours] = useState(initialPlayTime.hours);
  const [ptMinutes, setPtMinutes] = useState(initialPlayTime.minutes);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    trigger,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: defaultGame?.title ?? "",
      rule: defaultGame?.rule ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      playTime:
        defaultGame?.playTime ?? formatPlayTime(initialPlayTime.hours, initialPlayTime.minutes),
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toLocalInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt ? toLocalInput(defaultGame.confirmedAt) : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
      thumbnailUrl: defaultGame?.thumbnailUrl ?? "",
    },
  });

  const mode = watch("scheduleMode");
  const thumbnailUrl = watch("thumbnailUrl");
  const rangeStart = watch("rangeStart");
  const rangeEnd = watch("rangeEnd");

  function syncPlayTime(hours: string, minutes: string) {
    setValue("playTime", formatPlayTime(hours, minutes), { shouldDirty: true });
  }

  function submit(values: GameFormValues) {
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result?.error) {
        setError("root", { message: result.error });
        return;
      }
      toast.success(successMessage);
      if (result?.redirect) router.push(result.redirect);
    });
  }

  // 시안 3b: scroll to the first field with an error. 위저드면 해당 스텝으로 먼저 이동.
  function onInvalid(errs: FieldErrors<GameFormValues>) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    if (wizard && (STEP1_FIELDS as readonly string[]).includes(first)) setStep(1);
    setTimeout(() => scrollToField(first), 0);
  }

  async function goNext() {
    const ok = await trigger(STEP1_FIELDS);
    if (!ok) {
      setTimeout(() => scrollToField(STEP1_FIELDS[0]), 0);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0 });
  }

  const step1Fields = (
    <>
      <Field label="게임명" htmlFor="title" required error={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="예: 마지막 열차"
          maxLength={100}
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field>
      <Field label="룰" htmlFor="rule" required error={errors.rule?.message}>
        <TextInput
          id="rule"
          placeholder="예: 크툴루의 부름 7판, 던전월드"
          maxLength={100}
          invalid={!!errors.rule}
          {...register("rule")}
        />
      </Field>
      <Field label="시놉시스" htmlFor="synopsis" error={errors.synopsis?.message}>
        <Textarea id="synopsis" rows={4} maxLength={2000} {...register("synopsis")} />
      </Field>
      <Field label="플레이타임" htmlFor="playTime" error={errors.playTime?.message}>
        <HStack gap={2} className="w-full items-center">
          <TextInput
            id="playTime"
            type="number"
            min={1}
            inputMode="numeric"
            aria-label="시간"
            className="min-w-0 flex-1"
            value={ptHours}
            onChange={(e) => {
              setPtHours(e.target.value);
              syncPlayTime(e.target.value, ptMinutes);
            }}
          />
          <Text foreground="muted" className="shrink-0">
            시간
          </Text>
          <TextInput
            type="number"
            min={0}
            max={59}
            inputMode="numeric"
            aria-label="분"
            className="min-w-0 flex-1"
            value={ptMinutes}
            onChange={(e) => {
              setPtMinutes(e.target.value);
              syncPlayTime(ptHours, e.target.value);
            }}
          />
          <Text foreground="muted" className="shrink-0">
            분
          </Text>
        </HStack>
      </Field>
      <ThumbnailUpload value={thumbnailUrl} onChange={(url) => setValue("thumbnailUrl", url)} />
    </>
  );

  const step2Fields = (
    <>
      <div className="w-1/2">
        <Field label="최대 인원" htmlFor="maxPlayers" required error={errors.maxPlayers?.message}>
          <TextInput
            id="maxPlayers"
            type="number"
            min={1}
            max={20}
            invalid={!!errors.maxPlayers}
            {...register("maxPlayers")}
          />
        </Field>
      </div>
      <Field label="일정 방식">
        <div className="grid grid-cols-2 gap-2">
          {SCHEDULE_MODE_OPTIONS.map((m) => {
            const active = mode === m.value;
            return (
              <Chip
                key={m.value}
                shape="block"
                selected={active}
                onClick={() => setValue("scheduleMode", m.value, { shouldDirty: true })}
              >
                {m.label}
              </Chip>
            );
          })}
        </div>
      </Field>
      <Text typography="body4" foreground="muted" className="-mt-2">
        {mode === SCHEDULE_MODE.fixed
          ? "정해진 일시로 바로 모집합니다. 일정 조율 화면은 생기지 않습니다."
          : "참여자가 가능 시간을 입력하면 GM이 겹치는 시간대 중 하나를 확정합니다."}
      </Text>
      <div className="flex flex-col gap-4 rounded-xl border border-[#E7E9FA] bg-[#FAFAFF] p-3.5">
        {mode === SCHEDULE_MODE.fixed ? (
          <Field label="세션 일시" htmlFor="confirmedAt" error={errors.confirmedAt?.message}>
            <Controller
              name="confirmedAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  id="confirmedAt"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.confirmedAt}
                />
              )}
            />
          </Field>
        ) : (
          <>
            <div>
              <Text typography="subtitle1" className="block">
                세션 예정일
              </Text>
              <Text typography="body4" foreground="muted" className="mt-0.5 block">
                언제까지 세션을 끝내고 싶은지, 며칠짜리 세션인지 알려주는 날짜예요.
              </Text>
            </div>
            <Field label="시작일" htmlFor="rangeStart" error={errors.rangeStart?.message}>
              <Controller
                name="rangeStart"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="rangeStart"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.rangeStart}
                    max={rangeEnd || undefined}
                  />
                )}
              />
            </Field>
            <Field label="종료일" htmlFor="rangeEnd" error={errors.rangeEnd?.message}>
              <Controller
                name="rangeEnd"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="rangeEnd"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.rangeEnd}
                    min={rangeStart ? addDays(rangeStart, 1) : undefined}
                    max={rangeStart ? addDays(rangeStart, 14) : undefined}
                  />
                )}
              />
            </Field>
          </>
        )}
      </div>
      <Field label="모집 마감 기한" htmlFor="endDate" required error={errors.endDate?.message}>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              id="endDate"
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors.endDate}
              min={toLocalInput(new Date()).slice(0, 10)}
            />
          )}
        />
      </Field>
    </>
  );

  const rootError = errors.root && (
    <Text typography="body2" foreground="danger">
      {errors.root.message}
    </Text>
  );

  // 수정(3b): 단일 페이지. 앱바·컨테이너는 뷰가 소유한다.
  if (!wizard) {
    return (
      <form onSubmit={handleSubmit(submit, onInvalid)}>
        <VStack gap={4}>
          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-4 border-0 p-0", pending && "opacity-45")}
          >
            {step1Fields}
            {step2Fields}
          </fieldset>
          {rootError}
          <Button type="submit" loading={pending} size="lg" className="h-[50px] w-full">
            {pending ? "저장 중…" : submitLabel}
          </Button>
        </VStack>
      </form>
    );
  }

  // 등록(3a): 2-Step 위저드. 단계에 따라 앱바 제목·뒤로가기·진행바가 바뀌므로
  // 폼이 앱바까지 소유한다(뷰는 CreateGameForm만 렌더).
  const stepTitle = step === 1 ? "게임 기본 설정" : "인원 · 일정 · 마감";
  const summaryLine = [watch("rule"), watch("playTime")].filter(Boolean).join(" · ");

  return (
    <form
      onSubmit={handleSubmit(submit, onInvalid)}
      className="flex min-h-[calc(100dvh-58px)] flex-col"
    >
      <AppBar
        title={stepTitle}
        back={step === 1 ? "/games" : undefined}
        onBack={step === 2 ? () => setStep(1) : undefined}
        action={
          <Text typography="code2" foreground="hint" className="tabular-nums">
            {step} / 2
          </Text>
        }
      />
      <div className="flex gap-1.5 px-4 pt-2.5">
        <span className="h-1 flex-1 rounded-full bg-primary-600" />
        <span
          className={cn("h-1 flex-1 rounded-full", step === 2 ? "bg-primary-600" : "bg-[#EAEAF0]")}
        />
      </div>
      <Container size="md" className="flex-1">
        <VStack gap={6} className="py-6">
          <fieldset
            disabled={pending}
            className={cn("m-0 flex flex-col gap-4 border-0 p-0", pending && "opacity-45")}
          >
            {step === 1 ? (
              step1Fields
            ) : (
              <>
                <div className="rounded-xl bg-gray-50 px-3.5 py-3">
                  <Text typography="subtitle1" className="block truncate">
                    {watch("title") || "제목 미입력"}
                  </Text>
                  {summaryLine && (
                    <Text typography="body4" foreground="muted" className="mt-0.5 block truncate">
                      {summaryLine}
                    </Text>
                  )}
                </div>
                {step2Fields}
              </>
            )}
          </fieldset>
        </VStack>
      </Container>

      {/* CTA를 BottomNav(높이 58px) 바로 위에 sticky로 고정한다. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="py-3">
          <VStack gap={3}>
            {step === 2 && rootError}
            {step === 1 ? (
              <Button type="button" onClick={goNext} size="lg" className="h-[50px] w-full">
                다음
              </Button>
            ) : (
              <HStack gap={2}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  size="lg"
                  className="h-[50px] w-[104px]"
                >
                  이전
                </Button>
                <Button type="submit" loading={pending} size="lg" className="h-[50px] flex-1">
                  {pending ? "저장 중…" : submitLabel}
                </Button>
              </HStack>
            )}
          </VStack>
        </Container>
      </div>
    </form>
  );
}
