#!/usr/bin/env bash
# Vercel ignoreCommand: exit 0 skips the build, anything else builds.
# Builds only main, and only when this app or the shared code changed since the last successful deployment.
# ponytail: a missing VERCEL_GIT_PREVIOUS_SHA (first deploy, outside the shallow clone) makes git diff fail, which builds.
[ "$VERCEL_GIT_COMMIT_REF" = "main" ] || exit 0
cd "$(git rev-parse --show-toplevel)" || exit 1
exec git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- \
  "apps/$1" packages configs package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json \
  ':(exclude)packages/database/drizzle' ':(exclude)**/*.md'
