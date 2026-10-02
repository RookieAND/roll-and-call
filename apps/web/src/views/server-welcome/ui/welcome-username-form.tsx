"use client";

import { Button, Field, FloatingBar, TextInput, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { USERNAME_MAX_LENGTH } from "@/entities/profile";
import { useAction } from "@/shared/ui";

import { saveWelcomeUsername } from "../api/save-welcome-username";

interface WelcomeUsernameFormProps {
  defaultUsername: string;
  next: string;
}

export function WelcomeUsernameForm({ defaultUsername, next }: WelcomeUsernameFormProps) {
  const [username, setUsername] = useState(defaultUsername);
  const [usernameError, setUsernameError] = useState<string>();
  const { pending, run } = useAction();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setUsernameError(undefined);
    run(() => saveWelcomeUsername({ username, next }), {
      onError: (result) => setUsernameError(result.error),
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col">
      <Field.Root
        label="닉네임"
        htmlFor="username"
        description="닉네임은 계정에 하나라서, 바꾸면 모든 서버에 함께 바뀌어요."
        error={usernameError}
      >
        <TextInput
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          invalid={!!usernameError}
          maxLength={USERNAME_MAX_LENGTH}
        />
      </Field.Root>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <VStack gap="050">
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              시작하기
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              render={<Link href={next} replace />}
            >
              나중에 하기
            </Button>
          </VStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </form>
  );
}
