import type { AdminTableKey } from "@roll-and-call/database/moderation";

import type { AdminShapes } from "../types";
import { buildAuditLog } from "./build-audit-log";
import { buildCertApplications } from "./build-cert-applications";
import { buildCertifications } from "./build-certifications";
import { buildCertifiedUserIds } from "./build-certified-user-ids";
import { buildCountingNoShows } from "./build-counting-no-shows";
import { buildCountingSessions } from "./build-counting-sessions";
import { buildLastActive } from "./build-last-active";
import { buildMemberNicknames } from "./build-member-nicknames";
import { buildNicknameEdits } from "./build-nickname-edits";
import { buildNoShows } from "./build-no-shows";
import { buildQuizQuestions } from "./build-quiz-questions";
import { buildReviews } from "./build-reviews";
import { buildRulebookRequests } from "./build-rulebook-requests";
import { buildRulebooks } from "./build-rulebooks";
import { buildSellers } from "./build-sellers";
import { buildSessions } from "./build-sessions";
import { buildStaff } from "./build-staff";
import { buildStaffMemos } from "./build-staff-memos";
import { buildUsers } from "./build-users";
import type { ShapeContext } from "./shape-context";

interface ShapeSpec<Key extends keyof AdminShapes> {
  // build가 직접 읽는 표. nicknameOf를 쓰면 profileRows, rulebookLabelOf를 쓰면 rulebookRows도 적는다.
  tables: readonly AdminTableKey[];
  // build가 shape()로 부르는 다른 모양.
  needs?: readonly (keyof AdminShapes)[];
  build: (context: ShapeContext) => AdminShapes[Key];
}

export const SHAPE_REGISTRY: { [Key in keyof AdminShapes]: ShapeSpec<Key> } = {
  users: {
    tables: ["profileRows", "gameRows", "sanctionRows", "handleRows"],
    build: buildUsers,
  },
  staff: { tables: ["profileRows", "staffRows"], build: buildStaff },
  staffMemos: { tables: ["profileRows", "memoRows"], build: buildStaffMemos },
  rulebooks: { tables: ["rulebookRows"], build: buildRulebooks },
  certifications: {
    tables: ["profileRows", "rulebookRows", "certificationRows"],
    build: buildCertifications,
  },
  certApplications: {
    tables: ["profileRows", "rulebookRows", "applicationRows", "quizRows"],
    build: buildCertApplications,
  },
  quizQuestions: { tables: ["quizRows", "applicationRows"], build: buildQuizQuestions },
  sellers: { tables: ["sellerRows"], build: buildSellers },
  rulebookRequests: {
    tables: ["profileRows", "requestRows", "requestGameRows", "categoryRows"],
    needs: ["rulebooks"],
    build: buildRulebookRequests,
  },
  sessions: {
    tables: ["profileRows", "gameRows", "participantRows", "rulebookRows"],
    build: buildSessions,
  },
  noShows: { tables: ["profileRows", "gameRows", "participantRows"], build: buildNoShows },
  reviews: { tables: ["profileRows", "participantRows", "reviewRows"], build: buildReviews },
  auditLog: {
    tables: ["profileRows", "rulebookRows", "auditRows"],
    needs: ["reviews"],
    build: buildAuditLog,
  },
  countingSessions: { tables: ["gameRows", "participantRows"], build: buildCountingSessions },
  countingNoShows: { tables: ["gameRows", "participantRows"], build: buildCountingNoShows },
  lastActive: { tables: ["lastActiveRows"], build: buildLastActive },
  memberNicknames: { tables: ["profileRows"], build: buildMemberNicknames },
  nicknameEdits: { tables: ["nicknameEditRows"], build: buildNicknameEdits },
  certifiedUserIds: { tables: ["certificationRows"], build: buildCertifiedUserIds },
};
