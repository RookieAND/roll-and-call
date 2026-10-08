"use client";

import { Button, Field, HStack, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

import { USERNAME_MAX_LENGTH } from "@/entities/profile";
import { LineBreaks, useAction } from "@/shared/ui";

import { saveWelcomeUsername } from "../api/save-welcome-username";
import { WELCOME_SAVE_MODE, type WelcomeSaveMode } from "../model/welcome-save-mode";

interface WelcomeUsernameFormProps {
  defaultUsername: string;
  next: string;
}

export function WelcomeUsernameForm({ defaultUsername, next }: WelcomeUsernameFormProps) {
  const [username, setUsername] = useState(defaultUsername);
  const [usernameError, setUsernameError] = useState<string>();
  const { pending, run } = useAction();

  function save(mode: WelcomeSaveMode) {
    setUsernameError(undefined);
    run(() => saveWelcomeUsername({ username, next, mode }), {
      onError: (result) => setUsernameError(result.error),
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(WELCOME_SAVE_MODE.start);
      }}
      className="flex flex-col"
    >
      <Field.Root
        label="닉네임"
        htmlFor="username"
        description="이 닉네임은 이 서버에서만 쓰입니다."
        error={usernameError && <LineBreaks lines={usernameError.split("\n")} />}
      >
        <TextInput
          id="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setUsernameError(undefined);
          }}
          invalid={!!usernameError}
          maxLength={USERNAME_MAX_LENGTH}
        />
      </Field.Root>

      <HStack gap="100" className="mt-250">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-0 flex-1"
          disabled={pending || !!usernameError}
          onClick={() => save(WELCOME_SAVE_MODE.later)}
        >
          나중에 하기
        </Button>
        <Button type="submit" size="lg" className="min-w-0 flex-1" disabled={pending}>
          시작하기
        </Button>
      </HStack>
    </form>
  );
}
