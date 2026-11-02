"use client";

import {
  APPLICATION_QUESTION_DEFAULT,
  APPLICATION_QUESTION_MAX_LENGTH,
} from "@roll-and-call/database/games/model";
import { Field, Text, TextInput } from "@roll-and-call/ui";

import { applicationQuestionMessage } from "../model/application-question-message";

interface ApplicationQuestionFieldProps {
  value: string;
  onChange: (question: string) => void;
  locked: boolean;
  error?: string;
}

export function ApplicationQuestionField({
  value,
  onChange,
  locked,
  error,
}: ApplicationQuestionFieldProps) {
  const full = value.length >= APPLICATION_QUESTION_MAX_LENGTH;
  const counterForeground = full ? "danger" : "hint";
  const message = locked || error ? undefined : applicationQuestionMessage(value);
  const messageForeground = full ? "danger" : "hint";

  return (
    <Field.Root
      label="신청자에게 물을 질문"
      htmlFor="applicationQuestion"
      counter={
        <Text typography="body4" foreground={counterForeground} numeric render={<span />}>
          {`${value.length} / ${APPLICATION_QUESTION_MAX_LENGTH}`}
        </Text>
      }
      error={error}
      className="rounded-500 border border-gray-200 bg-gray-50 p-150"
    >
      <TextInput
        id="applicationQuestion"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={APPLICATION_QUESTION_DEFAULT}
        maxLength={APPLICATION_QUESTION_MAX_LENGTH}
        disabled={locked}
        autoComplete="off"
        aria-describedby={message ? "applicationQuestion-message" : undefined}
      />
      {message && (
        <Text
          id="applicationQuestion-message"
          typography="body4"
          foreground={messageForeground}
          render={<p />}
          className="break-keep"
        >
          {message}
        </Text>
      )}
    </Field.Root>
  );
}
