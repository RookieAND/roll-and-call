import { describe, expect, it } from "vitest";

import { CERT_MANAGE_STATUS, SORT_DIR } from "@/shared/lib";

import { CERT_GRANT_METHOD } from "./cert-manage-row";
import { certManageRows } from "./cert-manage-rows";
import { filterCertManage } from "./filter-cert-manage";
import { orderCertManage } from "./order-cert-manage";
import type { AdminUser, CertApplication, Certification, Rulebook } from "./types";

const NOW = new Date("2026-10-05T00:00:00Z").getTime();
const day = (date: number) => new Date(`2026-09-${String(date).padStart(2, "0")}T00:00:00Z`);

const user = (id: string, nickname: string, overrides: Partial<AdminUser> = {}) =>
  ({
    id,
    nickname,
    discordId: `${id}-discord`,
    discordHandle: `${nickname}Handle`,
    ...overrides,
  }) as AdminUser;

const book = (id: string, overrides: Partial<Rulebook>) =>
  ({
    id,
    name: id,
    edition: "7판",
    category: "크툴루의 부름",
    kind: "core",
    supersedesId: null,
    aliases: [],
    certRequired: true,
    hidden: false,
    ...overrides,
  }) as Rulebook;

const certification = (userId: string, rulebookId: string, approvedAt: Date) =>
  ({ userId, rulebookId, rulebook: rulebookId, approvedAt, approvedBy: "운영진" }) as Certification;

const application = (overrides: Partial<CertApplication>) =>
  ({
    id: "application",
    userId: "coco",
    rulebookId: "keeper",
    rulebook: "keeper",
    direct: false,
    appliedAt: day(1),
    status: "pending",
    ...overrides,
  }) as CertApplication;

const users = [
  user("coco", "김코코"),
  user("dawn", "새벽세시", { sanction: { until: null, by: "운영진", at: day(1), reason: "" } }),
  user("whale", "하얀고래"),
];
const rulebooks = [
  book("keeper", {}),
  book("investigator", {}),
  book("companion", { kind: "supplement" }),
];

describe("certManageRows", () => {
  const rows = certManageRows({
    now: NOW,
    records: {
      users,
      rulebooks,
      certifications: [
        certification("coco", "keeper", day(18)),
        certification("dawn", "keeper", day(2)),
        certification("dawn", "investigator", day(11)),
      ],
      certApplications: [
        application({ id: "a1", userId: "coco", status: "approved", processedAt: day(18) }),
        application({ id: "a2", userId: "whale", appliedAt: day(19) }),
        application({
          id: "a3",
          userId: "whale",
          rulebookId: "companion",
          status: "rejected",
          appliedAt: day(3),
          processedAt: day(4),
        }),
        application({ id: "a4", userId: "coco", rulebookId: "companion", status: "withdrawn" }),
      ],
    },
  });
  const row = (userId: string, rulebookId: string) =>
    rows.find((item) => item.userId === userId && item.rulebookId === rulebookId);

  it("유저 × 책마다 한 행이고 거둔 신청만 있으면 행이 없다", () => {
    expect(rows).toHaveLength(5);
    expect(row("coco", "companion")).toBeUndefined();
  });

  it("인증됨은 승인된 사진 심사가 있으면 사진 심사, 없으면 운영진 부여다", () => {
    expect(row("coco", "keeper")).toMatchObject({
      status: CERT_MANAGE_STATUS.certified,
      method: CERT_GRANT_METHOD.photo,
      changedAt: day(18),
      editionEligible: false,
    });
    expect(row("dawn", "keeper")).toMatchObject({
      method: CERT_GRANT_METHOD.staff,
      editionEligible: true,
      sanctioned: true,
    });
  });

  it("인증이 없으면 마지막 신청으로 심사 중·반려됨을 정한다", () => {
    expect(row("whale", "keeper")).toMatchObject({
      status: CERT_MANAGE_STATUS.pending,
      changedAt: day(19),
      applicationId: "a2",
      editionEligible: null,
    });
    expect(row("whale", "companion")).toMatchObject({
      status: CERT_MANAGE_STATUS.rejected,
      changedAt: day(4),
    });
  });

  it("상태·판본·검색어·유저·룰북으로 거른다", () => {
    const keys = (filter: Parameters<typeof filterCertManage>[0]["filter"]) =>
      filterCertManage({ rows, filter }).map((item) => item.key);
    expect(keys({ status: CERT_MANAGE_STATUS.rejected })).toEqual(["whale:companion"]);
    expect(keys({ query: "WHALE-DISCORD" })).toEqual(["whale:keeper", "whale:companion"]);
    expect(keys({ query: "새벽" })).toHaveLength(2);
    expect(keys({ userId: "coco", rulebookId: "keeper" })).toEqual(["coco:keeper"]);
    expect(keys({ edition: "크툴루의 부름 6판" })).toEqual([]);
  });

  it("최근 변경 순으로 정렬하되 같은 유저의 행을 모으고 둘째부터 유저 칸을 비운다", () => {
    const ordered = orderCertManage({
      rows,
      sort: { column: "changed", dir: SORT_DIR.desc },
    });
    expect(ordered.map((item) => [item.key, item.sameUserAsAbove])).toEqual([
      ["whale:keeper", false],
      ["whale:companion", true],
      ["coco:keeper", false],
      ["dawn:investigator", false],
      ["dawn:keeper", true],
    ]);
  });

  it("유저 열은 닉네임 가나다순이다", () => {
    const ordered = orderCertManage({ rows, sort: { column: "user", dir: SORT_DIR.asc } });
    expect(ordered.map((item) => item.nickname)).toEqual([
      "김코코",
      "새벽세시",
      "새벽세시",
      "하얀고래",
      "하얀고래",
    ]);
  });
});
