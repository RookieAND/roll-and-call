"use client";

import { useActionState, useState } from "react";
import { VStack } from "@trpg/ui";
import type { Game } from "@/shared/api/db";
import type { GameFormState } from "../model/schema";

type Props = {
  action: (prev: GameFormState, formData: FormData) => Promise<GameFormState>;
  defaultGame?: Game;
  submitLabel: string;
};

function toLocalInput(value: Date | string) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputClass = "rounded-md border border-gray-300 px-3 py-2";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function GameForm({ action, defaultGame, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [mode, setMode] = useState<"fixed" | "coordinate">(
    defaultGame?.scheduleMode ?? "coordinate",
  );

  return (
    <form action={formAction}>
      <VStack gap={4}>
        <Field label="게임명">
          <input
            name="title"
            defaultValue={defaultGame?.title}
            required
            className={inputClass}
          />
        </Field>
        <Field label="룰">
          <input
            name="rule"
            defaultValue={defaultGame?.rule}
            required
            placeholder="예: CoC 7판, DnD 5e"
            className={inputClass}
          />
        </Field>
        <Field label="시놉시스">
          <textarea
            name="synopsis"
            defaultValue={defaultGame?.synopsis ?? ""}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="플레이타임">
          <input
            name="playTime"
            defaultValue={defaultGame?.playTime ?? ""}
            placeholder="예: 3시간, 다음날 새벽까지"
            className={inputClass}
          />
        </Field>
        <Field label="최대 인원 (KP 제외)">
          <input
            name="maxPlayers"
            type="number"
            min={1}
            max={20}
            defaultValue={defaultGame?.maxPlayers ?? 4}
            required
            className={inputClass}
          />
        </Field>
        <Field label="일정 방식">
          <select
            name="scheduleMode"
            value={mode}
            onChange={(e) => setMode(e.target.value as "fixed" | "coordinate")}
            className={inputClass}
          >
            <option value="coordinate">범위 조율 (When2Meet)</option>
            <option value="fixed">일시 직접 지정</option>
          </select>
        </Field>
        <Field label="모집 마감 기한">
          <input
            name="endDate"
            type="datetime-local"
            defaultValue={
              defaultGame?.endDate ? toLocalInput(defaultGame.endDate) : ""
            }
            required
            className={inputClass}
          />
        </Field>
        {mode === "fixed" ? (
          <Field label="세션 일시">
            <input
              name="confirmedAt"
              type="datetime-local"
              defaultValue={
                defaultGame?.confirmedAt
                  ? toLocalInput(defaultGame.confirmedAt)
                  : ""
              }
              className={inputClass}
            />
          </Field>
        ) : (
          <>
            <Field label="조율 시작일">
              <input
                name="rangeStart"
                type="date"
                defaultValue={defaultGame?.rangeStart ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="조율 종료일">
              <input
                name="rangeEnd"
                type="date"
                defaultValue={defaultGame?.rangeEnd ?? ""}
                className={inputClass}
              />
            </Field>
          </>
        )}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? "저장 중..." : submitLabel}
        </button>
      </VStack>
    </form>
  );
}
