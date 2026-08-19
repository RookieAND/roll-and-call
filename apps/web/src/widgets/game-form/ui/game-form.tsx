"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Field,
  Text,
  TextInput,
  Textarea,
  VStack,
  cn,
} from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Controller,
  useForm,
  type FieldErrors,
} from "react-hook-form";
import type { Game } from "@/shared/api/db";
import { toast } from "@/shared/lib/toast";
import { DatePicker } from "@/shared/ui/date-picker";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import {
  gameFormSchema,
  type GameFormState,
  type GameFormValues,
  SCHEDULE_MODE,
} from "@/entities/game";
import { ThumbnailUpload } from "@/features/game";

type Props = {
  onSubmit: (values: GameFormValues) => Promise<GameFormState | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
};

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

const SCHEDULE_MODE_OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: defaultGame?.title ?? "",
      rule: defaultGame?.rule ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      playTime: defaultGame?.playTime ?? "",
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toLocalInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt
        ? toLocalInput(defaultGame.confirmedAt)
        : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
      thumbnailUrl: defaultGame?.thumbnailUrl ?? "",
    },
  });

  const mode = watch("scheduleMode");
  const thumbnailUrl = watch("thumbnailUrl");
  const rangeStart = watch("rangeStart");
  const rangeEnd = watch("rangeEnd");

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

  // 시안 3b: scroll to the first field with an error.
  function onInvalid(errs: FieldErrors<GameFormValues>) {
    const first = Object.keys(errs)[0];
    if (first) {
      document
        .getElementById(first)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit, onInvalid)}>
      <VStack gap={4}>
        <fieldset
          disabled={pending}
          className={cn(
            "m-0 flex flex-col gap-4 border-0 p-0",
            pending && "opacity-45",
          )}
        >
          <Field label="게임명" htmlFor="title" required error={errors.title?.message}>
            <TextInput
              id="title"
              placeholder="예: 마지막 열차"
              invalid={!!errors.title}
              {...register("title")}
            />
          </Field>
          <Field label="룰" htmlFor="rule" required error={errors.rule?.message}>
            <TextInput
              id="rule"
              placeholder="예: 크툴루의 부름 7판, 던전월드"
              invalid={!!errors.rule}
              {...register("rule")}
            />
          </Field>
          <ThumbnailUpload
            value={thumbnailUrl}
            onChange={(url) => setValue("thumbnailUrl", url)}
          />
          <Field label="시놉시스" htmlFor="synopsis" error={errors.synopsis?.message}>
            <Textarea id="synopsis" rows={4} {...register("synopsis")} />
          </Field>
          <Field
            label="모집 마감 기한"
            htmlFor="endDate"
            required
            error={errors.endDate?.message}
          >
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  id="endDate"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.endDate}
                />
              )}
            />
          </Field>
          <div className="flex gap-2.5">
            <Field
              label="플레이타임"
              htmlFor="playTime"
              className="flex-1"
              error={errors.playTime?.message}
            >
              <TextInput
                id="playTime"
                placeholder="예: 약 4시간"
                {...register("playTime")}
              />
            </Field>
            <Field
              label="최대 인원"
              htmlFor="maxPlayers"
              required
              className="flex-1"
              error={errors.maxPlayers?.message}
            >
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
                    onClick={() =>
                      setValue("scheduleMode", m.value, { shouldDirty: true })
                    }
                  >
                    {m.label}
                  </Chip>
                );
              })}
            </div>
          </Field>
          <Text size="xs" color="muted" className="-mt-2">
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
                  <Text size="sm" weight="bold" className="block">
                    세션 예정일
                  </Text>
                  <Text size="xs" color="muted" className="mt-0.5 block">
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
        </fieldset>
        {errors.root && (
          <Text size="sm" color="danger">
            {errors.root.message}
          </Text>
        )}
        <Button
          type="submit"
          loading={pending}
          size="lg"
          className="h-[50px] w-full"
        >
          {pending ? "저장 중…" : submitLabel}
        </Button>
      </VStack>
    </form>
  );
}
