"use server";

import {
  CREATE_HOMEBREW_ERROR,
  createHomebrewApplication,
  saveHomebrewStaffMessage,
} from "@roll-and-call/database/homebrew";
import { findActiveSanction } from "@roll-and-call/database/moderation";
import { getMemberIdentity } from "@roll-and-call/database/profiles";
import { redirect } from "next/navigation";
import { after } from "next/server";
import type { z } from "zod";

import { rulebookLabel } from "@/entities/rulebook";
import { parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notMemberError,
  postStaffNotice,
  STAFF_NOTICE_KIND,
} from "@/shared/server";

import { HOMEBREW_ERROR } from "../model/homebrew-error";
import { HOMEBREW_FIELD } from "../model/homebrew-field";
import { homebrewInputError } from "../model/homebrew-input-error";
import { homebrewInputSchema } from "../model/homebrew-input-schema";

const CREATE_ERROR_RESULT = {
  [CREATE_HOMEBREW_ERROR.pendingLimit]: { error: HOMEBREW_ERROR.pendingLimit },
  [CREATE_HOMEBREW_ERROR.nameTaken]: {
    error: HOMEBREW_ERROR.nameTaken,
    field: HOMEBREW_FIELD.name,
  },
  [CREATE_HOMEBREW_ERROR.previousInvalid]: { error: HOMEBREW_ERROR.previousInvalid },
} as const satisfies Record<string, ActionResult>;

// 신규와 재신청(previousId) 모두 새 신청 행을 만든다. 성공하면 자작 룰 상세(심사 중)로 간다.
export async function submitHomebrewApplication(
  input: z.input<typeof homebrewInputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(homebrewInputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const invalid = homebrewInputError({ input: parsed.data, serverId: server.id, userId: user.id });
  if (invalid) return invalid;
  if (await findActiveSanction({ serverId: server.id, userId: user.id })) {
    return { error: HOMEBREW_ERROR.sanctioned };
  }

  const application = {
    ...parsed.data,
    name: parsed.data.name.trim(),
    edition: parsed.data.edition.trim(),
    summary: parsed.data.summary.trim(),
  };
  const created = await createHomebrewApplication({
    serverId: server.id,
    userId: user.id,
    application,
  });
  if (!created.ok) return CREATE_ERROR_RESULT[created.error];

  after(async () => {
    const applicant = await getMemberIdentity({ serverId: server.id, userId: user.id });
    if (!applicant) return;
    const message = await postStaffNotice({
      server,
      notice: {
        kind: STAFF_NOTICE_KIND.homebrewApplied,
        applicantNickname: applicant.nickname,
        applicantAvatarUrl: applicant.avatarUrl,
        ruleLabel: rulebookLabel(application),
        applicationId: created.id,
      },
    });
    if (message) {
      await saveHomebrewStaffMessage({
        serverId: server.id,
        id: created.id,
        messageId: message.id,
      });
    }
  });
  redirect(serverPath({ slug: server.slug, path: `/me/rulebooks/maker/${created.id}` }));
}
